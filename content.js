/* =========================================================
   Rekha Creative — content.js
   SEMUA konten yang masih placeholder ada di file ini.
   Ganti nilainya di sini saja, lalu simpan; halaman otomatis ikut berubah.
   ========================================================= */

/* ---------- Kontak & link ---------- */
const CONTACT = {
  whatsapp: "6282380382633",                        // format 628xxxxxxxxxx (tanpa + dan spasi)
  whatsappLabel: "+62 823-8038-2633",               // teks yang tampil di footer
  email: "rekhacreative.id@gmail.com",
  instagram: "https://instagram.com/rekhacreative.id",
  tiktok: "https://www.tiktok.com/@rekhacreative.id",
  portfolio: "https://www.behance.net/ifanadiansyah",   // tujuan kartu project & "View All Works"
};

/* ---------- Project di section Works (urutan = urutan tampil) ----------
   status : "live" (bisa diklik) · "in-development" (chip "In development", tidak bisa diklik)
            · "confidential" (cover terblur + chip "Confidential", tidak bisa diklik)
   image  : cover 588×420 (diekspor 2x). Untuk GIF isi juga "poster" (frame statis untuk prefers-reduced-motion).
   alt    : deskripsi cover untuk pembaca layar.
   links  : primary  = tujuan klik kartu/nama/panah (tab baru)
            playStore / appStore = tombol toko di cover (kosongkan "" kalau tidak ada)
   prototype : true → chip "Try prototype" di cover (menuju links.primary)
   badgePosition : "right" → tombol toko di kanan bawah cover (default kiri bawah)
   Desktop: grid 2 baris, 2 kolom terlihat, geser satu kolom per langkah.
            Tiap 2 project berurutan = satu kolom (atas, bawah): kolom 1 = project 1 & 2, kolom 2 = 3 & 4, dst.
   Mobile: 1 kartu per langkah, urut seperti daftar ini. */
const PROJECTS = [
  {
    name: "AyoMuslim",
    category: "UI/UX Design · Mobile App",
    year: "2025",
    status: "live",
    image: "assets/img/works/ayomuslim.webp",
    alt: "Tiga layar aplikasi AyoMuslim: jadwal sholat, beranda, dan bacaan Al-Qur'an",
    links: {
      primary: "https://play.google.com/store/apps/details?id=id.ayomuslim.app&pcampaignid=web_share",
      playStore: "https://play.google.com/store/apps/details?id=id.ayomuslim.app&pcampaignid=web_share",
      appStore: "https://apps.apple.com/id/app/ayomuslim-ibadah-komunitas/id6478108245?l=id",
    },
  },
  {
    name: "Gudang Buku – Graphic Standard Manual",
    category: "Logo & Branding",
    year: "2026",
    status: "live",
    image: "assets/img/works/gudangbuku.webp",
    alt: "Sampul Graphic Standard Manual Gudang Buku Bandung Selatan dengan logo putih di latar hijau zaitun",
    links: { primary: "https://www.behance.net/gallery/257523749/Graphic-standar-manual-Gudang-Buku-Bandung-Selatan?platform=direct" },
  },
  {
    name: "AyoSiswa",
    category: "UI/UX Design · Mobile & Website App",
    year: "2024",
    status: "live",
    image: "assets/img/works/ayosiswa.webp",
    alt: "Aplikasi AyoSiswa di iPhone dan halaman login versi website di laptop",
    badgePosition: "right",   // tombol toko di kanan bawah cover (kiri tertutup mockup HP)
    links: {
      primary: "https://app.ayosiswa.id",
      playStore: "https://play.google.com/store/apps/details?id=id.ayosiswa.app&pcampaignid=web_share",
      appStore: "https://apps.apple.com/id/app/ayosiswa/id6504911509?l=id",
    },
  },
  {
    name: "Masjid Makan Makan",
    category: "Website App",
    year: "2026",
    status: "in-development",
    image: "assets/img/works/masjid.webp",
    alt: "Website Masjid Makan Makan ditampilkan di laptop dan ponsel",
    links: {},
  },
  {
    name: "Card Design",
    category: "Logo & Branding",
    year: "2026",
    status: "confidential",
    image: "assets/img/works/carddesign.webp",
    alt: "Pratinjau desain kartu yang diburamkan karena proyek klien bersifat rahasia",
    links: {},
  },
  {
    name: "Praktikum Transpor Aktif",
    category: "Interactive Prototype",
    year: "2026",
    status: "live",
    image: "assets/img/works/praktikum.gif",
    poster: "assets/img/works/praktikum-poster.webp",
    alt: "Animasi pompa ion natrium-kalium pada membran sel dari prototype Praktikum Transpor Aktif",
    prototype: true,
    links: {
      primary: "https://www.figma.com/proto/B1JlTgthTC6I9Hu1W0qA5E/PRAKTIKUM-TRANSPOR-AKTIF?node-id=1091-183&starting-point-node-id=1091%3A171&t=b1MDkAEqs6QJuF4G-1",
    },
  },
  {
    name: "Hiring Poster - PT RIN",
    category: "Poster Design",
    year: "2025",
    status: "confidential",
    image: "assets/img/works/conf-hiring.webp",
    alt: "Deretan poster lowongan kerja Manager HR Development PT RIN",
    links: {},
  },
  {
    name: "Pitch Deck Kick Off Meeting - PT RIN",
    category: "Pitch Deck Design",
    year: "2026",
    status: "confidential",
    image: "assets/img/works/conf-kickoff.webp",
    alt: "Deretan slide pitch deck Kick Off Meeting pengembangan aplikasi ERP PT RIN",
    links: {},
  },
  {
    name: "Proposal Jual Seragam - PT RAK",
    category: "Proposal Design",
    year: "2026",
    status: "confidential",
    image: "assets/img/works/conf-proposal.webp",
    alt: "Deretan halaman proposal penjualan seragam sekolah PT RAK",
    links: {},
  },
  {
    name: "Pitch Deck AyoSiswa - PT RIN",
    category: "Pitch Deck Design",
    year: "2025",
    status: "confidential",
    image: "assets/img/works/conf-pitchayo.webp",
    alt: "Deretan slide pitch deck aplikasi AyoSiswa PT RIN",
    links: {},
  },
];

/* ---------- Angka statistik ----------
   value = angka yang dihitung naik; prefix/suffix = teks sebelum/sesudah angka */
const STATS = {
  hero: { value: 120, suffix: "+", label: "Screens designed" },
  numbers: [
    { value: 30, suffix: "+", label: "Projects delivered" },
    { value: 4, suffix: "+", label: "Years of experience" },
    { value: 15, suffix: "+", label: "Happy clients" },
    { prefix: "< ", value: 3, suffix: "h", label: "Average reply time" },
  ],
};
