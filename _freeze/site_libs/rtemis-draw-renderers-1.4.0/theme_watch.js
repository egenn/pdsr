// Light/dark detection and theme-change notification shared by the rtemis
// widget bindings (ECharts, Sigma.js, MapLibre), so every renderer reads the
// host's color scheme the same way and re-themes when the viewer changes it.
(function(root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.RtemisThemeWatch = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function() {
  // Detect dark mode from VS Code, RStudio, Quarto, Bootstrap, or browser preference.
  function isDark() {
    if (typeof document === 'undefined' || !document.body) return false;
    const body = document.body;
    // VS Code webview
    if (body.classList.contains('vscode-dark') ||
        body.classList.contains('vscode-high-contrast')) {
      return true;
    }
    if (body.classList.contains('vscode-light')) return false;
    // RStudio
    if (body.classList.contains('rstudio-themes-dark-menus')) return true;
    // Quarto: `toggleBodyColorMode()` in the emitted page sets exactly one of
    // these on <body>, from the reader's saved choice. It wins over the media
    // query because the reader picked it explicitly.
    if (body.classList.contains('quarto-dark')) return true;
    if (body.classList.contains('quarto-light')) return false;
    // Bootstrap 5 / pkgdown: inspect only page-level attributes. A dark
    // navbar or another locally themed component does not set the page mode.
    const bootstrap = body.getAttribute?.('data-bs-theme') ||
      document.documentElement?.getAttribute?.('data-bs-theme');
    if (bootstrap === 'dark') return true;
    if (bootstrap === 'light') return false;
    // Browser / system preference
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  }

  // Call `onChange()` whenever the host may have changed color scheme, and
  // return a function that stops watching. Callers compare `isDark()` with the
  // scheme they last rendered, because the class observer also fires on
  // unrelated <body> class churn.
  //
  // The media query catches an OS or browser preference change. The observer
  // catches Quarto's body classes and Bootstrap's root/body data-bs-theme.
  // Neither in-page toggle changes the media query.
  //
  // Page-level listeners outlive the widget: once `el` is
  // detached (Shiny re-rendering dynamic UI, a tab being torn down) watching
  // stops and `onDetach()` runs, since htmlwidgets provides no teardown hook.
  function watch(el, onChange, onDetach) {
    const teardown = [];
    const stop = () => {
      teardown.forEach((off) => off());
      teardown.length = 0;
    };
    const handler = () => {
      if (el && el.isConnected === false) {
        stop();
        if (onDetach) onDetach();
        return;
      }
      onChange();
    };
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      if (mq.addEventListener) {
        mq.addEventListener('change', handler);
        teardown.push(() => mq.removeEventListener('change', handler));
      } else if (mq.addListener) {
        mq.addListener(handler);
        teardown.push(() => mq.removeListener(handler));
      }
    }
    if (typeof window !== 'undefined' && window.MutationObserver &&
        typeof document !== 'undefined' && document.body) {
      const observer = new window.MutationObserver(handler);
      observer.observe(document.body, {
        attributes: true, attributeFilter: ['class', 'data-bs-theme']
      });
      if (document.documentElement) {
        observer.observe(document.documentElement, {
          attributes: true, attributeFilter: ['data-bs-theme']
        });
      }
      teardown.push(() => observer.disconnect());
    }
    return stop;
  }

  return {isDark, watch};
});
