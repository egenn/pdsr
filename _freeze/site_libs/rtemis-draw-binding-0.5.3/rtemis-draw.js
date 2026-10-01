// Kept as a global because panel_widget.js calls it; detection lives in
// lib/draw/theme_watch.js, shared with the Sigma.js and MapLibre bindings.
function rtemisDrawIsDarkMode() {
  return RtemisThemeWatch.isDark();
}

// Own only a standalone widget document; embedded reports retain page CSS.
// Record every style we change so replacing/detaching a widget restores its host.
function rtemisDrawSurface(el, bounded = false) {
  const saved = new Map();
  const paintElement = (element, color) => {
    if (!saved.has(element)) saved.set(element, element.style.backgroundColor);
    element.style.backgroundColor = color;
  };
  // vscode-R embeds saved head metadata beside the widget in #webview-content.
  const isSoleContent = (container, child) =>
    Array.from(container.children).every(node => node === child ||
      ["SCRIPT", "STYLE", "LINK", "META", "TITLE"].includes(node.tagName));
  return {
    paint(color) {
      paintElement(el, color);
      const host = el.parentElement;
      if (!host || bounded || host === document.body || host === document.documentElement) return;
      paintElement(host, color);
      let pageHost = host;
      if (host.parentElement?.id === "webview-content" && isSoleContent(host.parentElement, host)) {
        pageHost = host.parentElement;
      }
      if (host.id === "htmlwidget_container" && pageHost.parentElement === document.body &&
          host.children.length === 1 && isSoleContent(document.body, pageHost)) {
        paintElement(document.documentElement, color);
        paintElement(document.body, color);
      }
    },
    restore() {
      saved.forEach((color, element) => {element.style.backgroundColor = color;});
      saved.clear();
    }
  };
}

