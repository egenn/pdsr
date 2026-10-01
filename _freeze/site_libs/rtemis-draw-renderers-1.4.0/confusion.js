// Resolve confusion-chart constraints from the canvas and active theme. The
// same native ECharts grids, heatmaps, and annotations render in browsers and
// vector SVG; no callbacks or pixel dimensions enter the semantic config.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.rtemisConfusion = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  function rgb(echarts, color, fallback) {
    return echarts.color.parse(color) || echarts.color.parse(fallback);
  }

  function blend(echarts, low, high, fraction) {
    const a = rgb(echarts, low, '#ffffff');
    const b = rgb(echarts, high, '#000000');
    return '#' + a.slice(0, 3).map((v, i) => Math.round(v + (b[i] - v) * fraction)
      .toString(16).padStart(2, '0')).join('');
  }

  function contrast(echarts, color) {
    const channels = rgb(echarts, color, '#ffffff').slice(0, 3).map(v => {
      const c = v / 255;
      return c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4;
    });
    return channels.reduce((sum, v, i) => sum + v * [.2126, .7152, .0722][i], 0) > .179
      ? '#000000' : '#ffffff';
  }

  // Measure text with ECharts' own font metrics, including in headless SVG.
  // A minimum panel width lets a multi-column composition reflow on phones.
  function dimensions(echarts, payload, theme, width, height = Infinity) {
    const meta = payload.confusion, option = payload.option;
    const family = option.textStyle?.fontFamily || theme?.textStyle?.fontFamily || 'sans-serif';
    const step = meta.metrics ? 4 : 1, panels = option.grid.length / step;
    const classes = option.yAxis[0].data;
    const cols = Math.max(1, Math.min(meta.ncol, panels, Math.floor(width / 360)));
    const rows = Math.ceil(panels / cols), panelWidth = width / cols;
    const titleOffset = option.title.length - panels;
    const metricLabels = meta.metrics ? option.series.filter((_, i) => i % 5 >= 2)
      .flatMap(series => series.data.map(d => d.label.formatter)) : [];
    // Measure ECharts' native wrapped text. Derive every font and margin from
    // semantic input on each resize, so a narrow view cannot shrink a later one.
    for (let fontSize = meta.fontSize; ; fontSize = Math.max(8, fontSize - 1)) {
      const measure = text => echarts.format.getTextRect(String(text), `${fontSize}px ${family}`).width;
      const wrappedHeight = (text, width) => new echarts.graphic.Text({style: {
        text: String(text), fontSize, fontFamily: family, width: Math.max(1, width),
        overflow: 'break', lineHeight: fontSize + 2
      }}).getBoundingRect().height;
      const labelWidth = Math.min(Math.max(...classes.map(measure), meta.metrics ? measure('NPV') : 0), panelWidth * .26);
      const left = 12 + labelWidth + 10 + (option.yAxis[0].name ? fontSize + 16 : 0);
      const rateWidth = Math.max(0, ...metricLabels.map(text => measure(String(text).split('\n').pop())));
      const strip = meta.metrics ? 2 * (Math.max(measure('Sens.'), measure('Spec.'), rateWidth) + 16) : 0;
      const header = option.title.slice(titleOffset).some(t => t.text) ? meta.fontSize + 14 : 0;
      const bottom = meta.metrics ? 8 + 2 * (2 * fontSize + 12) : 0;
      const footer = 12, globalTop = titleOffset ? meta.fontSize + 28 : 0;
      const availableWidth = panelWidth - left - strip - (strip ? 8 : 0) - 12;
      const panelHeight = (height - globalTop) / rows;
      let side = availableWidth, top, columnLabelHeight, columnLabelWidth, columnRotation;
      // Header wrapping and square-cell size constrain each other on short
      // surfaces. Iterate conservatively; reducing the font resolves crowding.
      for (let pass = 0; pass < 20; pass++) {
        columnRotation = Math.max(...classes.map(measure)) > side / classes.length - 4 ? 90 : 0;
        columnLabelWidth = columnRotation ? Math.max(labelWidth, Math.min(180, panelHeight * .28)) : Math.max(1, side / classes.length - 4);
        columnLabelHeight = columnRotation ? Math.min(columnLabelWidth, Math.max(...classes.map(measure))) : fontSize + 2;
        top = 12 + header + (option.xAxis[0].name ? fontSize + 18 : 0) + columnLabelHeight + 12;
        const next = Math.max(1, Math.min(availableWidth, panelHeight - top - bottom - footer));
        if (Math.abs(next - side) < .01) break;
        side = next;
      }
      const rowHeight = Math.max(...classes.map(t => wrappedHeight(t, labelWidth)), ...(columnRotation ? classes.map(t => wrappedHeight(t, columnLabelWidth)) : []));
      if (Math.max(rowHeight + 2, rateWidth + 4) <= side / classes.length && side > 0) {
        return {fontSize, family, step, panels, cols, rows, titleOffset, header, left, strip,
          top, bottom, footer, labelWidth, columnLabelHeight, columnLabelWidth, columnRotation, globalTop};
      }
      if (fontSize <= Math.min(8, meta.fontSize)) {
        throw new Error('Increase confusion figure dimensions or reduce panels per figure to keep class labels and metrics readable.');
      }
    }
  }

  // Standalone browser widgets may grow vertically when panels wrap. Bounded
  // compositions and SVG exports instead fit their requested canvas exactly.
  function heightForWidth(echarts, payload, theme, width) {
    if (!payload?.confusion) return null;
    const d = dimensions(echarts, payload, theme, width);
    const side = Math.max(1, Math.min(400, width / d.cols - d.left - d.strip - (d.strip ? 8 : 0) - 12));
    return Math.ceil(d.globalTop + d.rows * (d.top + side + d.bottom + d.footer));
  }

  function prepare(echarts, payload, theme, width, height) {
    if (!payload?.confusion) return;
    const option = payload.option, meta = payload.confusion;
    const d = dimensions(echarts, payload, theme, width, height);
    const bg = option.backgroundColor || theme?.backgroundColor || '#ffffff';
    const fg = option.textStyle?.color || theme?.textStyle?.color || contrast(echarts, bg);
    const low = meta.lowColor || bg;
    const neutral = contrast(echarts, bg);
    const summary = meta.summaryColor || blend(echarts, bg, neutral, .05);
    const overall = meta.summaryColor || blend(echarts, bg, neutral, .025);
    const muted = blend(echarts, bg, fg, .72);
    const panelWidth = width / d.cols;
    const panelHeight = (height - d.globalTop) / d.rows;
    const side = Math.max(1, Math.min(
      panelWidth - d.left - d.strip - (d.strip ? 8 : 0) - 12,
      panelHeight - d.top - d.bottom - d.footer
    ));
    const wholeWidth = d.left + side + (d.strip ? 8 : 0) + d.strip + 12;
    const wholeHeight = d.top + side + d.bottom + d.footer;
    const seriesStep = meta.metrics ? 5 : 2;
    for (let i = 0; i < d.panels; i++) {
      const x = (i % d.cols) * panelWidth + (panelWidth - wholeWidth) / 2;
      const y = d.globalTop + Math.floor(i / d.cols) * panelHeight + (panelHeight - wholeHeight) / 2;
      const left = x + d.left, top = y + d.top;
      const boxes = [[left, top, side, side]];
      if (meta.metrics) boxes.push(
        [left + side + 8, top, d.strip, side],
        [left, top + side + 8, side, d.bottom - 8],
        [left + side + 8, top + side + 8, d.strip, d.bottom - 8]
      );
      boxes.forEach((box, j) => {
        const index = i * d.step + j;
        Object.assign(option.grid[index], {
          left: box[0], top: box[1], width: box[2], height: box[3],
          containLabel: false, outerBoundsMode: 'none'
        });
        for (const axis of [option.xAxis[index], option.yAxis[index]]) {
          Object.assign(axis.axisLabel, {color: muted, fontSize: d.fontSize, lineHeight: d.fontSize + 2});
          axis.axisTick = {show: false};
          // Margins already account for labels; ECharts must not add them twice.
          axis.nameMoveOverlap = false;
          axis.nameTextStyle = {fontSize: d.fontSize, color: muted};
        }
        option.xAxis[index].nameGap = d.columnLabelHeight + 18;
        if (j === 0) {
          Object.assign(option.xAxis[index].axisLabel, {width: d.columnLabelWidth, rotate: d.columnRotation, overflow: 'break'});
          Object.assign(option.yAxis[index].axisLabel, {width: d.labelWidth, overflow: 'break'});
        }
        option.yAxis[index].nameGap = d.labelWidth + 20;
      });
      const title = option.title[i + d.titleOffset];
      Object.assign(title, {left: left + side / 2, top: y + 4, textAlign: 'center'});
      title.textStyle = Object.assign({}, title.textStyle, {color: fg});
      for (let j = 0; j < seriesStep; j++) {
        const index = i * seriesStep + j;
        const series = option.series[index], map = option.visualMap[index];
        const high = j < 2 ? map.inRange.color[1] : (j === 4 ? overall : summary);
        map.inRange.color = j < 2 ? [low, high] : [high, high];
        Object.assign(series.itemStyle, {borderColor: bg, borderWidth: 1});
        for (const point of series.data) {
          point.label.color = j < 2 ? contrast(echarts, blend(echarts, low, high, point.value[2]))
            : (meta.summaryColor ? contrast(echarts, high) : fg);
          point.label.fontWeight = j < 2 ? 'bold' : 'normal';
          point.label.fontSize = d.fontSize;
        }
      }
    }
  }
  return {prepare, heightForWidth};
});
