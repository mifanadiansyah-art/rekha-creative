/* =========================================================
   Rekha Creative — script.js
   JavaScript biasa (tanpa library) untuk interaksi kecil:
   1. Buka/tutup menu hamburger di mobile
   2. Bayangan navbar saat halaman di-scroll
   ========================================================= */

// Ambil elemen-elemen yang dibutuhkan dari HTML berdasarkan id-nya
const navbar = document.getElementById("navbar");
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");

/* ---------- 1. Menu hamburger ---------- */

// Fungsi untuk membuka atau menutup menu.
// Parameter "buka" bernilai true (buka) atau false (tutup).
function aturMenu(buka) {
  navMenu.classList.toggle("is-open", buka);              // tampil/sembunyikan panel menu (lihat CSS)
  navToggle.setAttribute("aria-expanded", String(buka));   // info untuk pembaca layar + animasi ikon X
  navToggle.setAttribute("aria-label", buka ? "Tutup menu" : "Buka menu");
}

// Klik tombol hamburger: kalau sedang tertutup → buka, kalau terbuka → tutup
navToggle.addEventListener("click", () => {
  const sedangTerbuka = navToggle.getAttribute("aria-expanded") === "true";
  aturMenu(!sedangTerbuka);
});

// Klik salah satu link di menu → menu otomatis tertutup (supaya konten terlihat)
navMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => aturMenu(false));
});

// Tekan tombol Escape → menu tertutup dan fokus kembali ke tombol hamburger
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && navMenu.classList.contains("is-open")) {
    aturMenu(false);
    navToggle.focus();
  }
});

// Kalau layar dilebarkan sampai ukuran desktop, pastikan status menu mobile di-reset
const layarDesktop = window.matchMedia("(min-width: 1024px)");
layarDesktop.addEventListener("change", (event) => {
  if (event.matches) aturMenu(false);
});

/* ---------- 2. Bayangan navbar saat scroll ---------- */

// Tambahkan kelas "is-scrolled" jika halaman sudah di-scroll lebih dari 8px.
// CSS akan memberi bayangan lembut (--shadow-float) pada navbar.
function cekScroll() {
  navbar.classList.toggle("is-scrolled", window.scrollY > 8);
}

// { passive: true } memberi tahu browser bahwa listener ini tidak memblokir scroll → lebih ringan
window.addEventListener("scroll", cekScroll, { passive: true });
cekScroll(); // jalankan sekali saat halaman dimuat (misalnya jika dibuka di tengah halaman)
