const updateBackground = async (imageUrl, bgEl) => {
  if (!bgEl || !imageUrl) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    bgEl.style.display = 'none';
    return;
  }

  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const bitmap = await createImageBitmap(blob);

    const palette = await ColorThief.getPalette(bitmap, 5);
	const colorStrings = palette.map((c) => c.css());

    const gradient = `radial-gradient(circle at 30% 50%, ${colorStrings[0]} 0%, ${colorStrings[1]} 40%, #0F0F0F 100%)`;

    bgEl.style.backgroundImage = gradient;
    bgEl.style.backgroundSize = 'cover';
    bgEl.classList.add('food-bg-static'); 
	console.log('[food] gradient aplicado:', gradient);   // debug
  } catch (error) {
    console.error('[food] erro ao extrair cores:', error);
    bgEl.style.backgroundColor = '#1A1A1A';
  }
};

// ---------- Inicializador escopado ----------
window.__initFoodCase = (root, bgEl) => {
  console.log('[case] init chamado');
  const carousel = root.querySelector('[data-food-carousel]');
  console.log('[case] carousel encontrado:', !!carousel);
  if (!carousel) return;

  const slides = carousel.querySelectorAll('.food-carousel__slide img');
  console.log('[case] slides encontrados:', slides.length);
  if (!slides.length) return;

  // Fundo inicial
  console.log('[case] chamando updateBackground');
  updateBackground(slides[0].src, bgEl);

  // Fundo conforme slide visível
  const bgObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          updateBackground(entry.target.src, bgEl);
        }
      });
    },
    { root: carousel, threshold: 0.6 }
  );
  slides.forEach((img) => bgObserver.observe(img));

  // Setas do carrossel (desktop)
  const prevBtn = root.querySelector('[data-carousel-prev]');
  const nextBtn = root.querySelector('[data-carousel-next]');
  if (prevBtn)
    prevBtn.addEventListener('click', () =>
      carousel.scrollBy({ left: -carousel.clientWidth, behavior: 'smooth' })
    );
  if (nextBtn)
    nextBtn.addEventListener('click', () =>
      carousel.scrollBy({ left: carousel.clientWidth, behavior: 'smooth' })
    );

  // ---------- Miniaturas ----------
  const thumbnails = root.querySelectorAll('[data-thumbnail]');
  if (thumbnails.length) {
    thumbnails.forEach((thumb, index) => {
      thumb.addEventListener('click', () => {
        const slide = carousel.children[index];
        if (slide) {
          slide.scrollIntoView({ behavior: 'smooth', inline: 'center' });
        }
      });
    });

    const thumbObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Array.from(carousel.children).indexOf(entry.target);
          const thumb = thumbnails[index];
          if (thumb) {
            thumb.classList.toggle('is-active', entry.isIntersecting);
          }
        });
      },
      { root: carousel, threshold: 0.6 }
    );
    Array.from(carousel.children).forEach((slide) =>
      thumbObserver.observe(slide)
    );
  }

  // ---------- Lightbox ----------
  const lightbox = root.querySelector('#lightbox') || document.getElementById('lightbox');
  if (!lightbox) return;

  const lightboxImage = lightbox.querySelector('[data-lightbox-image]');
  let currentIndex = 0;

  const open = (index) => {
    currentIndex = index;
    lightboxImage.src = slides[currentIndex].src;
    lightboxImage.alt = slides[currentIndex].alt;
    if (!lightbox.open) lightbox.showModal();
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    lightbox.close();
    document.body.style.overflow = '';
  };

  slides.forEach((img, index) => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => open(index));
  });

  const closeBtn = lightbox.querySelector('[data-lightbox-close]');
  if (closeBtn) closeBtn.addEventListener('click', close);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });

  const prevLb = lightbox.querySelector('[data-lightbox-prev]');
  const nextLb = lightbox.querySelector('[data-lightbox-next]');
  if (prevLb)
    prevLb.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      open(currentIndex);
    });
  if (nextLb)
    nextLb.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % slides.length;
      open(currentIndex);
    });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.open) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft' && prevLb) prevLb.click();
    if (e.key === 'ArrowRight' && nextLb) nextLb.click();
  });
};

// ---------- Bootstrap automático na página single ----------
const initStandalone = () => {
  const bgEl = document.querySelector('[data-food-bg]');
  if (bgEl) window.__initFoodCase(document, bgEl);
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initStandalone);
} else {
  initStandalone();
}