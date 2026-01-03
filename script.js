document.addEventListener("DOMContentLoaded", () => {
  // Scroll suave para enlaces internos (sin offset porque ya no hay nav)
  document.addEventListener("click", (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const targetId = link.getAttribute("href").slice(1);
    const target = document.getElementById(targetId);
    if (!target) return;

    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY;

    window.scrollTo({
      top,
      behavior: "smooth",
    });
  });

  // Leer nombre del invitado desde la URL: ?invitado=Familia%20Torres
  const params = new URLSearchParams(window.location.search);
  const guest = params.get("invitado");
  const reservedNameEl = document.getElementById("reserved-name");
  if (reservedNameEl) reservedNameEl.textContent = guest || "Tu familia";

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
          // Autoplay bloqueado: OK.
        });
      }
    });
  }

  // Carrusel HERO
  const heroSlides = document.querySelectorAll(".hero-slider .hero-slide");
  if (heroSlides.length > 1) {
    let heroIndex = 0;
    setInterval(() => {
      heroSlides[heroIndex].classList.remove("active");
      heroIndex = (heroIndex + 1) % heroSlides.length;
      heroSlides[heroIndex].classList.add("active");
    }, 6000);
  }

  // Sliders genéricos
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

  // Contador regresivo hasta 20 junio 2026, 13:00
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

  // Desplegable del código de descuento (Alojamiento)
  const discountBtn = document.getElementById("discount-btn");
  const discountPanel = document.getElementById("discount-panel");

  if (discountBtn && discountPanel) {
    discountBtn.addEventListener("click", () => {
      const isOpen = discountBtn.getAttribute("aria-expanded") === "true";
      discountBtn.setAttribute("aria-expanded", String(!isOpen));
      discountPanel.hidden = isOpen;
    });
  }

  // Typing al llegar a "Historia" (para TODOS los párrafos con data-typing)
  const typingEls = document.querySelectorAll("[data-typing]");
  if (typingEls.length) {
    const items = Array.from(typingEls).map((el) => {
      const text = el.textContent.trim();
      el.textContent = "";
      return { el, text };
    });

    let started = false;

    const typeSequence = () => {
      if (started) return;
      started = true;

      const speed = 30; // suave
      const pauseBetween = 450;

      const typeOne = (idx) => {
        if (idx >= items.length) return;

        const { el, text } = items[idx];
        let i = 0;

        const timer = setInterval(() => {
          el.textContent += text.charAt(i);
          i += 1;
          if (i >= text.length) {
            clearInterval(timer);
            setTimeout(() => typeOne(idx + 1), pauseBetween);
          }
        }, speed);
      };

      typeOne(0);
    };

    // IntersectionObserver: empieza cuando entra el primero en pantalla
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              typeSequence();
              io.disconnect();
            }
          });
        },
        { threshold: 0.35 }
      );

      io.observe(items[0].el);
    } else {
      // fallback
      typeSequence();
    }
  }
});
// ==============================
// INVITADOS POR LINK (guest=...)
// ==============================
(function () {
  const params = new URLSearchParams(window.location.search);
  const rawGuest =
    params.get("guest") ||
    params.get("invitado") ||
    params.get("para");

  const guestName = rawGuest ? rawGuest.trim() : "";

  function applyGuestName() {
    const reservedEl = document.getElementById("reserved-name");
    if (reservedEl && guestName) {
      reservedEl.textContent = guestName;
    }
  }

  // Aplica al cargar (por si ya está en DOM)
  applyGuestName();

  // Re-aplica un instante después (por si hay scripts que pisan el texto)
  setTimeout(applyGuestName, 50);
  setTimeout(applyGuestName, 200);

  // Re-aplica al abrir el sobre (por si tu JS cambia el contenido al abrir)
  const envelopeTrigger = document.getElementById("envelope-trigger");
  if (envelopeTrigger) {
    envelopeTrigger.addEventListener("click", () => {
      setTimeout(applyGuestName, 0);
      setTimeout(applyGuestName, 100);
      setTimeout(applyGuestName, 250);
    });
  }

  // WhatsApp (IMPORTANTE: solo números, ejemplo España: 346XXXXXXXX)
  const phone = "34618717016"; // <- TU NÚMERO REAL, solo dígitos

  const message = guestName
    ? `Hola, soy ${guestName} y quiero confirmar mi asistencia a la boda de Diana y Sergio.`
    : `Hola, quiero confirmar mi asistencia a la boda de Diana y Sergio.`;

  const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  const waBtn = document.getElementById("rsvp-wa");
  if (waBtn) waBtn.href = waUrl;
})();
