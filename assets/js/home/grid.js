const initGrid = () => {
  const drawer = document.getElementById('case-drawer');
  const content = drawer?.querySelector('[data-case-content]');
  if (!drawer || !content) return;
  
  const cards = document.querySelectorAll('[data-case-slug]');
  let closeBtn = null;

  const closeCase = () => {
    drawer.classList.remove('is-open');
    // Espera a animação terminar antes de limpar o HTML
    setTimeout(() => { content.innerHTML = ''; }, 300);
  };

  const openCase = (slug) => {
  const template = document.getElementById(`case-${slug}`);
  if (!template) {
	  console.warn('[grid] template não encontrado para slug:', slug);
	  return;
  }

  content.innerHTML = '';

  const oldBg = drawer.querySelector('.food-bg');
  if (oldBg) oldBg.remove();

  const bgEl = document.createElement('div');
  bgEl.className = 'food-bg';
  bgEl.setAttribute('data-food-bg', '');
  bgEl.setAttribute('aria-hidden', 'true');
  drawer.insertBefore(bgEl, content);

  content.appendChild(template.content.cloneNode(true));
  drawer.classList.add('is-open');

  closeBtn = content.querySelector('[data-close-case]');
  if (closeBtn) closeBtn.addEventListener('click', closeCase);
  
  console.log('[gri] bgEl criado:', bgEl, 'classe:', bgEl.className);
  

  if (window.__initFoodCase) {
    window.__initFoodCase(content, bgEl);
  } else {
    console.warn('[grid] __initFoodCase indisponível');
  }
};
  
  cards.forEach((card) => {
    card.addEventListener('click', () => openCase(card.dataset.caseSlug));
  });

  // Fecha ao clicar no fundo do próprio drawer (fora do conteúdo interno)
  drawer.addEventListener('click', (e) => {
    if (e.target === drawer) closeCase();
  });

  // Atalho Esc
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
      closeCase();
    }
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGrid);
} else {
  initGrid();
}