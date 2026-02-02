# Guardian

Guardian, kripto para piyasaları için geliştirilmiş, Python destekli bir analiz motoru ve modern bir web arayüzünden oluşan gelişmiş bir **Karar Destek Sistemidir**.

## 🚀 Proje Hakkında

Guardian, karmaşık piyasa verilerini analiz ederek traderlar için anlamlı sinyaller ve içgörüler üretir. Çoklu zaman dilimi analizi (MTF), teknik indikatörler ve özel puanlama algoritmaları kullanarak piyasa trendlerini belirlemeye yardımcı olur.

### Temel Özellikler
- **Gelişmiş Analiz Motoru:** Python tabanlı motor ile RSI, EMA, ZigZag gibi indikatörlerin gerçek zamanlı analizi.
- **Konsensüs Puanlaması:** Farklı stratejilerin birleştirilmesiyle oluşturulan güven skoru.
- **Modern Web Arayüzü:** Next.js, TailwindCSS ve Shadcn/UI ile oluşturulmuş hızlı ve responsive dashboard.
- **Kullanıcı Yönetimi:** Supabase tabanlı güvenli kimlik doğrulama ve veri saklama.

## 📂 Proje Yapısı

Bu proje bir Monorepo yapısındadır:

- **`apps/engine`**: Python ile geliştirilmiş arka uç analiz servisi. Binance veri entegrasyonu ve sinyal algoritmaları burada çalışır.
- **`apps/web`**: Next.js (React) ile geliştirilmiş ön yüz uygulaması. Kullanıcıların analizleri görüntülediği dashboard.
- **`infra`**: Docker ve altyapı konfigürasyonları.

## 🛠️ Kurulum ve Çalıştırma

### Gereksinimler
- Node.js (v18+)
- Python (v3.9+)
- Docker & Docker Compose

### 1. Repoyu Klonlayın
```bash
git clone https://github.com/onurpazaroglu-a11y/Guardian.git
cd Guardian
```

### 2. Çevresel Değişkenler (.env)
Kök dizindeki `.env.example` dosyasını kopyalayarak `.env` oluşturun ve gerekli Supabase/Binance ayarlarını girin.
```bash
cp .env.example .env
```

### 3. Bağımlılıkları Yükleyin

Web arayüzü için:
```bash
cd apps/web
npm install
```

Analiz motoru için (Python):
```bash
cd apps/engine
pip install -r requirements.txt
```

### 4. Uygulamayı Çalıştırın

Geliştirme modunda (Docker kullanmadan manuel başlatma):

**Terminal 1 (Web):**
```bash
cd apps/web
npm run dev
```

**Terminal 2 (Engine):**
```bash
cd apps/engine
python src/main.py
```

Docker ile tüm sistemi ayağa kaldırmak için:
```bash
docker-compose up --build
```

## 📄 Lisans

Bu proje [MIT](LICENSE) lisansı altında lisanslanmıştır.
