document.addEventListener("DOMContentLoaded", () => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  // Tahun footer
  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  // Navigasi mobile
  const navToggle = $("#navToggle");
  const nav = $(".nav-inner nav");
  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
      navToggle.textContent = open ? "×" : "☰";
    });
    $$("#navLinks a").forEach(link => link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.textContent = "☰";
    }));
  }

  // Countdown menuju hari pertama, zona waktu lokal perangkat.
  const targetDate = new Date(2026, 11, 14, 0, 0, 0).getTime();
  const countdownTitle = $("#countdownTitle");
  const countdownMessage = $("#countdownMessage");
  function updateCountdown() {
    const now = Date.now();
    let distance = targetDate - now;
    if (distance <= 0) {
      if (countdownTitle) countdownTitle.textContent = "S-PECTRA 2026";
      if (countdownMessage) countdownMessage.textContent = "Selamat menikmati rangkaian Gebyar Smansa!";
      ["days", "hours", "minutes", "seconds"].forEach(id => { const el = $("#" + id); if (el) el.textContent = "00"; });
      return;
    }
    const values = {
      days: Math.floor(distance / 86400000),
      hours: Math.floor((distance % 86400000) / 3600000),
      minutes: Math.floor((distance % 3600000) / 60000),
      seconds: Math.floor((distance % 60000) / 1000)
    };
    Object.entries(values).forEach(([id, value]) => {
      const el = $("#" + id);
      if (el) el.textContent = String(value).padStart(2, "0");
    });
  }
  updateCountdown();
  window.setInterval(updateCountdown, 1000);

  // Animasi masuk layar, tanpa library eksternal.
  const revealItems = $$(".reveal");
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("is-visible"));
  }

  // Tombol kembali ke atas
  const backToTop = $("#backToTop");
  const updateTopButton = () => backToTop?.classList.toggle("visible", window.scrollY > 500);
  window.addEventListener("scroll", updateTopButton, { passive: true });
  updateTopButton();
  backToTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  // Filter kegiatan
  const search = $("#eventSearch");
  const eventCards = $$(".event-card");
  const eventCount = $("#eventCount");
  search?.addEventListener("input", () => {
    const query = search.value.trim().toLocaleLowerCase("id");
    let visible = 0;
    eventCards.forEach(card => {
      const match = card.textContent.toLocaleLowerCase("id").includes(query);
      card.hidden = !match;
      if (match) visible++;
    });
    if (eventCount) eventCount.textContent = `${String(visible).padStart(2, "0")} KEGIATAN`;
  });

  // Pop-up ringkasan kegiatan
  const modal = $("#eventModal");
  const modalTitle = $("#modalTitle");
  const modalDescription = $("#modalDescription");
  let lastFocused = null;
  function closeModal() {
    modal?.classList.remove("is-open");
    modal?.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    lastFocused?.focus();
  }
  eventCards.forEach(card => {
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `Lihat ringkasan ${$("h3", card)?.textContent || "kegiatan"}`);
    const open = () => {
      lastFocused = card;
      if (modalTitle) modalTitle.textContent = $("h3", card)?.textContent || "Kegiatan S-PECTRA";
      if (modalDescription) modalDescription.textContent = $("p", card)?.textContent || "";
      const driveLink = $("#modalDriveLink");
      const driveUrl = (card.dataset.juklak || "").trim();
      const validDriveUrl = /^https:\/\/drive\.google\.com\//i.test(driveUrl);
      if (driveLink) {
        driveLink.hidden = !validDriveUrl;
        if (validDriveUrl) driveLink.href = driveUrl;
        else driveLink.removeAttribute("href");
      }
      modal?.classList.add("is-open");
      modal?.setAttribute("aria-hidden", "false");
      document.body.classList.add("modal-open");
      $("[data-close-modal]", modal)?.focus();
    };
    card.addEventListener("click", open);
    card.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") { event.preventDefault(); open(); }
    });
  });
  $$("[data-close-modal]").forEach(button => button.addEventListener("click", closeModal));

  // Tab jadwal 14–16 Desember. Detail hari kedua/ketiga tidak direkayasa.
  const scheduleTabs = $$(".schedule-tab");
  const schedulePanel = $("#schedulePanel");
  const scheduleDays = [
    { overline: "SENIN · HARI PERTAMA", title: "Pembukaan & Kompetisi", description: "Pembukaan, Fashion Show, Futsal, Battle of Minds, dan Esport sesuai rundown panitia." },
    { overline: "SELASA · HARI KEDUA", title: "Rangkaian Kegiatan", description: "Pelaksanaan lanjutan kegiatan sesuai susunan acara resmi. Rincian kegiatan menunggu rundown final." },
    { overline: "RABU · HARI KETIGA", title: "Rangkaian & Penutupan", description: "Kegiatan hari terakhir dan penutupan mengikuti rundown final panitia." }
  ];
  scheduleTabs.forEach(tab => tab.addEventListener("click", () => {
    scheduleTabs.forEach(item => {
      const active = item === tab;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-selected", String(active));
    });
    const day = scheduleDays[Number(tab.dataset.day)] || scheduleDays[0];
    if (schedulePanel) schedulePanel.innerHTML = `<span class="schedule-overline">${day.overline}</span><h3>${day.title}</h3><p>${day.description}</p>`;
  }));

  // Galeri lightbox
  const lightbox = $("#lightbox");
  const lightboxImage = $("#lightboxImage");
  const lightboxCaption = $("#lightboxCaption");
  const galleryImages = $$(".gallery-item img");
  let currentImage = 0;
  function showImage(index) {
    if (!galleryImages.length || !lightboxImage) return;
    currentImage = (index + galleryImages.length) % galleryImages.length;
    const image = galleryImages[currentImage];
    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt;
    lightboxCaption.textContent = $(".gallery-caption", image.closest(".gallery-item"))?.textContent || image.alt;
  }
  function openLightbox(index) {
    showImage(index);
    lightbox?.classList.add("is-open");
    lightbox?.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  }
  function closeLightbox() {
    lightbox?.classList.remove("is-open");
    lightbox?.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  }
  galleryImages.forEach((image, index) => {
    image.closest(".gallery-item")?.addEventListener("click", () => openLightbox(index));
  });
  $(".lightbox-close")?.addEventListener("click", closeLightbox);
  $(".lightbox-prev")?.addEventListener("click", () => showImage(currentImage - 1));
  $(".lightbox-next")?.addEventListener("click", () => showImage(currentImage + 1));

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") { closeModal(); closeLightbox(); }
    if (lightbox?.classList.contains("is-open") && event.key === "ArrowRight") showImage(currentImage + 1);
    if (lightbox?.classList.contains("is-open") && event.key === "ArrowLeft") showImage(currentImage - 1);
  });
});
