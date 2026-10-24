/* =========================================================
   Rekha Creative — script.js
   JavaScript biasa (tanpa library). Konten placeholder ada di content.js.
    1. Link WhatsApp/email/sosmed dari CONTACT
    2. Header: bayangan saat scroll, menu mobile, scroll-spy
    3. Hero: skala ilustrasi + parallax mouse
    4. Marquee tanpa putus
    5. Works: kartu dari PROJECTS + carousel
    6. Count-up statistik
    7. Scroll reveal & pemicu animasi section
    8. Chat CTA bergantian
    9. FAQ accordion
   ========================================================= */

// Tandai bahwa JS aktif (CSS hanya menyembunyikan elemen .reveal kalau kelas ini ada)
document.documentElement.classList.add("js");

const kurangiAnimasi = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- 1. Link dari CONTACT (content.js) ---------- */
// Semua elemen ber-atribut data-wa → link WhatsApp. Isi atribut = pesan (boleh kosong).
function pasangLink(akar = document) {
  akar.querySelectorAll("[data-wa]").forEach((el) => {
    const pesan = el.dataset.wa;
    const url = `https://wa.me/${CONTACT.whatsapp}`;
    el.href = pesan ? `${url}?text=${encodeURIComponent(pesan)}` : url;
  });
  // data-link="email|instagram|tiktok|portfolio" → ambil dari CONTACT
  akar.querySelectorAll("[data-link]").forEach((el) => {
    const jenis = el.dataset.link;
    el.href = jenis === "email" ? `mailto:${CONTACT.email}` : CONTACT[jenis];
  });
  // data-contact="email|whatsappLabel" → teks yang tampil
  akar.querySelectorAll("[data-contact]").forEach((el) => {
    el.textContent = CONTACT[el.dataset.contact];
  });
}
pasangLink();

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
  let aktif = null;                         // di hero belum ada menu yang aktif
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

/* ---------- 5. Works: kartu dari PROJECTS + carousel ---------- */
const worksTrack = document.getElementById("worksTrack");
const worksViewport = document.getElementById("worksViewport");
const KARTU_PER_HALAMAN = 4;
const layarDesktop = window.matchMedia("(min-width: 768px)");

// Escape teks supaya aman dimasukkan ke HTML
const aman = (teks) => String(teks).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

const LINK_BARU = 'target="_blank" rel="noopener noreferrer" draggable="false"';
const ikon = (file, ukuran, kelas = "") =>
  `<img${kelas ? ` class="${kelas}"` : ""} src="assets/img/works/${file}" alt="" width="${ukuran}" height="${ukuran}" draggable="false">`;

