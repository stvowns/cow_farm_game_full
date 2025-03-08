# İnek Çiftliği Oyunu - Kod Sorumlulukları ve Mekanizmalar

Bu belge, İnek Çiftliği oyununun temel mekanizmalarını ve bunların hangi dosyalarda yer aldığını açıklar. Bu belge, gelecekteki geliştirmeler ve değişiklikler için bir rehber olarak kullanılabilir.

## Temel Mekanizmalar ve Sorumlu Dosyalar

### 1. Oyun Durumu Yönetimi

**Ana Dosya:** `frontend/src/hooks/useGameState.ts`

Bu dosya, oyunun genel durumunu yönetir ve aşağıdaki temel mekanizmaları içerir:
- İnek sağlığı, açlığı ve süt üretimi gibi temel özelliklerin durumlarını tutar
- Oyuncu puanları, seviye ve XP gibi oyun istatistiklerini yönetir
- Besleme, süt satışı gibi temel oyun aksiyonlarını sağlar

### 2. Süt Üretimi Mekanizması

**Ana Dosya:** `frontend/src/services/milkProductionService.ts`

Süt üretimi mekanizması artık ayrı bir servis dosyasında yönetilir:

- **Süt Üretimini Başlatma:** `startMilkProduction` fonksiyonu
- **Süt Üretimini Durdurma:** `stopMilkProduction` fonksiyonu
- **Süt Üretim Çarpanını Ayarlama:** `setMilkProductionMultiplier` fonksiyonu (etkinlikler için)
- **Süt Üretim Durumunu Alma:** `getMilkProductionStatus` fonksiyonu

**Süt Üretimi Koşulları:**
- İneğin sağlığı 0'dan büyük olmalı
- İnek en az bir kez beslenmiş olmalı (`hasEverFed` değişkeni `true` olmalı)
- İneğin açlığı 0'dan büyük olmalı

**Süt Üretim Hızını Etkileyen Faktörler:**
- Kullanılan yemin verimi (`FEEDS` sabitindeki `yield` değeri)
- Etkinlik çarpanı (`eventMultiplier` değişkeni)

### 3. Besleme Mekanizması

**Ana Dosya:** `frontend/src/hooks/useGameState.ts`

- **Besleme Fonksiyonu:** `handleFeedCow` fonksiyonu
- **Yem Türleri ve Özellikleri:** `frontend/src/config/gameConfig.ts` içindeki `FEEDS` sabiti

Besleme işlemi şunları yapar:
- İneğin açlığını %25 artırır
- Kullanılan yemin verimine göre süt üretim hızını ayarlar
- `hasEverFed` değerini `true` yapar (ilk besleme için önemli)
- Süt üretimini başlatır

### 4. Açlık Mekanizması

**Ana Dosya:** `frontend/src/hooks/useHunger.ts`

- Açlık değeri zamanla azalır (240 dakikada 100'den 0'a)
- Açlık 0'a düştüğünde sağlık azalmaya başlar
- Açlık parametreleri `frontend/src/config/gameConfig.ts` içindeki `HUNGER` sabitinde tanımlanır

### 5. Sağlık Mekanizması

**Ana Dosya:** `frontend/src/hooks/useHealth.ts`

- Açlık 0 olduğunda sağlık azalmaya başlar
- Sağlık 0'a düştüğünde inek ölür
- Sağlık parametreleri `frontend/src/config/gameConfig.ts` içindeki `HEALTH` sabitinde tanımlanır

### 6. Etkinlik Sistemi

**Ana Dosya:** `frontend/src/services/eventService.ts`

Etkinlik sistemi, belirli sürelerde çeşitli çarpanları (süt üretimi, satış fiyatı vb.) değiştirebilir:

- **Etkinlik Başlatma:** `startEvent` fonksiyonu
- **Etkinlik Sonlandırma:** `endEvent` fonksiyonu
- **Etkinlik Sistemi Başlatma:** `initEventSystem` fonksiyonu
- **Etkinlik Sistemi Durdurma:** `stopEventSystem` fonksiyonu
- **Aktif Etkinlik Bilgisi Alma:** `getActiveEvent` fonksiyonu

