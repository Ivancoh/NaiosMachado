document.addEventListener('DOMContentLoaded', () => {
  const splash = document.getElementById('splash-screen');
  const splashFirst = document.getElementById('splash-first');
  const splashLast = document.getElementById('splash-last');
  
  const targetName = document.getElementById('target-name');
  const targetFirst = targetName.querySelector('.home-sidebar__first');
  const targetLast = targetName.querySelector('.home-sidebar__last');

  if (!splash || !splashFirst || !targetName) return;

  // Esconde o nome real
  targetName.style.opacity = '0';

  const DURATION = 1200;
  const DELAY = 2500;

  setTimeout(() => {
    // Posições finais (sidebar)
    const rectFirst = targetFirst.getBoundingClientRect();
    const rectLast = targetLast.getBoundingClientRect();

    // Posições iniciais (splash)
    const startFirst = splashFirst.getBoundingClientRect();
    const startLast = splashLast.getBoundingClientRect();

    // Deltas
    const deltaXFirst = rectFirst.left - startFirst.left;
    const deltaYFirst = rectFirst.top - startFirst.top;
    
    const deltaXLast = rectLast.left - startLast.left;
    const deltaYLast = rectLast.top - startLast.top;

    // Escala
    const targetFontSize = parseFloat(getComputedStyle(targetFirst).fontSize);
    const startFontSize = parseFloat(getComputedStyle(splashFirst).fontSize);
    const scale = targetFontSize / startFontSize;

    // Transição
    const transitionCSS = `transform ${DURATION}ms cubic-bezier(0.65, 0, 0.35, 1)`;
    splashFirst.style.transition = transitionCSS;
    splashLast.style.transition = transitionCSS;

    // Anima
    splashFirst.style.transform = `translate(${deltaXFirst}px, ${deltaYFirst}px) scale(${scale})`;
    splashLast.style.transform = `translate(${deltaXLast}px, ${deltaYLast}px) scale(${scale})`;

    // Finaliza
    setTimeout(() => {
      targetName.style.opacity = '1';
      
      splash.style.transition = 'opacity 400ms ease';
      splash.style.opacity = '0';

      setTimeout(() => splash.remove(), 400);
    }, DURATION);
  }, DELAY);
});