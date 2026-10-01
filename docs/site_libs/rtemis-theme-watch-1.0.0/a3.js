// Shared A3 surface fitting: native ECharts marks remain JSON and vector-safe.
// GridOption (coord/cartesian/GridModel.ts), LegendOption (component/legend/
// LegendModel.ts), and series symbol/label styles (util/types.ts).
// spec: draw/first-cran-release#a3-responsive-surface-layout
(function(root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('../echarts/echarts.min.js'));
  else root.rtemisA3 = factory(root.echarts);
})(typeof globalThis !== 'undefined' ? globalThis : this, function(echarts) {
  'use strict';
  function fit(chart, payload, bounded = true) {
    const hint = payload.a3;
    if (!hint) return;
    const source = payload.option, width = chart.getWidth();
    const xRange = source.xAxis.max - source.xAxis.min;
    const yRange = source.yAxis.max - source.yAxis.min;
    const marker = hint.markerSize, step = hint.residueSpacing;
    const glyph = Math.max(1, marker, hint.fontSize);
    const rgb = echarts.color.parse(chart.getModel().get('backgroundColor') || '#ffffff');
    const dark = rgb && rgb[3] !== 0 && rgb.slice(0, 3).reduce((sum, value, i) => sum + value * [.2126, .7152, .0722][i], 0) < 128;
    const colors = dark ? hint.colorsDark : hint.colorsLight;
    if (![marker, hint.fontSize].every(v => Number.isFinite(v) && v >= 0) ||
        ![step, xRange, yRange].every(v => Number.isFinite(v) && v > 0)) {
      throw new Error('Supply nonnegative A3 glyph sizes, positive residue spacing, and increasing axis ranges.');
    }
    const grid = {...source.grid};
    {
      // A3 follows rtemislive's dedicated upper-right annotation rail. Keep
      // all families in one native legend so their symbols and text share a
      // left edge. Unlimited layout height prevents ECharts flowing entries
      // into adjacent columns; measured content sets the required surface.
      const selected = {};
      chart.getModel().eachComponent('legend', model => Object.assign(selected, model.get('selected')));
      chart.setOption({legend: {
        ...source.legend, selected, orient: 'vertical', align: 'left',
        left: null, bottom: null, width: null, height: 1000000
      }});
      const model = chart.getModel().getComponent('legend');
      const box = chart.getViewOfComponentModel(model).group.getBoundingRect();
      // Like live's measured rail, long annotation names reserve their actual
      // width. Geometry is derived from the source on every resize, preserving
      // the gap and avoiding cumulative changes to the sequence or selection.
      if (hint.autoGrid) grid.right = source.legend.right + box.width + (hint.legendGap ?? 40);
      if (hint.autoGrid && hint.autoHeight && !bounded) {
        grid.height = hint.bodyHeight ?? glyph * 2 * yRange;
        const height = Math.max(
          grid.top + grid.height + grid.bottom,
          source.legend.top + box.height + grid.bottom
        );
        chart.resize({width, height: Math.ceil(height)});
      }
      chart.setOption({grid});
    }
    // Actual native grid dimensions also respect caller-supplied margins.
    const area = chart.getModel().getComponent('grid').coordinateSystem.getRect();
    if (area.width <= 0 || area.height <= 0) {
      throw new Error('Increase A3 figure dimensions to leave room for residues and the legend.');
    }
    const dx = area.width / xRange * step, dy = area.height / yRange;
    const turn = Math.hypot(Math.sqrt(3) / 2 * dx, dy / 2);
    const scale = Math.min(1, Math.min(dx, dy, turn) / (glyph + 4));
    // Scale every glyph dimension from its original value, never from the
    // previous frame. Geometry/data identities and all annotation colors stay.
    const scaled = (object, keys) => {
      if (!object) return undefined;
      const update = {};
      keys.forEach(key => {
        if (typeof object[key] === 'number') update[key] = object[key] * scale;
        else if (Array.isArray(object[key])) update[key] = object[key].map(v => v * scale);
      });
      return update;
    };
    chart.setOption({series: source.series.map((series, index) => {
      const role = hint.seriesRoles?.[index];
      const backbone = colors && role === 'backbone';
      return {
        ...scaled(series, ['symbolSize', 'symbolOffset']),
        lineStyle: {...scaled(series.lineStyle, ['width']), ...(backbone ? {color: colors.residueStroke} : {})},
        itemStyle: {...scaled(series.itemStyle, ['borderWidth']), ...(backbone ? {
          color: colors.residueFill, borderColor: colors.residueStroke
        } : {})},
        data: series.data.map((datum, i) => datum?.label ? {
          ...datum, label: {
            ...datum.label, ...scaled(datum.label, ['fontSize', 'distance']),
            ...(colors && role === 'labels' ? {color: colors[hint.labelRoles[i]]} : {}),
            ...(colors && role === 'positions' ? {color: colors.position} : {})
          }
        } : datum)
      };
    })});
  }
  return {fit};
});
