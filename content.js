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
  // TODO: akun TikTok belum ada — ganti username ini kalau sudah dibuat
  tiktok: "https://tiktok.com/@rekhacreative.id",
  portfolio: "https://www.behance.net/ifanadiansyah",   // tujuan kartu project & "View All Works"
};

/* ---------- 8 project di section Works ----------
   image : path gambar, mis. "assets/img/project-01.webp" (rasio ±7:5). Kosongkan "" untuk placeholder.
   link  : link case study. Kosongkan "" → pakai CONTACT.portfolio (Behance).
   Desktop menampilkan 4 kartu per halaman (2 halaman); mobile 1 kartu per langkah. */
const PROJECTS = [
  { name: "Project Name 01", category: "UI/UX Design · Mobile App", year: "2026", image: "", link: "" },
  { name: "Project Name 02", category: "Website · Landing Page", year: "2026", image: "", link: "" },
  { name: "Project Name 03", category: "Logo & Branding", year: "2026", image: "", link: "" },
  { name: "Project Name 04", category: "Lottie Animation", year: "2026", image: "", link: "" },
  { name: "Project Name 05", category: "Web App · Dashboard", year: "2026", image: "", link: "" },
  { name: "Project Name 06", category: "Marketing Visuals · Pitch Deck", year: "2026", image: "", link: "" },
  { name: "Project Name 07", category: "Interactive Prototype", year: "2026", image: "", link: "" },
  { name: "Project Name 08", category: "Marketing Visuals · Banner & Flyer", year: "2026", image: "", link: "" },
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
