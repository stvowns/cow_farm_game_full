/**
 * Süt Üretimi Servisi
 * 
 * Bu servis, inek süt üretimi mekanizmasını yönetir.
 * useGameState hook'undan bağımsız olarak çalışır ve süt üretimi
 * ile ilgili tüm mantığı içerir.
 */

// Global değişkenler
let milkProductionInterval: NodeJS.Timeout | null = null;
let lastMilkUpdate = Date.now();
let currentMilkProductionRate = 0;
let currentMilk = 0;
let isProducing = false;

// Etkinlik çarpanı (varsayılan: 1)
let eventMultiplier = 1;

/**
 * Süt üretimini başlatır
 * 
 * @param health İneğin sağlığı
 * @param hasEverFed İnek hiç beslendi mi
 * @param hunger İneğin açlık değeri
 * @param milkProductionRate Süt üretim hızı (dakika başına litre)
 * @param milk Mevcut süt miktarı
 * @param setMilk Süt miktarını güncelleyen fonksiyon
 * @param forceHasEverFed hasEverFed değerini zorla true olarak ayarla
 * @param forceHunger hunger değerini zorla belirtilen değere ayarla
 */
export const startMilkProduction = (
  health: number,
  hasEverFed: boolean,
  hunger: number,
  milkProductionRate: number,
  milk: number,
  setMilk: (value: number) => void,
  forceHasEverFed = false,
  forceHunger = 0
) => {
  // Eğer sağlık 0 veya daha düşükse, inek hiç beslenmemişse veya açlık 0 veya daha düşükse süt üretimi yapma
  const effectiveHasEverFed = forceHasEverFed || hasEverFed;
  const effectiveHunger = forceHunger > 0 ? forceHunger : hunger;
  
  if (health <= 0 || !effectiveHasEverFed || effectiveHunger <= 0) {
    console.log('Süt üretimi koşulları sağlanmıyor:', { 
      health, 
      hunger, 
      hasEverFed, 
      forceHasEverFed, 
      effectiveHasEverFed,
      forceHunger,
      effectiveHunger
    });
    
    // Eğer interval varsa temizle
    if (milkProductionInterval) {
      clearInterval(milkProductionInterval);
      milkProductionInterval = null;
      isProducing = false;
    }
    
    return;
  }

  // Eğer zaten üretim yapılıyorsa, yeni bir interval oluşturma
  if (isProducing) {
    return;
  }

  // Global değişkenleri güncelle
  currentMilkProductionRate = milkProductionRate;
  currentMilk = milk;
  lastMilkUpdate = Date.now();
  isProducing = true;

  console.log('Süt üretimi başlatılıyor, verimlilik:', currentMilkProductionRate);
  
  // Her saniye süt üretimi yap
  milkProductionInterval = setInterval(() => {
    const now = Date.now();
    const elapsedSeconds = (now - lastMilkUpdate) / 1000;
    lastMilkUpdate = now;
    
    // Dakika başına üretim oranını saniye başına orana çevir ve etkinlik çarpanını uygula
    const milkPerSecond = (currentMilkProductionRate / 60) * eventMultiplier;
    
    // Süt miktarını güncelle
    currentMilk += milkPerSecond * elapsedSeconds;
    
    // State'i güncelle
    setMilk(currentMilk);
    
    // Log
    console.log(`Süt üretimi: ${milkPerSecond.toFixed(6)} Lt/sn, toplam: ${currentMilk.toFixed(6)} Lt`);
  }, 1000);
};

/**
 * Süt üretimini durdurur
 */
export const stopMilkProduction = () => {
  if (milkProductionInterval) {
    clearInterval(milkProductionInterval);
    milkProductionInterval = null;
    isProducing = false;
    console.log('Süt üretimi durduruldu');
  }
};

/**
 * Süt üretim hızını geçici olarak artırır (etkinlik için)
 * 
 * @param multiplier Çarpan (örn: 2 = 2x üretim hızı)
 */
export const setMilkProductionMultiplier = (multiplier: number) => {
  eventMultiplier = multiplier;
  console.log(`Süt üretim çarpanı ${multiplier}x olarak ayarlandı`);
};

/**
 * Mevcut süt üretim durumunu döndürür
 */
export const getMilkProductionStatus = () => {
  return {
    isProducing,
    currentMilkProductionRate,
    currentMilk,
    eventMultiplier
  };
};

/**
 * Süt miktarını sıfırlar (süt satışı için)
 */
export const resetMilk = () => {
  currentMilk = 0;
  console.log('Süt miktarı sıfırlandı');
};