**Etkinlik Türleri:**
- `DOUBLE_MILK`: 2x süt üretimi
- `DOUBLE_PRICE`: 2x süt satış fiyatı
- `DOUBLE_XP`: 2x XP kazanımı
- `HALF_HUNGER`: 2x yavaş açlık azalması

### 7. Oyun Konfigürasyonu

**Ana Dosya:** `frontend/src/config/gameConfig.ts`

Bu dosya, oyunun temel parametrelerini içerir:

- **Yem Türleri:** `FEEDS` sabiti
- **Süt Üretimi Parametreleri:** `MILK_PRODUCTION` sabiti
- **Açlık Parametreleri:** `HUNGER` sabiti
- **Sağlık Parametreleri:** `HEALTH` sabiti
- **XP ve Seviye Parametreleri:** `LEVEL` sabiti
- **Etkinlik Parametreleri:** `EVENTS` sabiti

### 8. Görsel Bileşenler

**İnek Görünümü:** `frontend/src/components/Cow.tsx`
**İstatistik Kartları:** `frontend/src/components/StatCard.tsx`
**Market:** `frontend/src/components/Market.tsx`

- `StatCard.tsx` içindeki `formatValue` fonksiyonu, süt üretimi gibi değerlerin nasıl görüntüleneceğini belirler
- Süt üretimi değeri için özel formatlama `title === 'Süt Üretimi'` kontrolü ile yapılır

## Yaygın Değişiklik Senaryoları

### Süt Üretim Hızını Artırma (Örn: 2x Etkinlik)

Süt üretim hızını geçici olarak artırmak için:

1. Etkinlik sistemi kullanarak:
   ```typescript
   import { startEvent } from '../services/eventService';
   import { EVENTS } from '../config/gameConfig';
   
   // 30 dakikalık 2x süt üretimi etkinliği başlat
   startEvent(EVENTS.TYPES.DOUBLE_MILK, 30);
   ```

2. Doğrudan süt üretim çarpanını değiştirerek:
   ```typescript
   import { setMilkProductionMultiplier } from '../services/milkProductionService';
   
   // Süt üretim çarpanını 2x yap
   setMilkProductionMultiplier(2);
   ```

### Yeni Yem Türü Ekleme

Yeni bir yem türü eklemek için:

1. `frontend/src/config/gameConfig.ts` dosyasındaki `FEEDS` dizisine yeni bir yem ekleyin:
   ```typescript
   {
     name: "Süper Yem",
     price: 1000,
     yield: 0.1, // Dakika başına 0.1 litre
     energy: 30,
     minLevel: 5,
     icon: GiWheat
   }
   ```

### Süt Satış Fiyatını Değiştirme

Süt satış fiyatını değiştirmek için:

1. `frontend/src/config/gameConfig.ts` dosyasındaki `MILK_PRODUCTION.PRICE_PER_LITER` değerini değiştirin:
   ```typescript
   export const MILK_PRODUCTION = {
     // Süt satış fiyatı (1 litre süt = 150 puan)
     PRICE_PER_LITER: 150,
     // ... diğer parametreler
   };
   ```

2. Etkinlik sistemi kullanarak geçici olarak değiştirmek için:
   ```typescript
   import { startEvent } from '../services/eventService';
   import { EVENTS } from '../config/gameConfig';
   
   // 30 dakikalık 2x süt satış fiyatı etkinliği başlat
   startEvent(EVENTS.TYPES.DOUBLE_PRICE, 30);
   ```

## Öneriler ve İyileştirmeler

1. **Durum Yönetimi:** Karmaşık durum yönetimi için Redux veya Context API kullanılabilir.

2. **Besleme Mekanizması Servisi:** Besleme mekanizması için ayrı bir servis dosyası oluşturulabilir.

3. **Sağlık ve Açlık Servisleri:** Sağlık ve açlık mekanizmaları için ayrı servis dosyaları oluşturulabilir.

4. **Kullanıcı Arayüzü İyileştirmeleri:** Etkinlikler için bildirim sistemi ve görsel efektler eklenebilir.

5. **Oyun İstatistikleri:** Oyun istatistiklerini kaydetmek ve görüntülemek için bir sistem eklenebilir.