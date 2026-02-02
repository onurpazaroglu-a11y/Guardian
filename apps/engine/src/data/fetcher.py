# Binance API wrapper

import asyncio
from typing import List, Optional
from datetime import datetime
import structlog
import httpx

from binance import AsyncClient
from binance.exceptions import BinanceAPIException

from core.config import settings
from core.exceptions import BinanceAPIError, InvalidSymbolError
from data.models import Candle

logger = structlog.get_logger(__name__)

class BinanceFetcher:
    """Binance API wrapper for fetching market data using AsyncClient"""
    
    def __init__(self):
        self._client: Optional[AsyncClient] = None
        self.api_key = settings.BINANCE_API_KEY
        self.api_secret = settings.BINANCE_SECRET
        self.testnet = settings.BINANCE_TESTNET

    async def _get_client(self) -> AsyncClient:
        """Lazy initialization of AsyncClient"""
        if self._client is None:
            if not self.api_key or not self.api_secret:
                logger.warning("Binance API keys are missing. Some endpoints may fail.")
            
            self._client = await AsyncClient.create(
                api_key=self.api_key or None,
                api_secret=self.api_secret or None,
                testnet=self.testnet
            )
        return self._client

    async def close(self):
        """Close the client connection"""
        if self._client:
            await self._client.close_connection()
            self._client = None

    async def get_candles(
        self,
        symbol: str,
        interval: str,
        limit: int = 100,
        delay_candles: int = 0,
        market: str = "futures"
    ) -> List[Candle]:
        """
        Fetch candlestick data asynchronously
        
        Args:
            delay_candles: For free tier, shift back N candles (lag)
        """
        try:
            # 1. Check if mock market is active
            if settings.MOCK_MARKET_URL:
                return await self._get_mock_candles(symbol, interval, limit, delay_candles, market)
            
            client = await self._get_client()
            
            # Convert interval to Binance format
            binance_interval = self._convert_interval(interval)
            
            logger.info("fetching_candles", symbol=symbol, interval=interval, limit=limit)

            # Determine API endpoint
            if market == "futures":
                klines = await client.futures_klines(
                    symbol=symbol,
                    interval=binance_interval,
                    limit=limit + delay_candles
                )
            else:
                klines = await client.get_klines(
                    symbol=symbol,
                    interval=binance_interval,
                    limit=limit + delay_candles
                )
            
            candles = self._parse_klines(klines)
            
            # Apply delay for free tier (remove last N candles)
            if delay_candles > 0:
                candles = candles[:-delay_candles]
            
            return candles
            
        except BinanceAPIException as e:
            if e.code == -1121:
                raise InvalidSymbolError(f"Invalid symbol: {symbol}")
            logger.error("binance_api_error", error=str(e))
            raise BinanceAPIError(f"Binance API error: {e}")
        except Exception as e:
            logger.error("unexpected_error", error=str(e))
            raise BinanceAPIError(f"Unexpected error fetching data: {e}")

    def _parse_klines(self, klines: list) -> List[Candle]:
        """Parse Binance kline format to Candle objects"""
        candles = []
        for k in klines:
            candles.append(Candle(
                timestamp=datetime.fromtimestamp(k[0] / 1000),
                open=float(k[1]),
                high=float(k[2]),
                low=float(k[3]),
                close=float(k[4]),
                volume=float(k[5])
            ))
        return candles

    async def _get_mock_candles(
        self,
        symbol: str,
        interval: str,
        limit: int,
        delay_candles: int,
        market: str
    ) -> List[Candle]:
        """Fetch data from mock market instead of real Binance"""
        # Binance format for candles: [ [timestamp, open, high, low, close, volume, ...], ... ]
        # Mock usually follows this or has a similar JSON structure
        
        base_url = settings.MOCK_MARKET_URL.rstrip('/')
        
        # Try various common endpoints for mock market compatibility
        endpoints = [
            "/fapi/v1/klines", 
            "/api/v3/klines", 
            "/api/v2/klines", 
            "/api/v1/klines", 
            "/api/klines",
            "/klines"
        ]
        
        async with httpx.AsyncClient() as client:
            # Debug: what is at the root?
            try:
                root_res = await client.get(base_url, timeout=2.0)
                logger.info("mock_market_root_test", status=root_res.status_code, body=root_res.text[:200])
            except:
                pass

            last_error = ""
            for endpoint in endpoints:
                url = f"{base_url}{endpoint}"
                logger.info("fetching_mock_candles_attempt", url=url, symbol=symbol)
                
                try:
                    params = {
                        "symbol": symbol,
                        "interval": self._convert_interval(interval),
                        "limit": limit + delay_candles
                    }
                    response = await client.get(url, params=params, timeout=5.0)
                    
                    if response.status_code == 200:
                        klines = response.json()
                        logger.info("mock_market_success", url=url, count=len(klines))
                        return self._parse_klines(klines)
                    
                    last_error = f"Status {response.status_code}: {response.text[:100]}"
                except Exception as e:
                    last_error = str(e)
                    continue
            
            logger.error("mock_market_all_endpoints_failed", last_error=last_error)
            raise BinanceAPIError(f"Mock market failed on all endpoints. Last error: {last_error}")

    def _convert_interval(self, interval: str) -> str:
        """Convert internal interval to Binance format"""
        mapping = {
            "15s": "1m",  # Binance doesn't have 15s, use 1m
            "1m": "1m",
            "5m": "5m",
            "15m": "15m",
            "30m": "30m",
            "1h": "1h",
            "4h": "4h",
            "1d": "1d",
        }
        if interval not in mapping:
            raise ValueError(f"Unsupported interval: {interval}")
        return mapping[interval]