// Kartu project. Status (content.js): live = bisa diklik · in-development & confidential = tidak bisa diklik.
// Kartu live memakai pola "stretched link": link di nama project menutupi seluruh kartu,
// sedangkan badge toko & chip "Try prototype" adalah link terpisah di atasnya.
function buatKartu(p, urutan) {
  const links = p.links || {};
  const bisaDiklik = p.status === "live" && links.primary;
  const isGif = /\.gif$/i.test(p.image);

  const gambar = p.image
    ? `<img class="work-card__cover" src="${aman(isGif && kurangiAnimasi && p.poster ? p.poster : p.image)}"${isGif && p.poster ? ` data-gif="${aman(p.image)}" data-poster="${aman(p.poster)}"` : ""} alt="${aman(p.alt || p.name)}" width="588" height="420" loading="lazy" draggable="false">`
    : `<div class="work-card__placeholder"><img src="assets/img/icon-image.svg" alt="" width="40" height="40" draggable="false"><span>Replace with project image</span></div>`;

  // Lapisan tambahan di atas cover, sesuai frame "Work Card — <nama>" di Figma
  let lapisan = "";
  if (links.playStore || links.appStore) {
    lapisan += `<div class="work-card__stores${p.badgePosition === "right" ? " work-card__stores--right" : ""}">
      ${links.playStore ? `<a class="store-badge" href="${aman(links.playStore)}" ${LINK_BARU} aria-label="${aman(p.name)} di Google Play"><img src="assets/img/works/badge-play-store.png" alt="" width="124" height="40" draggable="false"></a>` : ""}
      ${links.appStore ? `<a class="store-badge" href="${aman(links.appStore)}" ${LINK_BARU} aria-label="${aman(p.name)} di App Store"><img src="assets/img/works/badge-app-store.png" alt="" width="123" height="40" draggable="false"></a>` : ""}
    </div>`;
  }
  if (p.status === "in-development") {
    lapisan += `<span class="chip-dev"><span class="chip-dev__dot"></span>In development</span>`;
  }
  if (p.status === "confidential") {
    // Overlay hanya muncul saat hover/tap/fokus (frame "Hover overlay" di Figma); saat diam cover tampil normal
    lapisan += `<span class="work-card__overlay">
        <span class="work-card__veil" aria-hidden="true"></span>
        <span class="chip-confidential">${ikon("icon-lock-chip.svg", 14)}Confidential</span>
        <span class="work-card__note">${ikon("icon-lock-note.svg", 24)}<span class="work-card__note-title">Private client work</span><span class="work-card__note-sub">Available on request</span></span>
      </span>`;
  }
  if (p.prototype && bisaDiklik) {
    lapisan += `<a class="chip-proto" href="${aman(links.primary)}" ${LINK_BARU}>${ikon("icon-play.svg", 12)}Try prototype</a>`;
  }

  // Lingkaran panah kanan bawah: panah biru (live), jam (in development), gembok (confidential)
  let panah = `<span class="work-card__arrow"><img src="assets/img/icon-arrow-work.svg" alt="" width="22" height="22" draggable="false"></span>`;
  if (p.status === "in-development") panah = `<span class="work-card__arrow work-card__arrow--muted">${ikon("icon-clock.svg", 22)}</span>`;
  if (p.status === "confidential") panah = `<span class="work-card__arrow work-card__arrow--muted">${ikon("icon-lock-arrow.svg", 20)}</span>`;

  const nama = bisaDiklik
    ? `<a class="work-card__link" href="${aman(links.primary)}" ${LINK_BARU}>${aman(p.name)}</a>`
    : aman(p.name);
  const kelas = ["work-card", `work-card--${p.status || "live"}`, isGif ? "work-card--gif" : "", bisaDiklik ? "" : "work-card--static"].filter(Boolean).join(" ");

  // Card Design bisa difokus (keyboard) / di-tap (HP) untuk menampilkan overlay
  const fokus = p.status === "confidential" ? ' tabindex="0"' : "";
  const pos = posisiDesktop(urutan, PROJECTS.length);

  return `
    <article class="${kelas}"${bisaDiklik ? "" : ' aria-disabled="true"'}${fokus} data-row="${pos.baris}" style="--i: ${urutan % KARTU_PER_HALAMAN}; --col: ${pos.kolom}; --row: ${pos.baris}">
      <div class="work-card__image">
        ${gambar}
        <span class="work-card__year">${aman(p.year)}</span>
        ${lapisan}
      </div>
      <div class="work-card__meta">
        <div>
          <h3 class="work-card__name">${nama}</h3>
          <p class="work-card__cat">${aman(p.category)}</p>
        </div>
        ${panah}
      </div>
    </article>`;
}

// Posisi kartu di grid desktop (2 baris, kolom bergeser satu per satu).
// Tiap 4 kartu mengisi 2 kolom baris demi baris (1·2 di atas, 3·4 di bawah);
// sisa 1–2 kartu mengisi kolom berikutnya dari atas ke bawah.
// Hasil untuk 6 project: kolom 1 = AyoMuslim/Gudang Buku, kolom 2 = AyoSiswa/Masjid, kolom 3 = Card Design/Praktikum.
function posisiDesktop(i, total) {
  const blok = Math.floor(i / KARTU_PER_HALAMAN);
  const j = i % KARTU_PER_HALAMAN;
  const sisaBlok = Math.min(KARTU_PER_HALAMAN, total - blok * KARTU_PER_HALAMAN);
  if (sisaBlok === KARTU_PER_HALAMAN) return { kolom: blok * 2 + (j % 2) + 1, baris: Math.floor(j / 2) + 1 };
  return { kolom: blok * 2 + Math.floor(j / 2) + 1, baris: (j % 2) + 1 };
}

worksTrack.innerHTML = PROJECTS.map((p, i) => buatKartu(p, i)).join("");

