/* =========================================================
   Rekha Creative — script.js
   JavaScript biasa (tanpa library) untuk interaksi kecil:
   1. Buka/tutup menu hamburger di mobile
   2. Bayangan navbar saat halaman di-scroll
   3. Animasi garis SVG di Hero
   4. Animasi muncul saat scroll
   ========================================================= */

// Tandai bahwa JavaScript aktif. CSS memakai kelas .js ini agar elemen .reveal
// hanya disembunyikan kalau JS jalan (kalau JS gagal, konten tetap terlihat).
document.documentElement.classList.add("js");

// Cek apakah pengguna memilih "kurangi animasi" di pengaturan HP/komputernya
const kurangiAnimasi = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

/* ---------- 3. Animasi garis SVG di Hero ---------- */

// Setiap <svg class="draw"> akan "digambar" garis per garis.
// Caranya: ukur panjang tiap garis dengan getTotalLength(), simpan ke variabel CSS --len,
// lalu CSS (lihat bagian 5b di style.css) menganimasikan stroke-dashoffset ke 0.
if (!kurangiAnimasi) {
  document.querySelectorAll(".draw").forEach((svg) => {
    const bentuk = svg.querySelectorAll("path, line, rect, circle");
    bentuk.forEach((el, urutan) => {
      // +8 supaya ujung garis yang membulat (round cap) tidak terlihat sebagai titik sebelum mulai
      const panjang = Math.ceil(el.getTotalLength()) + 8;
      el.style.setProperty("--len", panjang);
      el.style.setProperty("--delay", `${urutan * 0.08}s`); // garis berikutnya mulai sedikit lebih lambat
    });
    svg.classList.add("is-drawing");
  });
}

/* ---------- 4. Animasi muncul saat scroll ---------- */

// IntersectionObserver "mengawasi" elemen dan memberi tahu saat elemen masuk layar.
// Jauh lebih ringan daripada menghitung posisi di setiap event scroll.
const elemenReveal = document.querySelectorAll(".reveal");

if (kurangiAnimasi || !("IntersectionObserver" in window)) {
  // Tanpa animasi (atau browser lama): langsung tampilkan semua
  elemenReveal.forEach((el) => el.classList.add("is-visible"));
} else {
  const pengamat = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          pengamat.unobserve(entry.target); // cukup sekali, setelah itu berhenti diawasi
        }
      });
    },
    // threshold 0.15: muncul saat 15% elemen terlihat.
    // rootMargin bawah -40px: animasi mulai sedikit sebelum elemen benar-benar di tengah layar
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );
  elemenReveal.forEach((el) => pengamat.observe(el));
}
