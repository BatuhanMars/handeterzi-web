# Hande Terzi — Gayrimenkul Danışmanı Web Sitesi

`handeterzi.com.tr` için modern, sade-minimal gayrimenkul danışmanı sitesi ve
yönetim paneli. Danışman, tüm gayrimenkul portföyünü (konut, arsa, iş yeri,
ticari ve diğer taşınmazlar) **yalnızca admin panelinden** ekleyip yönetir;
ziyaretçiler ilanları portföy sayfasından inceler ve iletişim formuyla mesaj
bırakır.

## Teknolojiler

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** (sade minimal tasarım sistemi)
- **SQLite** (better-sqlite3) — harici veritabanı gerekmez, veriler `./data/app.db`
- Görseller yerel diske: `./public/uploads`
- Basit, tek-admin oturum (HMAC imzalı çerez)

> **Node 22 gereklidir.** better-sqlite3 yerel (native) bir modüldür ve Node 22
> ile derlenmiştir. `nvm use 22` ile çalıştırın.

## Kurulum & Çalıştırma

```bash
nvm use 22
npm install                  # bağımlılıklar
cp .env.example .env.local   # şifre ve gizli anahtarı düzenleyin
npm run seed                 # (opsiyonel) 7 örnek ilan + demo görseller
npm run dev                  # http://localhost:3000
```

Yayına almak için:

```bash
npm run build
npm start
```

## Yönetim Paneli

- Adres: **`/admin`** (giriş: `/admin/login`)
- Şifre: `.env.local` içindeki **`ADMIN_PASSWORD`** (varsayılan demo: `hande2026`)
- Yapılabilecekler:
  - İlan **ekleme / düzenleme / silme**
  - Fotoğraf **yükleme** (sürükle-bırak, kapak seçimi, sıralama)
  - İlanı **yayınla / taslağa al** ve **ana sayfada öne çıkar**
  - İletişim formundan gelen **mesajları** görüntüleme/yönetme

## Önemli Ayarlar (`.env.local`)

| Değişken | Açıklama |
|---|---|
| `ADMIN_PASSWORD` | Yönetim paneli giriş şifresi |
| `SESSION_SECRET` | Oturum çerezi imza anahtarı (`openssl rand -hex 32`) |
| `DATABASE_PATH` | (opsiyonel) SQLite dosya yolu, varsayılan `./data/app.db` |

Site metinleri (isim, ünvan, hakkımızda, iletişim, sosyal medya) tek dosyadan
düzenlenir: **`lib/site.ts`**.

## Sayfalar

| Genel | Yönetim |
|---|---|
| `/` Ana sayfa | `/admin` Panel (ilan listesi + istatistik) |
| `/portfoy` İlanlar (filtreli) | `/admin/ilan/yeni` Yeni ilan |
| `/portfoy/[slug]` İlan detayı | `/admin/ilan/[id]` İlan düzenle |
| `/hakkimizda` Hakkımda | `/admin/mesajlar` Mesajlar |
| `/iletisim` İletişim | |

## Veri Yedekleme

Tüm veri `./data/app.db` (SQLite) ve görseller `./public/uploads` içindedir.
Yedek almak için bu iki klasörü kopyalamanız yeterlidir.
