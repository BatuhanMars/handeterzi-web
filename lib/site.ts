// Central place for editable site content (name, contact, about copy).
// Everything here is plain text the owner can change freely.
// Gerçek bilgiler handeterzi.com.tr'den alınmıştır (Haziran 2026).

export const site = {
  name: "Hande Terzi",
  role: "Gayrimenkul & Yatırım Danışmanı",
  tagline: "Doğru yatırım, doğru zamanda başlar.",
  heroSubtitle:
    "Arsa, villa, yazlık ve yatırım odaklı gayrimenkul danışmanlığı. Balıkesir, Çanakkale ve İstanbul'da doğru fırsatları sizin için değerlendiriyorum.",

  // Logo varlıkları (public/brand). Şeffaf, altın renkli.
  logoMark: "/brand/logo-mark.png", // HT monogramı
  logoFull: "/brand/logo-full.png", // Tam logo kilidi
  portrait: "/brand/hande-terzi.jpg", // Hande Terzi portresi

  // İletişim bilgileri — handeterzi.com.tr'den alındı.
  phone: "0532 132 14 79",
  phoneHref: "+905321321479",
  whatsapp: "905321321479",
  email: "info@handeterzi.com.tr",

  // Hizmet verilen bölgeler (tek bir adres yerine).
  regions: ["Balıkesir", "Çanakkale", "İstanbul"],
  address: "Balıkesir • Çanakkale • İstanbul",
  // Harita Balıkesir / Kuzey Ege bölgesine odaklı.
  mapEmbed:
    "https://www.google.com/maps?q=Bal%C4%B1kesir%2C+T%C3%BCrkiye&z=8&output=embed",

  workingHours: "Hafta içi & hafta sonu · 09:00 – 20:00",

  social: {
    instagram: "https://instagram.com/handeterzi",
    facebook: "",
    linkedin: "",
  },

  // "Hakkımda" sayfası içeriği.
  // NOT: Aşağıdaki biyografi metni, Hande Terzi'nin gerçek konumlandırmasına
  // (arsa/villa/yazlık/yatırım danışmanlığı) sadık olarak hazırlanmış taslaktır.
  // Kendi metninizle dilediğiniz gibi güncelleyebilirsiniz.
  about: {
    lead: "Gayrimenkul yalnızca bir alım–satım değil, geleceğe yapılan bir yatırımdır. Ben de bu yatırımı sizin için doğru zamanda, doğru yerde ve güvenle gerçekleştirmek için buradayım.",
    paragraphs: [
      "Arsa, villa ve yazlık başta olmak üzere yatırım odaklı gayrimenkul danışmanlığı veriyorum. Balıkesir, Çanakkale ve İstanbul başta olmak üzere bölgenin dinamiklerini yakından takip ediyor; her müşterimin bütçesine ve hedefine en uygun fırsatı bulmayı ilke ediniyorum.",
      "Çalışma anlayışımın merkezinde şeffaflık ve güven var. Doğru fiyatlama, eksiksiz evrak takibi ve gerçekçi bilgilendirme ile alım, satım ve yatırım süreçlerinizin her aşamasında yanınızdayım. Pazarlık, sözleşme ve tapu işlemlerini sizin adınıza titizlikle yürütüyorum.",
      "Amacım yalnızca bir gayrimenkul satmak değil; sizin için doğru zamanda doğru yatırımı yapmanızı sağlamak. Çünkü doğru yatırım, doğru zamanda başlar.",
    ],
    stats: [
      { value: "3", label: "Hizmet Bölgesi" },
      { value: "%100", label: "Şeffaf Süreç" },
      { value: "7/24", label: "Ulaşılabilir Danışman" },
      { value: "Yatırım", label: "Odaklı Yaklaşım" },
    ],
  },

  // Ana sayfada gösterilen hizmetler — Hande Terzi'nin uzmanlık alanlarına göre.
  services: [
    {
      title: "Yatırımlık Arsa",
      description:
        "İmar durumu netleştirilmiş, değer artış potansiyeli yüksek arsa ve arazilerde güvenilir alım–satım danışmanlığı.",
    },
    {
      title: "Villa & Müstakil Konut",
      description:
        "Doğayla iç içe, yaşam kalitesi yüksek villa ve müstakil konutlarda doğru fiyatlama ve sonuç odaklı satış yönetimi.",
    },
    {
      title: "Yazlık & Tatil Evi",
      description:
        "Ege ve Marmara kıyılarında yazlık ve tatil amaçlı gayrimenkullerde fırsat odaklı danışmanlık.",
    },
    {
      title: "Yatırım Danışmanlığı",
      description:
        "Bütçenize ve hedefinize uygun, getiri potansiyeli yüksek gayrimenkul yatırımlarının planlanması.",
    },
    {
      title: "Bölge Uzmanlığı",
      description:
        "Balıkesir, Çanakkale ve İstanbul'da yerinde, güncel ve veriye dayalı piyasa bilgisi.",
    },
    {
      title: "Eğitim & Bilgilendirme",
      description:
        "Gayrimenkul yatırımı yapmak isteyenlere yönelik şeffaf bilgilendirme ve birebir danışmanlık.",
    },
  ],
};

export type SiteConfig = typeof site;
