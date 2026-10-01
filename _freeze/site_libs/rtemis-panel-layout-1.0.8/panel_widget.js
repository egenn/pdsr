function rtemisPanelFactory(el, width, height) {
    let payload = null, children = [];
    const surface = rtemisDrawSurface(el);
    const paint = () => {
      if (el.isConnected === false) surface.restore();
      else surface.paint(rtemisPanels.background(payload, rtemisDrawIsDarkMode()));
    };
    function dispose() {
      children.forEach(child => child.renderer.dispose());
      children = [];
      surface.restore();
      el.replaceChildren();
    }
    function resize(w, h) {
      // A static htmlwidgets host may pass viewport dimensions even for a
      // fixed-size element. The figure's actual content box owns its layout.
      width = el.clientWidth || w; height = el.clientHeight || h;
      if (!payload) return;
      const cells = rtemisPanels.cells(children.length, payload.layout, width, height);
      children.forEach((child, i) => {
        const cell = cells[i];
        Object.assign(child.element.style, {left: cell.x + 'px', top: cell.y + 'px',
          width: cell.width + 'px', height: cell.height + 'px'});
        child.renderer.resize(cell.width, cell.height);
      });
    }
    return {
      renderValue: function(x) {
        dispose(); payload = x;
        el.style.position = 'relative';
        width = el.clientWidth || width;
        height = el.clientHeight || height;
        const cells = rtemisPanels.cells(x.panels.length, x.layout, width, height);
        x.panels.forEach((panel, i) => {
          const cell = cells[i], element = document.createElement('div');
          element.className = 'rtemis-panel';
          Object.assign(element.style, {position: 'absolute', left: cell.x + 'px',
            top: cell.y + 'px', width: cell.width + 'px', height: cell.height + 'px'});
          el.appendChild(element);
          const renderer = rtemisDrawFactory(element, cell.width, cell.height, true, paint);
          children.push({element, renderer});
          renderer.renderValue(panel);
        });
        paint();
      },
      resize,
      dispose,
      getCharts: () => children.map(child => child.renderer.getChart())
    };
}