// Card Design: tap di layar sentuh menampilkan/menyembunyikan overlay "Confidential"
worksTrack.querySelectorAll(".work-card--confidential").forEach((kartu) => {
  kartu.addEventListener("click", () => kartu.classList.toggle("is-revealed"));
});

// Kartu reveal (fade-up berurutan) saat pertama terlihat
worksTrack.querySelectorAll(".work-card").forEach((k) => k.classList.add("reveal"));

// GIF cover: kalau pengguna memilih "kurangi animasi", tampil frame statis dan baru diputar saat hover
if (kurangiAnimasi) {
  worksTrack.querySelectorAll(".work-card__cover[data-gif]").forEach((img) => {
    const kartu = img.closest(".work-card");
    kartu.addEventListener("mouseenter", () => (img.src = img.dataset.gif));
    kartu.addEventListener("mouseleave", () => (img.src = img.dataset.poster));
  });
}

// Langkah geser: desktop = per kolom (2 kolom terlihat, jadi jumlah langkah = kolom − 1), mobile = per kartu
const langkahCarousel = () => {
  if (!layarDesktop.matches) return [...worksTrack.querySelectorAll(".work-card")];
  const atas = [...worksTrack.querySelectorAll('.work-card[data-row="1"]')]
    .sort((a, b) => a.style.getPropertyValue("--col") - b.style.getPropertyValue("--col"));
  return atas.slice(0, Math.max(1, atas.length - 1));
};

let indeksAktif = 0;

function indeksSekarang() {
  const langkah = langkahCarousel();
  const maks = worksViewport.scrollWidth - worksViewport.clientWidth;
  if (worksViewport.scrollLeft >= maks - 2) return langkah.length - 1;   // sudah mentok kanan
  const awal = worksTrack.offsetLeft;
  let terdekat = 0;
  langkah.forEach((el, i) => {
    const jarak = Math.abs(el.offsetLeft - awal - worksViewport.scrollLeft);
    const jarakTerdekat = Math.abs(langkah[terdekat].offsetLeft - awal - worksViewport.scrollLeft);
    if (jarak < jarakTerdekat) terdekat = i;
  });
  return terdekat;
}

function updateKontrol() {
  const total = langkahCarousel().length;
  const baru = indeksSekarang();
  const dua = (n) => String(n).padStart(2, "0");

  document.getElementById("worksCurrent").textContent = dua(baru + 1);
  document.getElementById("worksTotal").textContent = `/ ${dua(total)}`;
  document.getElementById("worksBar").style.setProperty("--progress", `${((baru + 1) / total) * 100}%`);
  document.querySelectorAll('[data-carousel="prev"]').forEach((b) => (b.disabled = baru === 0));
  document.querySelectorAll('[data-carousel="next"]').forEach((b) => (b.disabled = baru === total - 1));
  indeksAktif = baru;
}

// Geser ke langkah i dengan transisi 0.6s (easing sama dengan --ease). Snap dimatikan selama animasi.
let animGeser = null;
function geserKe(i) {
  const langkah = langkahCarousel();
  const target = langkah[Math.max(0, Math.min(langkah.length - 1, i))];
  const maks = worksViewport.scrollWidth - worksViewport.clientWidth;
  const tujuan = Math.min(maks, target.offsetLeft - worksTrack.offsetLeft);

  cancelAnimationFrame(animGeser);
  if (kurangiAnimasi) {
    worksViewport.scrollLeft = tujuan;
    setTimeout(updateKontrol, 50);
    return;
  }
  const dari = worksViewport.scrollLeft;
  const mulai = performance.now();
  const durasi = 600;
  const halus = (t) => 1 - Math.pow(1 - t, 4);   // mendekati cubic-bezier(0.22, 1, 0.36, 1)
  worksViewport.classList.add("is-animating");
  (function langkahAnim(waktu) {
    const t = Math.min(1, (waktu - mulai) / durasi);
    worksViewport.scrollLeft = dari + (tujuan - dari) * halus(t);
    if (t < 1) {
      animGeser = requestAnimationFrame(langkahAnim);
    } else {
      worksViewport.classList.remove("is-animating");
      updateKontrol();
    }
  })(mulai);
}

document.querySelectorAll("[data-carousel]").forEach((tombol) => {
  tombol.addEventListener("click", () => geserKe(indeksSekarang() + (tombol.dataset.carousel === "next" ? 1 : -1)));
});

