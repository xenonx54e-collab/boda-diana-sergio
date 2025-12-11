document.addEventListener("DOMContentLoaded", () => {
  // Scroll suave para enlaces internos
  document.addEventListener("click", (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const targetId = link.getAttribute("href").slice(1);
    const target = document.getElementById(targetId);
    if (!target) return;

    e.preventDefault();
    const offset = 70;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({
      top,
      behavior: "smooth",
    });
  });

  // Leer nombre del invitado desde la URL: ?invitado=Familia%20Torres
  const params = new URLSearchParams(window.location.search);
  const guest = params.get("invitado");
  const reservedNameEl = document.getElementById("reserved-name");

  if (reservedNameEl) {
    reservedNameEl.textContent = guest || "Tu familia";
  }

  // Lógica del sobre + tarjetas + música
  const overlay = document.getElementById("invite-overlay");
  const envelopeTrigger = document.getElementById("envelope-trigger");
  const btnDetails = document.getElementById("btn-details");
  const audio = document.getElementById("bg-music");

  if (envelopeTrigger && overlay) {
    envelopeTrigger.addEventListener("click", () => {
      overlay.classList.add("opened");
      setTimeout(() => {
        overlay.classList.add("cards-visible");
      }, 450);
    });
  }

  if (btnDetails && overlay) {
    btnDetails.addEventListener("click", () => {
      overlay.classList.add("finished");
      if (audio) {
        audio.play().catch(() => {
          // Si el navegador bloquea el autoplay, no pasa nada.
        });
      }
    });
  }

  // ==========================
  // Carrusel específico del HERO (portada)
  // ==========================
  const heroSlides = document.querySelectorAll(".hero-slider .hero-slide");
  if (heroSlides.length > 1) {
    let heroIndex = 0;
    setInterval(() => {
      heroSlides[heroIndex].classList.remove("active");
      heroIndex = (heroIndex + 1) % heroSlides.length;
      heroSlides[heroIndex].classList.add("active");
    }, 6000); // cambia de foto cada 6 segundos
  }

  // ==========================
  // Sliders genéricos (historia, Zona Chic, etc.)
  // ==========================
  const sliders = document.querySelectorAll("[data-slider]");
  sliders.forEach((slider) => {
    const slides = slider.querySelectorAll(".slide");
    if (slides.length <= 1) return;

    let index = 0;
    const interval = Number(slider.dataset.interval) || 5000;

    setInterval(() => {
      slides[index].classList.remove("active");
      index = (index + 1) % slides.length;
      slides[index].classList.add("active");
    }, interval);
  });

  // ==========================
  // Contador regresivo hasta 20 junio 2026, 13:00
  // ==========================
  const targetDate = new Date("2026-06-20T13:00:00");

  const daysEl = document.getElementById("cd-days");
  const hoursEl = document.getElementById("cd-hours");
  const minutesEl = document.getElementById("cd-minutes");
  const secondsEl = document.getElementById("cd-seconds");

  function updateCountdown() {
    const now = new Date();
    const diff = targetDate - now;

    if (diff <= 0) {
      if (daysEl) daysEl.textContent = "0";
      if (hoursEl) hoursEl.textContent = "0";
      if (minutesEl) minutesEl.textContent = "0";
      if (secondsEl) secondsEl.textContent = "0";
      return;
    }

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (daysEl) daysEl.textContent = String(days);
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, "0");
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, "0");
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, "0");
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
});
