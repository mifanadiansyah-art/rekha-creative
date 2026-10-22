/* =========================================================
   Rekha Creative — script.js
   JavaScript biasa (tanpa library):
    1. CONFIG kontak + pembuat link WhatsApp/email/sosmed
    2. Header: bayangan saat scroll, menu mobile, scroll-spy
    3. Hero: skala ilustrasi + parallax mouse
    4. Marquee tanpa putus
    5. Scroll reveal & pemicu animasi section
    6. Count-up statistik
    7. Chat CTA bergantian
    8. FAQ accordion
   ========================================================= */

// Tandai bahwa JS aktif (CSS hanya menyembunyikan elemen .reveal kalau kelas ini ada)
document.documentElement.classList.add("js");

const kurangiAnimasi = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- 1. CONFIG: ganti data di sini saja ---------- */
const CONFIG = {
  whatsapp: "[ISI-NOMOR-WA]",                    // format 628xxxxxxxxxx (tanpa + dan spasi)
  email: "[ISI-EMAIL]",                          // contoh: hello@rekhacreative.com
  instagram: "https://instagram.com/[ISI-USERNAME-IG]",
  tiktok: "https://tiktok.com/@[ISI-USERNAME-TIKTOK]",
  portfolio: "[ISI-LINK-PORTOFOLIO]",            // Behance / Dribbble
};

// Semua elemen ber-atribut data-wa → link WhatsApp. Isi atribut = pesan (boleh kosong).
document.querySelectorAll("[data-wa]").forEach((el) => {
  const pesan = el.dataset.wa;
  const url = `https://wa.me/${CONFIG.whatsapp}`;
  el.href = pesan ? `${url}?text=${encodeURIComponent(pesan)}` : url;
});

// data-link="email|instagram|tiktok|portfolio" → ambil dari CONFIG
document.querySelectorAll("[data-link]").forEach((el) => {
  const jenis = el.dataset.link;
  el.href = jenis === "email" ? `mailto:${CONFIG.email}` : CONFIG[jenis];
});

/* ---------- 2. Header ---------- */
const header = document.getElementById("header");

// Saat halaman di-scroll lebih dari 24px, header jadi semi transparan + blur
function cekScroll() {
  header.classList.toggle("is-scrolled", window.scrollY > 24);
}
window.addEventListener("scroll", cekScroll, { passive: true });
cekScroll();

// --- Menu mobile (drawer) ---
const menuBtn = document.getElementById("menuBtn");
const drawer = document.getElementById("drawer");

function aturMenu(buka) {
  menuBtn.setAttribute("aria-expanded", String(buka));
  menuBtn.setAttribute("aria-label", buka ? "Close menu" : "Open menu");
  document.body.classList.toggle("menu-open", buka);

  if (buka) {
    drawer.hidden = false;
    // Tunggu satu frame supaya transisi geser dari kanan berjalan
    requestAnimationFrame(() => drawer.classList.add("is-open"));
  } else {
    drawer.classList.remove("is-open");
    // Sembunyikan setelah transisi selesai (0.4s)
    setTimeout(() => {
      if (!drawer.classList.contains("is-open")) drawer.hidden = true;
    }, 400);
  }
}

menuBtn.addEventListener("click", () => {
  aturMenu(menuBtn.getAttribute("aria-expanded") !== "true");
});
// Menu tertutup otomatis saat link diklik
drawer.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => aturMenu(false)));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && menuBtn.getAttribute("aria-expanded") === "true") {
    aturMenu(false);
    menuBtn.focus();
  }
});

// --- Scroll-spy: menu section yang sedang terlihat jadi aktif ---
const navLinks = document.querySelectorAll(".header__nav a, .drawer__nav a");
const sectionIds = ["services", "works", "process", "about", "faq"];

function updateMenuAktif() {
  const batas = window.innerHeight * 0.4;   // section dianggap aktif saat atasnya melewati 40% layar
  let aktif = "services";                   // default sama seperti Figma (Services aktif)
  sectionIds.forEach((id) => {
    const el = document.getElementById(id);
    if (el && el.getBoundingClientRect().top <= batas) aktif = id;
  });
  navLinks.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === `#${aktif}`));
}
window.addEventListener("scroll", updateMenuAktif, { passive: true });
updateMenuAktif();

/* ---------- 3. Hero: skala ilustrasi & parallax ---------- */
const heroVisual = document.getElementById("heroVisual");
const LEBAR_PANGGUNG = 583.2;   // lebar frame "Hero Visual" di Figma

// Ilustrasi digambar di ukuran asli Figma lalu di-scale mengikuti lebar kolom
function aturSkalaHero() {
  const skala = Math.min(1, heroVisual.clientWidth / LEBAR_PANGGUNG);
  heroVisual.style.setProperty("--hv-scale", skala.toFixed(4));
}
new ResizeObserver(aturSkalaHero).observe(heroVisual);
aturSkalaHero();