function rtemisDrawFactory(el, width, height, bounded = false, onBackground = () => {}) {
    let currentWidth = width;
    let currentHeight = height;
    let chart = null;
    let currentPayload = null;
    let renderedDark = null;
    let currentTheme = null;
    let injectedVisualMapColor = false;
    const surface = rtemisDrawSurface(el, bounded);
    // For square-cell heatmaps: compute the required height given a container
    // width, so that grid cells are perfectly square.
    const squareCellHeight = (x, containerWidth) => {
      const gridWidth = containerWidth - x.leftPx - x.rightPx;
      const cellPx = gridWidth / x.nCols;
      return Math.round(x.nRows * cellPx + x.topPx + x.botPx);
    };

    // For `aspect` charts: size the plotting grid from the measured container
    // width so that the grid keeps a fixed height:width ratio.
    //
    // This is the one thing R cannot do. Equal axis scaling (one data unit =
    // the same number of pixels on both axes) is a constraint on the *pixel*
    // geometry of the grid, ECharts has no option for it, and R does not know
    // how wide the container will be. So R sends the ratio it needs and the
    // padding the axis labels require, and the browser solves for the box.
    //
    // `widthPx` is the preferred grid width: the box stays that size wherever
    // there is room and shrinks to fit only when there is not, so a wide page
    // centers a fixed-size figure rather than inflating it to fill the column.
    const aspectBox = (a, containerWidth) => {
      const avail = containerWidth - a.leftPx - a.rightPx;
      const preferred = a.widthPx || avail;
      const gridWidth = Math.max(1, Math.min(preferred, avail));
      const gridHeight = gridWidth * a.ratio;
      return {
        gridWidth,
        gridHeight,
        height: Math.round(gridHeight + a.topPx + a.botPx)
      };
    };

    // ECharts accepts `visualMap` as a single component or an array of them.
    // Both post-processing steps below have to reach every one, so they iterate
    // this rather than assuming the single-component shape.
    const visualMaps = (option) => {
      const vm = option?.visualMap;
      if (!vm) return [];
      return Array.isArray(vm) ? vm : [vm];
    };

    const renderChart = (x) => {
      if (chart) {
        chart.dispose();
        chart = null;
      }

      let themeName = null;
      let themeObj = null;
      const dark = rtemisDrawIsDarkMode();

      if (x.autoTheme) {
        // Auto-detect: pick light or dark theme
        themeObj = dark ? x.themeDark : x.theme;
      } else if (x.theme) {
        themeObj = x.theme;
      }
      renderedDark = dark;
      currentTheme = themeObj;
      if (x.confusion && !bounded) {
        currentHeight = rtemisConfusion.heightForWidth(echarts, x, themeObj, currentWidth);
        el.style.height = `${currentHeight}px`;
      }
      rtemisConfusion.prepare(echarts, x, themeObj, currentWidth, currentHeight);

      if (themeObj) {
        // Propagate the global theme text color to visualMap labels.
        // ECharts does not automatically inherit global textStyle into
        // visualMap.textStyle, so we inject it here before registering.
        // `injectedVisualMapColor` distinguishes a color we wrote on an earlier
        // render (which must be replaced when the theme flips) from one the
        // caller set in R (which must not be touched).
        const fgColor = themeObj.textStyle?.color;
        if (fgColor) {
          visualMaps(x.option).forEach((vm) => {
            if (!vm.textStyle) vm.textStyle = {};
            if (!vm.textStyle.color || injectedVisualMapColor) {
              vm.textStyle.color = fgColor;
              injectedVisualMapColor = true;
            }
          });
        }

        echarts.registerTheme("custom_theme", themeObj);
        themeName = "custom_theme";
      }

      const bgColor = x.option?.backgroundColor || themeObj?.backgroundColor || 'transparent';
      surface.paint(bgColor);
      rtemisPanels.prepareLabels(x);
      rtemisPanels.prepareColors(echarts, x, themeObj);

      chart = echarts.init(el, themeName, {
        renderer: x.renderer || "canvas",
        width: currentWidth,
        height: currentHeight
      });

      if (x.option.grid3D) rtemisScatter3D.prepare(x.option, themeObj, currentWidth, currentHeight);
      chart.setOption(x.option, true);
      rtemisPanels.fitGantt(echarts, chart, x);
      rtemisA3.fit(chart, x, bounded);
      if (x.a3 && !bounded && x.a3.autoHeight) {
        currentHeight = chart.getHeight();
        el.style.height = `${currentHeight}px`;
      }
      onBackground();
      rtemisPanels.fitAxes(chart, x);
      rtemisPanels.fitHeatmap(chart, x);
      rtemisPanels.positionLegend(echarts, chart, x);
      rtemisPanels.centerVisualMaps(chart, x);

      // Double-click resets any dataZoom (e.g. the gantt's inside zoom) back to
      // the full view -- a familiar gesture, in addition to the toolbox reset.
      // No-op when the chart has no dataZoom, so it's safe for every chart type.
      // Re-apply the option's own dataZoom components with start/end = 0/100:
      // setOption merges by index onto exactly those components, resetting every
      // axis (the toolbox's internal dataZoom shift dispatchAction indices, so
      // index-based dispatch would miss an axis). Legend selection is untouched.
      const zoomDefs = x.option?.dataZoom;
      if (zoomDefs?.length) {
        chart.getZr().on("dblclick", () => {
          chart.setOption({
            dataZoom: zoomDefs.map((d) =>
              Object.assign({}, d, { start: 0, end: 100 })
            )
          });
        });
      }
    };

    // Re-render when the effective color scheme changes. The guard compares
    // against the scheme actually rendered, so unrelated body-class churn --
    // which the watcher reports a lot of -- does not cost a re-render.
    const stopWatchingTheme = RtemisThemeWatch.watch(
      el,
      () => {
        if (!currentPayload?.autoTheme) return;
        if (rtemisDrawIsDarkMode() === renderedDark) return;
        renderChart(currentPayload);
      },
      () => {
        surface.restore();
        onBackground();
      }
    );

    // Resolve the grid box and container height for an `aspect` chart at the
    // current container width, writing the result into the option so that the
    // next setOption() uses it. Returns the container height, or null when the
    // payload declares no aspect.
    const applyAspect = (x, containerWidth) => {
      if (!x?.aspect || !x.option?.grid) return null;
      // A multi-grid option is out of scope: aspect describes one plotting box.
      if (Array.isArray(x.option.grid)) return null;
      if (bounded) {
        rtemisPanels.fit(x, containerWidth, currentHeight);
        return currentHeight;
      }
      const box = aspectBox(x.aspect, containerWidth);
      x.option.grid.width = box.gridWidth;
      x.option.grid.height = box.gridHeight;
      el.style.height = `${box.height}px`;
      return box.height;
    };

    return {
      renderValue: (x) => {
        currentPayload = x;

        // Square-cell heatmaps: enforce the correct height by deriving it
        // from the actual container width and the layout margins passed from R.
        // This overrides whatever height htmlwidgets allocated for the container,
        // ensuring cells are always square regardless of viewer window dimensions.
        if (x.squareCells && !bounded) {
          const newHeight = squareCellHeight(x, currentWidth);
          el.style.height = `${newHeight}px`;
          currentHeight = newHeight;
        }

        const aspectHeight = applyAspect(x, currentWidth);
        if (aspectHeight !== null) currentHeight = aspectHeight;

        renderChart(x);
      },

      resize: (width, height) => {
        currentWidth = width;
        currentHeight = height;

        if (currentPayload?.option?.grid3D && chart) {
          rtemisScatter3D.prepare(currentPayload.option, currentTheme, width, height);
          chart.resize({width, height});
          chart.setOption({grid3D:{left:currentPayload.option.grid3D.left,width:currentPayload.option.grid3D.width,height:currentPayload.option.grid3D.height,viewControl:{orthographicSize:currentPayload.option.grid3D.viewControl.orthographicSize}},
            xAxis3D:currentPayload.option.xAxis3D,yAxis3D:currentPayload.option.yAxis3D,zAxis3D:currentPayload.option.zAxis3D,graphic:currentPayload.option.graphic});
          return;
        }
        if (currentPayload?.a3 && chart) {
          chart.resize({width, height});
          rtemisA3.fit(chart, currentPayload, bounded);
          currentHeight = chart.getHeight();
          if (!bounded && currentPayload.a3.autoHeight) el.style.height = `${currentHeight}px`;
          return;
        }

        if (currentPayload?.confusion) {
          if (!bounded) {
            currentHeight = rtemisConfusion.heightForWidth(echarts, currentPayload, currentTheme, width);
            el.style.height = `${currentHeight}px`;
          }
          rtemisConfusion.prepare(echarts, currentPayload, currentTheme, width, currentHeight);
          if (chart) {
            chart.resize({width, height: currentHeight});
            chart.setOption(currentPayload.option, true);
          }
          return;
        }

        if (currentPayload?.squareCells) {
          // Recompute height to keep cells square at the new width
          const newHeight = bounded ? height : squareCellHeight(currentPayload, width);
          el.style.height = `${newHeight}px`;
          currentHeight = newHeight;
          if (chart) {
            chart.resize({ width, height: newHeight });
            rtemisPanels.fitHeatmap(chart, currentPayload);
            rtemisPanels.centerVisualMaps(chart, currentPayload);
          }
          return;
        }

        // Re-solve the grid box at the new width, then push it onto the live
        // chart: resizing alone would stretch the grid and break the scale.
        // `applyAspect` returns null for a payload it does not solve, which
        // falls through to the plain resize rather than handing ECharts a null
        // height.
        const aspectHeight = applyAspect(currentPayload, width);
        if (aspectHeight !== null) {
          currentHeight = aspectHeight;
          if (chart) {
            chart.resize({ width, height: aspectHeight });
            chart.setOption({ grid: currentPayload.option.grid });
            rtemisPanels.fitAxes(chart, currentPayload);
            rtemisPanels.positionLegend(echarts, chart, currentPayload);
            rtemisPanels.centerVisualMaps(chart, currentPayload);
          }
        } else if (chart) {
          chart.resize({ width, height });
          rtemisPanels.fitGantt(echarts, chart, currentPayload);
          rtemisPanels.positionLegend(echarts, chart, currentPayload);
          rtemisPanels.centerVisualMaps(chart, currentPayload);
        }
      },

      dispose: () => {
        stopWatchingTheme();
        surface.restore();
        if (chart) chart.dispose();
        chart = null;
        currentPayload = null;
      },
      getChart: () => chart
    };
}

// Keep one widget binding for standalone drawings and compositions, including
// drawOutput()/renderDraw() in Shiny. Children keep independent chart instances.
HTMLWidgets.widget({
  name: "rtemis-draw", type: "output",
  factory: function(el, width, height) {
    let instance = null;
    return {
      renderValue: function(x) {
        if (instance) instance.dispose();
        el.replaceChildren();
        instance = x.panels ? rtemisPanelFactory(el, width, height) :
          rtemisDrawFactory(el, width, height);
        instance.renderValue(x);
      },
      resize: function(w, h) {
        width = w; height = h;
        if (instance) instance.resize(w, h);
      },
      getChart: () => instance?.getChart?.() || null,
      getCharts: () => instance?.getCharts?.() || (instance?.getChart?.() ? [instance.getChart()] : []),
      dispose: () => { if (instance) instance.dispose(); instance = null; }
    };
  }
});
