import pytest
import asyncio
from unittest.mock import AsyncMock, patch
from datetime import datetime
from data.fetcher import BinanceFetcher
from data.models import Candle

@pytest.mark.asyncio
async def test_get_candles_success():
    fetcher = BinanceFetcher()
    
    # Mock data return from Binance
    mock_klines = [
        [1609459200000, "30000.0", "31000.0", "29000.0", "30500.0", "100.0"],
        [1609459260000, "30500.0", "31500.0", "30000.0", "31000.0", "150.0"],
    ]
    
    mock_client = AsyncMock()
    mock_client.futures_klines = AsyncMock(return_value=mock_klines)
    
    with patch.object(fetcher, '_get_client', return_value=mock_client):
        candles = await fetcher.get_candles("BTCUSDT", "1m", limit=2)
        
        assert len(candles) == 2
        assert isinstance(candles[0], Candle)
        assert candles[0].open == 30000.0
        assert candles[0].close == 30500.0
        assert mock_client.futures_klines.called

@pytest.mark.asyncio
async def test_convert_interval():
    fetcher = BinanceFetcher()
    assert fetcher._convert_interval("1h") == "1h"
    assert fetcher._convert_interval("15s") == "1m"
    
    with pytest.raises(ValueError):
        fetcher._convert_interval("invalid")
