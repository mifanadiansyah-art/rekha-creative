# Rekha Creative — Landing Page: Catatan Animasi & Redirect

Catatan ini mendampingi desain Figma untuk proses slicing. Yang dicatat di sini adalah hal-hal yang **tidak terlihat di Figma**: animasi, interaksi, dan tujuan setiap link/tombol.

- **Figma file:** https://www.figma.com/design/I1gWgu0lK4kssCfk7z1CWZ/Company-Things?node-id=16-81
- **Frame desktop:** `Landing Page` (node 16:81), lebar 1440
- **Frame mobile:** `Landing Page – Mobile` (node 25:197), lebar 390. Sudah disesuaikan dengan desktop; pakai sebagai acuan breakpoint mobile.
- **Komponen:** frame `Components`. **Token warna dan teks:** frame `Foundations`.
- **Website live saat ini:** rekha-creative.vercel.app

---

## 1. Aturan umum

| Hal | Ketentuan |
|---|---|
| Font | Montserrat (Regular 400, Medium 500, SemiBold 600, Bold 700) |
| Warna | Pakai CSS variables sesuai nama variable Figma, contoh `var(--color-primary-main)`, `var(--color-secondary-main)`, `var(--color-accent-cyan)`. Nilai lengkap ada di frame Foundations. |
| Durasi default | 0.6s untuk reveal, 0.25s untuk hover |
| Easing default | `cubic-bezier(0.22, 1, 0.36, 1)` (ease-out halus) |
| Scroll reveal | Elemen muncul *fade-up* (opacity 0→1, translateY 24px→0) saat masuk viewport ±15%. Hanya sekali, tidak diulang saat scroll balik. |
| Stagger | Item dalam daftar/grid muncul berurutan dengan jeda 0.08s per item |
| Aksesibilitas | Hormati `prefers-reduced-motion: reduce`. Matikan marquee, parallax, dan float; reveal cukup fade tanpa gerak. |
| Smooth scroll | Link anchor (#section) scroll halus, dengan offset tinggi header (~96px) |

---

## 2. Per section

### Header
- **Posisi:** sticky/fixed di atas, berbentuk pil melayang (lebar 1200, radius penuh).
- **Latar:** putih 75% + `backdrop-filter: blur(24px)`. Saat halaman sudah di-scroll (>24px), tambahkan shadow tipis.
- **Menu aktif:** link section yang sedang terlihat jadi warna Primary + SemiBold (scroll-spy).
- **Hover menu:** warna berubah ke Primary + SemiBold (0.2s).
- **Mobile:** tombol hamburger membuka menu fullscreen/drawer berisi link yang sama + tombol "Let's Talk".

### Hero
- **Load animation (sekali saat halaman dibuka):** eyebrow chip → headline → subteks → tombol muncul fade-up berurutan (stagger 0.1s).
- **Ilustrasi kanan (keseluruhan):**
  - Bentuk organik biru muda (Backdrop) muncul paling dulu dengan scale 0.8→1, lalu "bernapas" pelan (scale 1→1.03, loop 8 detik).
  - Tiga kartu mockup masuk dengan scale 0.9→1 + fade, berurutan.
  - Tag (UI/UX Design, Lottie Animation, Prototype), kartu "120+", dan sparkle **mengambang pelan** (translateY ±8px, 3–5 detik, loop, tiap elemen beda durasi/delay supaya tidak serempak).
  - Lingkaran putus-putus berputar sangat pelan (360° per ~40 detik). Pola titik di kanan atas berkedip bergantian pelan.
  - Kursor "Rekha" bergerak pelan antar-kartu (path kecil, loop ~6 detik), seperti kursor kolaborasi Figma.
  - Notifikasi "Design approved ✓" muncul dari bawah (slide-up + fade) ±1.5 detik setelah hero selesai dimuat, lalu tetap di tempat. Ikon centang digambar (stroke draw) saat muncul.
  - Opsional: parallax ringan mengikuti posisi mouse (maks 10px) di desktop, tiap lapisan beda kedalaman.
  - **Animasi di dalam mockup** (berjalan terus sebagai loop, ±6–8 detik per siklus, mulai setelah kartu selesai masuk):
    - **Kartu Web Dashboard (kiri, besar):**
      - Grafik batang tumbuh dari bawah (height 0→nilai) berurutan kiri ke kanan; batang biru tertinggi naik terakhir. Lalu nilainya berganti acak halus tiap siklus.
      - Garis-garis teks (placeholder abu) muncul seperti efek *skeleton loading* (shimmer kiri→kanan) sebelum tampil solid.
      - Kartu kecil biru di bawah: bar cyan memanjang seperti progress (0→100%).
    - **Kartu Mobile App (kanan atas):**
      - Konten layar *auto-scroll* pelan ke atas lalu kembali (simulasi orang menggulir aplikasi).
      - Kartu biru di layar "ditekan" (scale 0.96→1) seperti di-tap; tombol kuning kecil berdenyut sekali.
      - Item daftar muncul satu per satu (stagger) dan kotak kuning berpindah ke item berikutnya tiap siklus (simulasi item terpilih).
    - **Kartu Motion/Lottie (kanan bawah, biru):**
      - Bola kuning memantul mengikuti jalur putus-putus (loop), bola cyan dan putih ikut memantul dengan delay.
      - Garis timeline kuning memanjang dan knob putih bergerak kiri→kanan sinkron dengan bola, lalu kembali ke awal.
      - Keyframe (belah ketupat) menyala saat knob melewatinya.
      - Tombol play berganti ikon play ↔ pause tiap siklus.
    - Implementasi bisa dengan CSS/Framer Motion pada elemen HTML/SVG, atau dibuat sebagai file **Lottie** terpisah per mockup (cocok dengan layanan Rekha sendiri).
- **Vector pita latar:** diam, atau parallax sangat ringan saat scroll.

### Marquee (atas dan di atas footer)
- Teks berjalan ke kiri tanpa henti (infinite loop, seamless; isi diduplikasi).
- Kecepatan ±40–60px/detik.
- **Hover:** marquee berhenti (pause).
- Marquee footer boleh berjalan ke arah sebaliknya (ke kanan) supaya variatif.

### Services (blok biru)
- **Scroll reveal:** judul fade-up, lalu 5 baris layanan muncul berurutan (stagger).
- **Hover baris** (seluruh baris bisa diklik):
  - Latar baris menyala tipis (putih 6–8%).
  - Judul layanan bergeser ke kanan ±8px.
  - Lingkaran panah terisi warna Secondary (kuning), ikon panah jadi gelap dan berputar 45° (menghadap kanan).
  - Durasi 0.25s.
- **Vector pita latar:** mengambang/bergeser sangat pelan (loop 12–20 detik).

### Selected Works
- **Scroll reveal:** kartu muncul berurutan (stagger).
- **Hover kartu:** gambar zoom 1.05 di dalam frame (overflow hidden), tombol panah biru bergeser/berputar sedikit, nama project jadi Primary.

### Process (blok biru)
- Layout: judul rata kiri, pil "Most projects ship in 2–6 weeks" di kanan sejajar judul, kartu di bawahnya.
- **Scroll reveal:** judul dan pil fade-up, lalu 4 kartu step muncul berurutan dari kiri ke kanan.
- Garis putus-putus penghubung antar-kartu "menggambar" dari kiri ke kanan (stroke-dashoffset) bersamaan dengan munculnya kartu.
- Titik kuning di pil berdenyut pelan (loop).
- Sparkle mengambang/berkelip pelan.
- **Hover kartu:** naik 4px + shadow lebih tebal; ikon di kotak biru bergoyang kecil.

### Why Rekha
- **Scroll reveal:** 3 kartu fade-up berurutan, lalu strip statistik biru.
- **Hover kartu:** naik 4px; ikon di kotak berwarna sedikit berputar/berdenyut.
- **Strip statistik:** angka (30+, 4+, 15+, 24h) menghitung naik dari 0 (*count-up*, ±1.2 detik) saat masuk viewport, hanya sekali.

### FAQ (blok biru)
- **Accordion:** satu item terbuka dalam satu waktu. Item pertama terbuka secara default.
- **Buka/tutup:** tinggi jawaban animasi expand/collapse (0.3s); ikon `+` berubah jadi `−` dengan rotasi; border item terbuka jadi Primary/Border.
- **Keyboard:** bisa dibuka dengan Enter/Space. Pakai `button` + `aria-expanded`.

### CTA (putih)
- **Scroll reveal:** pil "Available for new projects" → judul → subteks → tombol → baris email, fade-up berurutan.
- Titik hijau di pil "Available" berdenyut (pulse ring, loop).
- **Chat bubble (kanan):** muncul bergantian seperti percakapan. Bubble putih dulu, lalu indikator "mengetik" (3 titik) ±0.8 detik, kemudian bubble biru muncul. Sekali saat masuk viewport.
- Kartu "New project brief" (kiri): progress bar kuning terisi 0→65%.
- Tag dan sparkle mengambang pelan seperti di hero.
- **Tombol "Start a Project":** hover sedikit membesar (scale 1.03), panah bergeser ke kanan-atas.

### Footer (biru)
- Diawali marquee (lihat bagian Marquee).
- **Hover link menu:** underline muncul dari kiri ke kanan.
- **Tombol ikon sosial (Let's connect):** hover jadi kuning (Secondary) dengan ikon gelap, naik 2px.
- **Back to top:** hover lingkaran kuning naik-turun kecil (bounce); klik scroll halus ke atas.
- **Vector pita latar:** mengambang pelan seperti di Services.

### Tombol (semua)
- **Hover:** warna sedikit lebih gelap/terang, panah bergeser 2px ke kanan-atas.
- **Active/press:** scale 0.98.

### Perbedaan di mobile (acuan: frame `Landing Page – Mobile`, lebar 390)
- **Breakpoint:** layout mobile di bawah 768px. Di antara 768–1279px (tablet), pakai layout desktop yang dipersempit (grid 2 kolom untuk kartu).
- **Header:** pil berisi logo + tombol hamburger. Klik membuka menu fullscreen/drawer (slide dari kanan atau fade) berisi link section + tombol "Let's Talk". Menu tertutup otomatis saat link diklik.
- **Hero:** teks dan tombol di atas, ilustrasi di bawah. Tombol full-width bertumpuk. Ilustrasi di-scale utuh (sebaiknya satu SVG/Lottie); animasi mockup tetap jalan. **Parallax mouse dimatikan.**
- **Marquee:** sama, kecepatan sedikit lebih lambat (±30–40px/detik).
- **Services:** pakai komponen `Service Row/Mobile` (nomor + judul + panah dalam satu baris, deskripsi di bawah). Tidak ada hover; efek "menyala" muncul saat di-tap (active state).
- **Works:** kartu satu kolom (varian `Work Card / Size=Mobile`), tombol "View All Works" full-width di bawah grid.
- **Process:** pil durasi di bawah judul, kartu satu kolom. Garis penghubung putus-putus **vertikal**, tergambar dari atas ke bawah.
- **Why Rekha:** kartu satu kolom; strip statistik grid 2×2 (count-up tetap jalan).
- **FAQ:** judul di atas, daftar pertanyaan, lalu tombol "Ask a Question" full-width di paling bawah.
- **CTA:** dua chat bubble ada **di atas** judul (bubble putih rata kiri, bubble biru rata kanan); animasi percakapan sama seperti desktop. Tombol full-width.
- **Footer:** marquee → logo + tagline → ikon "Let's connect" → kolom Menu & More (2 kolom), Social Media, Contact (full-width) → copyright + "Back to top".
- **Umum:** semua efek hover diganti active/tap state; jarak tap minimal 44px; animasi reveal tetap ada tapi jarak gerak lebih kecil (translateY 16px).

---

## 3. Redirect & tujuan link

Ganti semua nilai bertanda `[ISI]` dengan data asli.

**WhatsApp:** `https://wa.me/[ISI: 628xxxxxxxxxx]?text=<pesan ter-encode>`

| Elemen | Lokasi | Tujuan |
|---|---|---|
| Logo | Header | Scroll ke atas (`#top`) |
| Services / Works / Process / About / FAQ | Header nav | Anchor `#services`, `#works`, `#process`, `#about` (section Why Rekha), `#faq` |
| Let's Talk | Header | WhatsApp, pesan: "Halo Rekha Creative, saya ingin diskusi tentang project." |
| Start a Project | Hero | WhatsApp, pesan sama seperti di atas |
| See Our Works | Hero | Anchor `#works` |
| Baris layanan 01–05 (seluruh baris + ikon panah) | Services | WhatsApp dengan pesan per layanan: "Halo Rekha Creative, saya tertarik dengan layanan **[nama layanan]**." Buka di tab baru. |
| Kartu project (gambar, nama, ikon panah) | Works | `[ISI: link case study / Behance / Dribbble]` per project. Kalau belum ada, sementara nonaktifkan klik. |
| View All Works | Works | `[ISI: link portofolio lengkap, mis. Behance/Dribbble]`, tab baru |
| Ask a Question | FAQ | WhatsApp, pesan: "Halo Rekha Creative, saya punya pertanyaan." |
| Start a Project | CTA | WhatsApp, pesan: "Halo Rekha Creative, saya ingin memulai project." |
| hello@rekhacreative.com (or email us at) | CTA | `mailto:[ISI: email]` |
| Ikon Instagram / TikTok / WhatsApp / Email (Let's connect) | Footer | Instagram, TikTok, WhatsApp (tanpa pesan), `mailto:` (tab baru kecuali email) |
| Kolom MENU & MORE (Home, About, Services, Works, Process, FAQ) | Footer | Anchor ke section terkait |
| Kolom SOCIAL MEDIA: Instagram / TikTok | Footer | `https://instagram.com/[ISI: username]`, `https://tiktok.com/@[ISI: username]`, tab baru |
| Kolom CONTACT: email | Footer | `mailto:[ISI: email]` |
| Kolom CONTACT: nomor WhatsApp | Footer | Link WhatsApp tanpa pesan |
| Kolom CONTACT: Bandung, Indonesia | Footer | Teks biasa (atau link Google Maps kalau nanti ada alamat lengkap) |
| Back to top | Footer | Scroll halus ke atas (`#top`) |

Semua link eksternal pakai `target="_blank" rel="noopener noreferrer"`.

---

## 4. Konten yang masih placeholder

- Gambar dan nama 4 project di Works, serta 3 gambar di ilustrasi hero
- Angka "120+ Screens designed" di kartu statistik hero
- Angka di strip statistik Why Rekha (30+, 4+, 15+, 24h)
- Isi mockup di ilustrasi hero (saat ini ilustrasi UI generik; boleh diganti shot karya asli)
- Jawaban FAQ nomor 2–5
- Email, nomor WhatsApp, username Instagram/TikTok
