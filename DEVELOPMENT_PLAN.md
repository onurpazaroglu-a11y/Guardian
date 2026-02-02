# Guardian Geliştirme Planı (Roadmap)

Bu belge, Guardian projesinin mevcut "stabil iskelet" aşamasından tam fonksiyonel bir "karar destek sistemi" aşamasına geçişi için gerekli teknik adımları ve öncelikleri içerir.

## 📅 Faz 1: Altyapı ve Gerçek Veri (Kısa Vadeli)
*Amacı: Mock sistemlerden kurtulup gerçek veritabanı ve borsa bağlantılarını kurmak.*

### 1.1. Gerçek Supabase Entegrasyonu
- [ ] **Auth Geçişi:** `authStore.ts` içindeki mock mantığını Supabase `auth.signInWithPassword` ile değiştirmek.
- [ ] **Profil Yönetimi:** `002_auth.sql` migrasyonunu tamamlayıp kullanıcı tier (free/pro) bilgilerini veritabanından yönetmek.
- [ ] **Middleware:** Pasif hale getirilen `middleware.ts` dosyasını gerçek oturum kontrolü için aktive etmek.

### 1.2. Sağlam Veri Çekme Motoru (Binance)
- [ ] **BinanceFetcher Geliştirme:** API anahtarı yönetimi, rate-limit kontrolü ve WebSocket üzerinden anlık fiyat beslemesi.
- [ ] **Hata Yönetimi:** Borsa kesintileri veya geçersiz semboller için merkezi bir hata yakalama mekanizması.

---

## 🚀 Faz 2: Sinyal Zekası ve Algoritma Geliştirme (Orta Vadeli)
*Amacı: Analizlerin kalitesini ve tutarlılığını (Consistency) artırmak.*

### 2.1. İndikatör Kütüphanesinin Genişletilmesi
- [ ] **ZigZag & Fibonacci:** Sinyal modülüne trend dönüşlerini ve düzeltme seviyelerini anlamlandıracak matematiksel modellerin eklenmesi.
- [ ] **Çoklu Zaman Dilimi (MTF):** Bir üst zaman dilimindeki (örneğin 4H) trendin, alt zaman dilimindeki (15m) sinyal puanını etkilemesi.

### 2.2. ConsistencyScorer 2.0
- [ ] **Ağırlıklı Puanlama:** Her indikatörün (RSI vs EMA) başarı oranına göre toplam skora farklı oranlarda etki etmesi.
- [ ] **Backtest Modülü:** Geçmiş veriler üzerinde üretilen sinyallerin başarı oranını ölçen basit bir regresyon testi.

---

## 🎨 Faz 3: Kullanıcı Deneyimi ve Dashboard (Uzun Vadeli)
*Amacı: Kullanıcının sistemi günlük trading rutinine dahil etmesini sağlamak.*

### 3.1. Analiz Geçmişi ve Performans Takibi
- [ ] **History Page:** Kullanıcının geçmiş analizlerini filtreleyebileceği ve sonuçlarını (başarılı/başarısız) işaretleyebileceği bir arayüz.
- [ ] **İstatistikler:** Hangi stratejinin (Breakout vs Pullback) kullanıcı bazında daha iyi çalıştığını gösteren grafikler.

### 3.2. Pro Tier ve Abonelik
- [ ] **Ödeme Entegrasyonu:** Stripe üzerinden aylık abonelik sistemi.
- [ ] **Anlık Bildirimler:** Belirlenen semboller için "Scorer Puanı 80'i geçti" gibi tarayıcı veya Telegram bildirimleri.

---

## 🛠️ Teknik Öncelikler (Next Steps)
Hemen başlanabilecek en kritik 3 görev:
1. `middleware.ts` ve `AuthInitializer` üzerinden gerçek auth akışını bağlamak.
2. `BinanceFetcher` sınıfını production-ready hale getirmek.
3. Dashboard üzerinde "Geçmiş Analizler" tablosunu oluşturmak.

**Son Güncelleme:** 1 Şubat 2026
