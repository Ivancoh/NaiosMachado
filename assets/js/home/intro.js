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

  const whenReady = Promise.all([
    document.fonts ? document.fonts.ready : Promise.resolve(),
    new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))
  ]);

  whenReady.then(() => {
    // ---------------------------------------------------------
    // PASSO 1: Ajustar o nome da splash para CABER na tela
    // antes de qualquer medição/animação
    // ---------------------------------------------------------
    fitSplashToViewport(splash, splashFirst, splashLast);

    // ---------------------------------------------------------
    // PASSO 2: Medir e animar
    // ---------------------------------------------------------
    setTimeout(() => {
      const rectFirst = targetFirst.getBoundingClientRect();
      const rectLast = targetLast.getBoundingClientRect();
      const startFirst = splashFirst.getBoundingClientRect();
      const startLast = splashLast.getBoundingClientRect();

      const deltaXFirst = rectFirst.left - startFirst.left;
      const deltaYFirst = rectFirst.top - startFirst.top;
      const deltaXLast = rectLast.left - startLast.left;
      const deltaYLast = rectLast.top - startLast.top;

      const targetFontSize = parseFloat(getComputedStyle(targetFirst).fontSize);
      const startFontSize = parseFloat(getComputedStyle(splashFirst).fontSize);
      // Aqui consideramos o scale já aplicado no passo 1
      const splashWrapper = splashFirst.parentElement;
      const currentScale = parseFloat(splashWrapper.dataset.fitScale || '1');
      const scale = (targetFontSize / startFontSize) / currentScale;

      const transitionCSS = `transform ${DURATION}ms cubic-bezier(0.65, 0, 0.35, 1)`;
      splashFirst.style.transition = transitionCSS;
      splashLast.style.transition = transitionCSS;

      splashFirst.style.transform = `translate(${deltaXFirst}px, ${deltaYFirst}px) scale(${scale})`;
      splashLast.style.transform = `translate(${deltaXLast}px, ${deltaYLast}px) scale(${scale})`;

      setTimeout(() => {
        targetName.style.opacity = '1';
        splash.style.transition = 'opacity 400ms ease';
        splash.style.opacity = '0';
        setTimeout(() => splash.remove(), 400);
      }, DURATION);
    }, DELAY);
  });
});

/**
 * Reduz o #splash-name via transform: scale() se ele for maior
 * que o viewport, garantindo que sempre caiba na tela.
 */
function fitSplashToViewport(splash, splashFirst, splashLast) {
  const splashName = splashFirst.parentElement; // o <h1 id="splash-name">
  const padding = 32; // margem de segurança (px) em cada lado

  // Reseta qualquer transform anterior para medir o tamanho "real"
  splashName.style.transform = 'none';
  splashName.style.transformOrigin = 'center center';

  // Tamanho natural do nome
  const nameRect = splashName.getBoundingClientRect();
  const availableWidth = splash.clientWidth - padding;
  const availableHeight = splash.clientHeight - padding;

  // Fator de escala necessário para caber (nunca amplia, só reduz)
  const scaleX = availableWidth / nameRect.width;
  const scaleY = availableHeight / nameRect.height;
  const fitScale = Math.min(1, scaleX, scaleY);

  // Aplica
  splashName.style.transform = `scale(${fitScale})`;
  splashName.dataset.fitScale = fitScale;
}