// Parallax ringan mengikuti mouse (maks ±10px), hanya desktop dengan mouse
const bolehParallax = window.matchMedia("(hover: hover) and (min-width: 1024px)").matches;
if (!kurangiAnimasi && bolehParallax) {
  const lapisan = heroVisual.querySelectorAll("[data-depth]");
  let target = { x: 0, y: 0 };
  let sekarang = { x: 0, y: 0 };

  document.querySelector(".hero").addEventListener("mousemove", (e) => {
    const r = heroVisual.getBoundingClientRect();
    // Posisi mouse relatif ke tengah ilustrasi, dibatasi -1 sampai 1
    target.x = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (r.width / 2)));
    target.y = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (r.height / 2)));
  });
  document.querySelector(".hero").addEventListener("mouseleave", () => (target = { x: 0, y: 0 }));

  // Gerakan diperhalus (lerp) di setiap frame
  (function animasi() {
    sekarang.x += (target.x - sekarang.x) * 0.08;
    sekarang.y += (target.y - sekarang.y) * 0.08;
    lapisan.forEach((el) => {
      const kedalaman = Number(el.dataset.depth) * 0.45;   // depth 22 → ±10px
      el.style.transform = `translate(${(sekarang.x * kedalaman).toFixed(2)}px, ${(sekarang.y * kedalaman).toFixed(2)}px)`;
    });
    requestAnimationFrame(animasi);
  })();
}

/* ---------- 4. Marquee tanpa putus ---------- */
// Grup teks digandakan sampai cukup panjang. Track berisi 2 "paruh" identik,
// lalu CSS menggeser -50% → saat ulang, posisi terlihat sama (seamless).
function siapkanMarquee(marquee) {
  const track = marquee.querySelector(".marquee__track");
  const asli = track.querySelector(".marquee__group");
  track.querySelectorAll(".marquee__group:not(:first-child)").forEach((g) => g.remove());

  const lebarGrup = asli.getBoundingClientRect().width;
  if (!lebarGrup) return;
  const perParuh = Math.max(1, Math.ceil(window.innerWidth / lebarGrup));
  for (let i = 1; i < perParuh * 2; i++) track.appendChild(asli.cloneNode(true));

  // Kecepatan: desktop ±50px/detik, mobile ±35px/detik
  const kecepatan = window.innerWidth < 768 ? 35 : 50;
  track.style.setProperty("--marquee-dur", `${(lebarGrup * perParuh) / kecepatan}s`);
}
const semuaMarquee = document.querySelectorAll(".marquee");
const jalankanMarquee = () => semuaMarquee.forEach(siapkanMarquee);
// Tunggu font selesai dimuat supaya lebar teks akurat
(document.fonts ? document.fonts.ready : Promise.resolve()).then(jalankanMarquee);
let timerResize;
window.addEventListener("resize", () => {
  clearTimeout(timerResize);
  timerResize = setTimeout(jalankanMarquee, 200);
});

/* ---------- 5. Scroll reveal & pemicu animasi ---------- */
// Elemen .reveal muncul sekali saat ±15% masuk layar
const revealObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      revealObs.unobserve(entry.target);
    });
  },
  { threshold: 0.15 }
);
document.querySelectorAll(".reveal").forEach((el) => revealObs.observe(el));

// Elemen lain yang animasinya dimulai saat terlihat (garis Process, kartu brief, statistik, chat)
const pemicuObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-in");
      if (entry.target.classList.contains("stats")) mulaiCountUp(entry.target);
      if (entry.target.id === "chat") mulaiChat(entry.target);
      pemicuObs.unobserve(entry.target);
    });
  },
  { threshold: 0.3 }
);
document.querySelectorAll(".steps, .cta__deco, .stats, #chat").forEach((el) => pemicuObs.observe(el));

/* ---------- 6. Count-up statistik (30+, 4+, 15+, 24h) ---------- */
function mulaiCountUp(wadah) {
  if (kurangiAnimasi) return;
  wadah.querySelectorAll("[data-count]").forEach((el) => {
    const akhir = Number(el.dataset.count);
    const akhiran = el.dataset.suffix || "";
    const durasi = 1200;
    const mulai = performance.now();

    (function langkah(waktu) {
      const t = Math.min(1, (waktu - mulai) / durasi);
      const halus = 1 - Math.pow(1 - t, 3);   // ease-out
      el.textContent = Math.round(akhir * halus) + akhiran;
      if (t < 1) requestAnimationFrame(langkah);
    })(mulai);
  });
}

/* ---------- 7. Chat CTA: bubble putih → "mengetik" → bubble biru ---------- */
function mulaiChat(chat) {
  const [baris1, baris2] = chat.querySelectorAll(".chat__row");
  if (kurangiAnimasi) {
    baris1.classList.add("is-shown");
    baris2.classList.add("is-shown");
    return;
  }
  setTimeout(() => baris1.classList.add("is-shown"), 200);
  setTimeout(() => {
    chat.classList.add("is-typing");
    baris2.classList.add("is-shown");
  }, 900);
  setTimeout(() => chat.classList.remove("is-typing"), 1700);   // mengetik ±0.8 detik
}

/* ---------- 8. FAQ accordion (satu item terbuka) ---------- */
const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach((item) => {
  const tombol = item.querySelector("button");
  // <button> otomatis bisa ditekan dengan Enter/Space
  tombol.addEventListener("click", () => {
    const sudahBuka = item.classList.contains("is-open");
    faqItems.forEach((lain) => {
      lain.classList.remove("is-open");
      lain.querySelector("button").setAttribute("aria-expanded", "false");
    });
    if (!sudahBuka) {
      item.classList.add("is-open");
      tombol.setAttribute("aria-expanded", "true");
    }
  });
});