// Panah kiri/kanan di keyboard saat carousel difokus
worksViewport.addEventListener("keydown", (e) => {
  if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
  e.preventDefault();
  geserKe(indeksSekarang() + (e.key === "ArrowRight" ? 1 : -1));
});

let timerScroll;
worksViewport.addEventListener("scroll", () => {
  clearTimeout(timerScroll);
  timerScroll = setTimeout(updateKontrol, 80);
}, { passive: true });
worksViewport.addEventListener("scrollend", updateKontrol);
layarDesktop.addEventListener("change", () => {
  indeksAktif = 0;
  worksViewport.scrollLeft = 0;
  updateKontrol();
});
updateKontrol();

// Drag dengan mouse (desktop). Sentuh/trackpad sudah ditangani scroll-snap bawaan browser.
let drag = null;
worksViewport.addEventListener("pointerdown", (e) => {
  if (e.pointerType !== "mouse" || e.button !== 0) return;
  drag = { x: e.clientX, kiri: worksViewport.scrollLeft, mulaiIndeks: indeksSekarang(), geser: false };
});
window.addEventListener("pointermove", (e) => {
  if (!drag) return;
  const dx = e.clientX - drag.x;
  if (!drag.geser && Math.abs(dx) > 5) {
    drag.geser = true;
    worksViewport.classList.add("is-dragging");
  }
  if (drag.geser) worksViewport.scrollLeft = drag.kiri - dx;
});
window.addEventListener("pointerup", (e) => {
  if (!drag) return;
  const { geser, mulaiIndeks, x } = drag;
  drag = null;
  if (!geser) return;
  worksViewport.classList.remove("is-dragging");
  // Tarik > 60px sudah cukup untuk pindah halaman
  const dx = e.clientX - x;
  geserKe(Math.abs(dx) > 60 ? mulaiIndeks + (dx < 0 ? 1 : -1) : mulaiIndeks);
  // Klik yang menyusul drag jangan membuka link kartu
  const blokKlik = (ev) => ev.preventDefault();
  worksViewport.addEventListener("click", blokKlik, { capture: true });
  setTimeout(() => worksViewport.removeEventListener("click", blokKlik, { capture: true }), 0);
});

/* ---------- 6. Count-up statistik (angka dari STATS di content.js) ---------- */
const ambilStat = (kunci) => (kunci === "hero" ? STATS.hero : STATS.numbers[kunci]);
const teksStat = (stat, angka) => `${stat.prefix || ""}${angka}${stat.suffix || ""}`;

// Isi angka & label sesuai content.js (angka akhir; count-up mulai saat terlihat)
document.querySelectorAll("[data-stat]").forEach((el) => {
  const stat = ambilStat(el.dataset.stat);
  el.textContent = teksStat(stat, stat.value);
});
document.querySelectorAll("[data-stat-label]").forEach((el) => {
  el.textContent = ambilStat(el.dataset.statLabel).label;
});

function mulaiCountUp(wadah) {
  if (kurangiAnimasi) return;
  wadah.querySelectorAll("[data-stat]").forEach((el) => {
    const stat = ambilStat(el.dataset.stat);
    const durasi = 1200;
    const mulai = performance.now();

    (function langkah(waktu) {
      const t = Math.min(1, (waktu - mulai) / durasi);
      const halus = 1 - Math.pow(1 - t, 3);   // ease-out
      el.textContent = teksStat(stat, Math.round(stat.value * halus));
      if (t < 1) requestAnimationFrame(langkah);
    })(mulai);
  });
}

/* ---------- 7. Scroll reveal & pemicu animasi ---------- */
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
      if (entry.target.id === "stats") mulaiCountUp(entry.target);
      if (entry.target.id === "chat") mulaiChat(entry.target);
      pemicuObs.unobserve(entry.target);
    });
  },
  { threshold: 0.3 }
);
document.querySelectorAll(".steps-panel, .cta__deco, #stats, #chat").forEach((el) => pemicuObs.observe(el));


/* ---------- 8. Chat CTA: bubble putih → "mengetik" → bubble biru ---------- */
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

/* ---------- 9. FAQ accordion (satu item terbuka) ---------- */
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
