# İnek Çiftliği Oyunu

İnek Çiftliği, inek besleyerek süt üretimi yapabileceğiniz ve puanlar kazanabileceğiniz bir web tabanlı oyundur. Bu proje, modüler bir yapıda geliştirilmiş olup, süt üretimi ve etkinlik sistemi gibi temel mekanizmaları içerir.

## Proje Yapısı

Proje, aşağıdaki temel bileşenlerden oluşur:

- **Süt Üretimi Servisi**: İnek süt üretimi mekanizmasını yönetir.
- **Etkinlik Sistemi**: Oyun içi etkinlikleri yönetir (2x süt üretimi, 2x satış fiyatı vb.).
- **Oyun Konfigürasyonu**: Oyun parametrelerini merkezi bir dosyada toplar.

## Temel Mekanizmalar

### Süt Üretimi

İnek, aşağıdaki koşullar sağlandığında süt üretir:

- İneğin sağlığı 0'dan büyük olmalı
- İnek en az bir kez beslenmiş olmalı
- İneğin açlığı 0'dan büyük olmalı

Süt üretim hızı, kullanılan yemin verimine ve etkinlik çarpanına bağlıdır.

### Besleme Mekanizması

İneği beslemek için farklı yem türleri kullanabilirsiniz. Her yem türü:

- İneğin açlığını %25 artırır
- Kullanılan yemin verimine göre süt üretim hızını ayarlar
- İlk besleme, süt üretimini başlatır

### Etkinlik Sistemi

Oyun içi etkinlikler, belirli sürelerde çeşitli çarpanları değiştirebilir:

- **DOUBLE_MILK**: 2x süt üretimi
- **DOUBLE_PRICE**: 2x süt satış fiyatı
- **DOUBLE_XP**: 2x XP kazanımı
- **HALF_HUNGER**: 2x yavaş açlık azalması

## Geliştirme

Projeyi geliştirmek için:

1. Repo'yu klonlayın
2. `npm install` ile bağımlılıkları yükleyin
3. `npm run dev` ile geliştirme sunucusunu başlatın

## Dokümantasyon

Daha detaylı bilgi için [sorumluluklar.md](sorumluluklar.md) dosyasını inceleyebilirsiniz. Bu dosya, oyun mekanizmalarını ve dosya sorumluluklarını detaylı bir şekilde açıklar.

## Lisans

MIT