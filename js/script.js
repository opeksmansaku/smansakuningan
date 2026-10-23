// ===== MENU RESPONSIF =====
    const navToggle = document.getElementById("navToggle");
    const navLinks = document.getElementById("navLinks");

    navToggle.addEventListener("click", () => {
      const open = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
      navToggle.textContent = open ? "✕" : "☰";
    });

    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Buka menu");
        navToggle.textContent = "☰";
      });
    });

    // ===== NAVBAR DAN KEMBALI KE ATAS =====
    const navbar = document.getElementById("navbar");
    const backToTop = document.getElementById("backToTop");

    function handleScroll() {
      navbar.classList.toggle("scrolled", window.scrollY > 12);
      backToTop.classList.toggle("show", window.scrollY > 400);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // ===== ANIMASI SAAT BAGIAN MUNCUL DI LAYAR =====
    const revealItems = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window) {
      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });
      revealItems.forEach(item => revealObserver.observe(item));
    } else {
      revealItems.forEach(item => item.classList.add("visible"));
    }

    // ===== TAHUN OTOMATIS =====
    document.getElementById("year").textContent = new Date().getFullYear();

    // ===== COUNTDOWN =====
    // Ganti string kosong dengan tanggal resmi:
    // "2026-12-20T08:00:00+07:00"
    // Contoh di atas hanya format contoh, bukan jadwal acara.
    const eventDate = "2026-12-14T06:10:00+07:00";

    const countEls = {
      days: document.getElementById("days"),
      hours: document.getElementById("hours"),
      minutes: document.getElementById("minutes"),
      seconds: document.getElementById("seconds")
    };
    const countdownMessage = document.getElementById("countdownMessage");
    const countdownTitle = document.getElementById("countdownTitle");
    let countdownTimer = null;

    function updateCountdown() {
      if (!eventDate) {
        countdownMessage.textContent = "14–16 Desember 2026 · SMAN 1 Kuningan.";
        Object.values(countEls).forEach(el => el.textContent = "--");
        return;
      }

      const target = new Date(eventDate).getTime();
      if (Number.isNaN(target)) {
        countdownMessage.textContent = "Tanggal acara belum diatur dengan benar.";
        return;
      }

      const distance = target - Date.now();
      if (distance <= 0) {
        Object.values(countEls).forEach(el => el.textContent = "00");
        countdownTitle.textContent = "Hari Pelaksanaan";
        countdownMessage.textContent = distance > -86400000
          ? "Acara telah dimulai atau sedang berlangsung."
          : "Acara telah berlalu. Terima kasih telah menjadi bagian dari cerita ini.";
        if (countdownTimer) clearInterval(countdownTimer);
        return;
      }

      countdownTitle.textContent = "Menuju Hari Pelaksanaan";
      countdownMessage.textContent = "Bersiap menyambut Gebyar Smansaku.";
      const values = {
        days: Math.floor(distance / 86400000),
        hours: Math.floor((distance % 86400000) / 3600000),
        minutes: Math.floor((distance % 3600000) / 60000),
        seconds: Math.floor((distance % 60000) / 1000)
      };
      Object.entries(values).forEach(([key, value]) => {
        countEls[key].textContent = String(value).padStart(2, "0");
      });
    }

    updateCountdown();
    if (eventDate) countdownTimer = setInterval(updateCountdown, 1000);
