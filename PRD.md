# Guardian - Ürün Gereksinim Belgesi (PRD)

## 1. Giriş
Guardian, kripto para piyasalarında işlem yapan kullanıcılar için geliştirilmiş, teknik analiz tabanlı bir **Karar Destek Sistemidir**. Sistem, çoklu indikatörler ve zaman dilimleri üzerinden piyasayı analiz ederek kullanıcılara tutarlı işlem sinyalleri ve piyasa öngörüleri sunmayı hedefler.

## 2. Ürün Vizyonu
Kullanıcıların duygusal kararlardan uzak, veri ve matematiksel modellere dayalı işlem stratejileri geliştirmesine yardımcı olmak. "Stabil iskelet" yapısından, tam kapsamlı bir trading asistanına dönüşmek.

## 3. Hedef Kitle
- Kripto para traderları (Spot ve Vadeli İşlemler).
- Teknik analiz ile ilgilenen ve otomatikleştirilmiş içgörülere ihtiyaç duyan yatırımcılar.

## 4. Temel Özellikler

### 4.1. Analiz Motoru (Engine)
- **Veri Kaynağı:** Binance API üzerinden gerçek zamanlı fiyat ve mum verisi (WebSocket & REST).
- **Teknik İndikatörler:** RSI, EMA, ZigZag, Fibonacci seviyeleri.
- **Çoklu Zaman Dilimi (MTF):** Üst zaman dilimlerinin (örn. 4H), alt zaman dilimlerindeki (örn. 15dk) sinyalleri filtrelemesi ve onaylaması.
- **Consistency Scorer:** Farklı indikatörlerden gelen verileri ağırlıklandırarak tek bir "Güven Skoru" üretimi.

### 4.2. Kullanıcı Arayüzü (Web)
- **Dashboard:** Anlık piyasa durumu, aktif sinyaller ve analiz özetleri.
- **Grafikler:** TradingView benzeri veya özel `recharts` tabanlı fiyat ve indikatör grafikleri.
- **Geçmiş Analizler:** Sistemin ürettiği eski sinyallerin başarı oranlarının takibi.

### 4.3. Kullanıcı Yönetimi & Sistem
- **Kimlik Doğrulama:** Supabase Auth (E-posta/Şifre).
- **Üyelik Modeli:** Free ve Pro tier (Supabase veritabanı kontrollü).
- **Güvenlik:** API anahtarlarının ve kullanıcı verilerinin güvenli saklanması.

## 5. Teknik Mimari
Proje bir **Monorepo** yapısındadır:
- **`apps/engine` (Python):** Veri toplama, teknik analiz hesaplamaları ve sinyal üretimi.
- **`apps/web` (Next.js):** Kullanıcı arayüzü, dashboard ve yönetim paneli.
- **Veritabanı (Supabase):** Kullanıcı verileri, analiz geçmişi ve konfigürasyonlar.
- **Altyapı:** Docker konteynerizasyonu ile servislerin orkestrasyonu.

## 6. Yol Haritası (Özet)
Detaylı teknik plan için `DEVELOPMENT_PLAN.md` dosyasına bakınız.
1.  **Faz 1:** Gerçek veri entegrasyonu (Binance) ve Supabase Auth geçişi.
2.  **Faz 2:** Gelişmiş sinyal algoritmaları ve backtest modülleri.
3.  **Faz 3:** Üyelik sistemi, ödeme entegrasyonu ve bildirim sistemi.
