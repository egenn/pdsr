// Shared geometry for independent chart panels in browser and SVG export.
// spec: draw/first-cran-release#current-static-export-boundary
// Child EChartsOption references stay local to each ECharts instance.
(function(root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.rtemisPanels = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function() {
  'use strict';
  // A shared surface has a meaningful fill only when all child backgrounds
  // agree. Mixed figures remain transparent instead of privileging one panel.
  function background(payload, dark = false) {
    const colors = payload.panels.map(panel => {
      const theme = panel.autoTheme && dark ? panel.themeDark : panel.theme;
      const color = panel.option?.backgroundColor || theme?.backgroundColor;
      // ECharts also accepts gradients; those remain local to their child.
      return typeof color === 'string' ? color : 'transparent';
    });
    return colors.every(color => color === colors[0]) ? colors[0] : 'transparent';
  }
  function cells(count, layout, width, height) {
    const cols = layout.ncol, gap = layout.gap, pad = layout.padding;
    const rows = Math.ceil(count / cols);
    if (!Number.isInteger(count) || count < 1 || !Number.isInteger(cols) || cols < 1 ||
        ![width, height, gap, pad].every(Number.isFinite) || gap < 0 || pad < 0) {
      throw new Error('Supply a valid panel count, layout, and finite figure dimensions.');
    }
    const w = (width - 2 * pad - (cols - 1) * gap) / cols;
    const h = (height - 2 * pad - (rows - 1) * gap) / rows;
    if (w <= 0 || h <= 0) throw new Error('Increase figure dimensions to leave room for panels.');
    return Array.from({length: count}, (_, i) => ({
      x: pad + (i % cols) * (w + gap), y: pad + Math.floor(i / cols) * (h + gap),
      width: w, height: h
    }));
  }
  function fit(payload, width, height) {
    const a = payload.aspect;
    if (!a) return;
    const grid = payload.option.grid;
    if (!grid || Array.isArray(grid)) throw new Error('A fixed-aspect panel requires one plotting grid.');
    if (![a.ratio, a.leftPx, a.rightPx, a.topPx, a.botPx].every(Number.isFinite) ||
        a.ratio <= 0 || [a.leftPx, a.rightPx, a.topPx, a.botPx].some(v => v < 0)) {
      throw new Error('Supply a positive aspect ratio and nonnegative pixel margins.');
    }
    const available = Math.min(width - a.leftPx - a.rightPx,
      (height - a.topPx - a.botPx) / a.ratio);
    const preferred = a.widthPx == null ? available : a.widthPx;
    if (!Number.isFinite(preferred) || preferred <= 0 || available <= 0) {
      throw new Error('Increase panel dimensions to leave room for the plotting grid and margins.');
    }
    grid.width = Math.min(available, preferred);
    grid.height = grid.width * a.ratio;
    grid.left = a.leftPx + (width - a.leftPx - a.rightPx - grid.width) / 2;
    grid.top = a.topPx + (height - a.topPx - a.botPx - grid.height) / 2;
  }
  // Native outer bounds reserve axis-label/name space before we enforce the
  // data-area ratio. Pinning the unmeasured outer box instead clips labels;
  // leaving native shrinkage unconstrained makes an identity line non-square.
  // Shared by standalone widgets, bounded panels, and Node SVG rendering.
  function fitAxes(chart, payload) {
    const a = payload.aspect;
    if (!a) return;
    const rect = chart.getModel().getComponent('grid').coordinateSystem.getRect();
    const width = Math.min(rect.width, rect.height / a.ratio);
    const height = width * a.ratio;
    chart.setOption({grid: {
      left: rect.x + (rect.width - width) / 2,
      top: rect.y + (rect.height - height) / 2,
      width, height, containLabel: false, outerBoundsMode: 'none'
    }});
  }
  // Fit all heatmap grids as one scene. The row/column dendrogram strips keep
  // their thickness and remain aligned with the matrix when space is added
  // around a square-cell plot. Always derive from the original option so a
  // resize cannot accumulate offsets. GridOption: coord/cartesian/GridModel.ts.
  function fitHeatmap(chart, payload) {
    if (!payload.squareCells) return;
    const {nRows, nCols, leftPx, rightPx, topPx, botPx} = payload;
    if (![nRows, nCols].every(v => Number.isInteger(v) && v > 0) ||
        ![leftPx, rightPx, topPx, botPx].every(v => Number.isFinite(v) && v >= 0)) {
      throw new Error('Supply positive heatmap dimensions and nonnegative pixel margins.');
    }
    const availableWidth = chart.getWidth() - leftPx - rightPx;
    const availableHeight = chart.getHeight() - topPx - botPx;
    const cell = Math.min(availableWidth / nCols, availableHeight / nRows);
    if (cell <= 0) throw new Error('Increase figure dimensions to leave room for heatmap cells and margins.');
    const dx = (availableWidth - nCols * cell) / 2;
    const dy = (availableHeight - nRows * cell) / 2;
    const grids = Array.isArray(payload.option.grid) ? payload.option.grid : [payload.option.grid];
    const update = {grid: grids.map(grid => {
      const update = {...grid, containLabel: false, outerBoundsMode: 'none'};
      for (const side of ['left', 'right', 'top', 'bottom']) {
        if (grid[side] != null) update[side] = grid[side] + (['left', 'right'].includes(side) ? dx : dy);
      }
      return update;
    })};
    // Keep marginal components with the fitted scene instead of leaving the
    // colorbar at the far canvas edge when height constrains the matrix.
    const maps = payload.option.visualMap;
    if (maps) update.visualMap = (Array.isArray(maps) ? maps : [maps]).map(map => {
      const side = map.orient === 'horizontal' ? 'bottom' : 'right';
      const offset = side === 'right' ? dx : dy;
      const anchor = map[side] === side ? 0 : map[side];
      return Number.isFinite(anchor) ? {[side]: anchor + offset} : {};
    });
    const titles = payload.option.title;
    if (titles) update.title = (Array.isArray(titles) ? titles : [titles]).map(title =>
      Number.isFinite(title.left) ? {left: title.left + dx} : {});
    chart.setOption(update);
  }
  // Native label layout knows each cell's final size, after grid fitting and
  // resizing. Keep literal full notes in data, and truncate only their labels.
  function prepareLabels(payload) {
    (payload.option.series || []).forEach(series => {
      if (!series.rtemisCellNotes) return;
      series.label = {...series.label, overflow: 'truncate', ellipsis: '...'};
      series.labelLayout = params => ({
        width: Math.max(0, params.rect.width - 5),
        height: Math.max(0, params.rect.height - 3),
        hideOverlap: true
      });
    });
  }
  // Resolve the precomputed heatmap/spectrogram palettes from the actual theme,
  // including explicit overrides and offline SVG's resolved light default.
  // The same choice in both targets avoids exporting a dark plot's white ramp.
  function prepareColors(echarts, payload, theme) {
    if (!payload.colorLight && !payload.colorDark) return;
    const rgb = echarts.color.parse(payload.option.backgroundColor || theme?.backgroundColor || '#ffffff');
    const dark = rgb && rgb.slice(0, 3).reduce((sum, value, i) => sum + value * [.2126, .7152, .0722][i], 0) < 128;
    const colors = (dark ? payload.colorDark : payload.colorLight) || payload.colorLight || payload.colorDark;
    const maps = payload.option.visualMap;
    (Array.isArray(maps) ? maps : [maps]).filter(Boolean).forEach(map => {
      map.inRange = {...map.inRange, color: colors};
    });
  }
  // Layout the complete categorical legend against measured native geometry.
  // Position and placement are semantic hints, never extra ECharts options.
  // Native LegendView handles row wrapping; measured space is shared by SVG.
  function layoutLegend(echarts, chart, payload) {
    const position = payload.legendPosition;
    if (!position || payload.legendTarget === 'visualMap') return;
    // Old serialized ROC widgets carry only a corner and retain inset meaning.
    const inside = (payload.legendPlacement || 'inside') === 'inside';
    const vertical = position === 'left' || position === 'right';
    const lower = position.startsWith('bottom'), right = position.endsWith('right');
    const left = position.endsWith('left');
    const width = chart.getWidth(), height = chart.getHeight(), gap = 12;
    const source = payload.option;
    let models = [];
    chart.getModel().eachComponent('legend', model => {
      if (model.get('show') && model.getData().length) models.push(model);
    });
    if (!models.length) return;
    const bounds = model => {
      const group = chart.getViewOfComponentModel(model).group;
      const box = group.getBoundingRect().clone();
      box.applyTransform(group.getComputedTransform());
      return box;
    };
    const px = (value, extent, fallback) => typeof value === 'number' ? value :
      typeof value === 'string' && value.endsWith('%') ? parseFloat(value) * extent / 100 : fallback;
    let header = gap;
    ['title', 'toolbox'].forEach(type => chart.getModel().eachComponent(type, model => {
      const box = bounds(model);
      if (box.width && box.height && box.y < height / 2) header = Math.max(header, box.y + box.height + gap);
    }));
    // Restore authored margins on each pass: repeated resize must not accumulate
    // legend space. The aspect fitter subsequently constrains the data rectangle.
    let grids = source.grid ? (Array.isArray(source.grid) ? source.grid : [source.grid]).map(g => ({...g})) : [];
    if (payload.aspect) {
      const a = payload.aspect;
      grids = [{...grids[0], left: a.leftPx, right: a.rightPx, top: a.topPx, bottom: a.botPx,
        width: null, height: null}];
    }
    const isGantt = (Array.isArray(source.series) ? source.series : [source.series])
      .some(s => s?.renderItem === 'rtemis.gantt.v1');
    if (isGantt) grids = grids.map(g => ({...g, right: 16, top: Math.max(g.top, header)}));
    if (grids.length) chart.setOption({grid: grids});
    const area = () => {
      const model = chart.getModel().getComponent('grid');
      return model ? model.coordinateSystem.getRect() : {x: gap, y: header, width: width - 2 * gap, height: height - header - gap};
    };
    const initial = area();
    const availableWidth = vertical ? Math.max(60, Math.min(initial.width * .4, 240)) : Math.max(1, initial.width - (inside ? 2 * gap : 0));
    const availableHeight = Math.max(1, initial.height - (inside ? 2 * gap : 0));
    const legends = models.map(model => {
      const font = model.getModel('textStyle').getFont();
      const natural = Math.max(0, ...model.getData().map(item =>
        echarts.format.getTextRect(item.get('name'), font).width));
      const textWidth = Math.max(1, availableWidth - model.get('itemWidth') - 15);
      return {id: model.id, orient: vertical ? 'vertical' : 'horizontal',
        left: 0, right: null, top: 0, bottom: null, width: availableWidth,
        height: vertical ? availableHeight : 1000000,
        textStyle: {width: natural > textWidth ? textWidth : null, overflow: 'break'}};
    });
    chart.setOption({legend: legends});
    models = models.map(model => chart.getModel().getComponent('legend', model.componentIndex));
    const boxes = models.map(bounds);
    // Keep annotation families together, but pack complete components into
    // horizontal rows instead of giving every family its own full-width band.
    const rows = [];
    boxes.forEach((box, index) => {
      let row = rows[rows.length - 1];
      if (!row || vertical || row.width + 16 + box.width > availableWidth) {
        row = {items: [], width: 0, height: 0}; rows.push(row);
      }
      row.items.push({index, offset: row.width + (row.items.length ? 16 : 0)});
      row.width += box.width + (row.items.length > 1 ? 16 : 0);
      row.height = Math.max(row.height, box.height);
    });
    const legendHeight = rows.reduce((sum, row) => sum + row.height, 0) + (rows.length - 1) * 6;
    const legendWidth = Math.max(...rows.map(row => row.width));
    const extra = vertical ? legendWidth + gap : legendHeight + gap;
    if (!inside) {
      grids = grids.map(g => {
        const next = {...g};
        if (vertical) {
          const side = right ? 'right' : 'left';
          next[side] = px(g[side], width, 36) + extra;
        } else if (lower) {
          next.bottom = px(g.bottom, height, 36) + extra;
        } else {
          next.top = Math.max(px(g.top, height, 36), header + extra);
        }
        return next;
      });
      const update = {};
      if (grids.length) update.grid = grids;
      else update.series = (Array.isArray(source.series) ? source.series : [source.series]).map(s => {
        // Native box-layout series such as pie reserve the same outside bands.
        if (s?.type !== 'pie') return {};
        return {left: gap + (vertical && left ? extra : 0), right: gap + (vertical && right ? extra : 0),
          top: header + (!vertical && !lower ? extra : 0), bottom: gap + (!vertical && lower ? extra : 0)};
      });
      // Bottom legends sit below slider controls; move those controls as a band.
      if (!vertical && lower && source.dataZoom) {
        update.dataZoom = (Array.isArray(source.dataZoom) ? source.dataZoom : [source.dataZoom]).map(z =>
          z.type === 'slider' ? {bottom: px(z.bottom, height, 0) + extra} : {});
      } else if (source.dataZoom) {
        update.dataZoom = (Array.isArray(source.dataZoom) ? source.dataZoom : [source.dataZoom]).map(z =>
          z.type === 'slider' ? {bottom: z.bottom ?? null} : {});
      }
      chart.setOption(update);
    }
    if (payload.aspect) fitAxes(chart, payload);
    const grid = area();
    let top = inside ? (lower ? grid.y + grid.height - legendHeight - gap :
      vertical ? grid.y + (grid.height - legendHeight) / 2 : grid.y + gap) :
      vertical ? grid.y + (grid.height - legendHeight) / 2 : lower ? height - gap - legendHeight : header;
    const updates = [];
    rows.forEach(row => {
      const x = vertical ? (inside ? (right ? grid.x + grid.width - row.width - gap : grid.x + gap) :
        right ? width - gap - row.width : gap) :
        right ? grid.x + grid.width - row.width - (inside ? gap : 0) :
        left ? grid.x + (inside ? gap : 0) : grid.x + (grid.width - row.width) / 2;
      row.items.forEach(item => updates.push({id: models[item.index].id,
        left: x + item.offset, right: null, top, bottom: null}));
      top += row.height + 6;
    });
    chart.setOption({legend: updates});
  }

  // Continuous legends share anchors/placement but retain a vertical right
  // default. Their native view includes endpoint text and draggable handles.
  function positionVisualMaps(chart, payload) {
    const position = payload.legendPosition;
    const model = chart.getModel().getComponent('visualMap');
    if (!position || !model?.get('show')) return;
    const source = payload.option, gap = 12, width = chart.getWidth(), height = chart.getHeight();
    const vertical = position === 'left' || position === 'right';
    const inside = payload.legendPlacement === 'inside';
    const right = position.endsWith('right'), left = position.endsWith('left'), lower = position.startsWith('bottom');
    const bounds = component => {
      const group = chart.getViewOfComponentModel(component).group;
      const box = group.getBoundingRect().clone(); box.applyTransform(group.getComputedTransform()); return box;
    };
    const px = (v, extent) => typeof v === 'string' && v.endsWith('%') ? parseFloat(v) * extent / 100 : +v || 0;
    const grids = (Array.isArray(source.grid) ? source.grid : [source.grid]).map(g => ({...g}));
    // Remove only the builder's automatic right-side allowance. User margins
    // and dendrogram bands remain part of the authored plotting geometry.
    const reserved = payload.legendReserveRight || 0;
    grids.forEach(g => {if (g.right != null) g.right = px(g.right, width) - reserved;});
    chart.setOption({grid: grids, visualMap: {orient: vertical ? 'vertical' : 'horizontal',
      left: 0, top: 0, right: null, bottom: null,
      itemHeight: Math.min(140, Math.max(30, (vertical ? height : width) - 160))}});
    const box = bounds(model);
    const side = vertical ? (right ? 'right' : 'left') : lower ? 'bottom' : 'top';
    let header = gap;
    chart.getModel().eachComponent('title', title => {
      const t = bounds(title); if (t.width && t.height) header = Math.max(header, t.y + t.height + gap);
    });
    const firstTop = Math.min(...grids.map(g => px(g.top, height)));
    const extra = inside ? 0 : side === 'top' ? Math.max(0, header + box.height + gap - firstTop) :
      (vertical ? box.width : box.height) + gap;
    const adjusted = {...payload, option: {...source, grid: grids}, rightPx: payload.rightPx - reserved};
    grids.forEach(g => {if (g[side] != null) g[side] = px(g[side], vertical ? width : height) + extra;});
    const key = {top: 'topPx', bottom: 'botPx', left: 'leftPx', right: 'rightPx'}[side];
    if (Number.isFinite(adjusted[key])) adjusted[key] += extra;
    chart.setOption({grid: grids});
    if (payload.squareCells) fitHeatmap(chart, adjusted);
    const areas = [];
    model.eachTargetSeries(series => {
      if (series.subType === 'heatmap' && series.coordinateSystem?.type === 'cartesian2d') areas.push(series.coordinateSystem.getArea());
    });
    if (!areas.length) return;
    const grid = areas[0];
    // Outside anchors sit beyond axis/dendrogram bands, not across their labels.
    const dx = payload.squareCells ? Math.max(0, (width - adjusted.leftPx - adjusted.rightPx - grid.width) / 2) : 0;
    const x = vertical ? (inside ? right ? grid.x + grid.width - box.width - gap : grid.x + gap :
      right ? width - gap - box.width - dx : gap + dx) :
      left ? grid.x + (inside ? gap : 0) : right ? grid.x + grid.width - box.width - (inside ? gap : 0) : grid.x + (grid.width - box.width) / 2;
    let y = vertical ? grid.y + (grid.height - box.height) / 2 :
      inside ? lower ? grid.y + grid.height - box.height - gap : grid.y + gap :
      lower ? height - gap - box.height : header;
    chart.setOption({visualMap: {left: x, right: null, top: y, bottom: null}});
  }
  // Edge-aligned pie labels need a real text band. ECharts truncates them to
  // zero width when radius + guide lines consume that band. Fit from authored
  // radii on every resize, so a narrow host does not permanently shrink a pie.
  function positionLegend(echarts, chart, payload) {
    fitSankey(echarts, chart, payload);
    layoutLegend(echarts, chart, payload);
    const definitions = payload.option?.series;
    const source = Array.isArray(definitions) ? definitions : [definitions];
    const updates = source.map((definition, index) => {
      if (definition?.type !== 'pie' || definition.label?.alignTo !== 'edge') return {};
      const model = chart.getModel().getSeriesByIndex(index), data = model.getData();
      const rect = data.getLayout('viewRect');
      const px = (value, extent) => typeof value === 'string' && value.endsWith('%') ? parseFloat(value)*extent/100 : +value || 0;
      const base = Math.min(rect.width, rect.height)/2;
      const radii = Array.isArray(definition.radius) ? definition.radius : [0, definition.radius ?? '75%'];
      const outer = px(radii[1], base), inner = px(radii[0], base);
      let band = 0;
      for (let i=0; i<data.count(); i++) {
        const label = data.getItemModel(i).getModel('label');
        if (label.get('show') === false || !['outer','outside'].includes(label.get('position'))) continue;
        const line = data.getItemModel(i).getModel('labelLine');
        const width = echarts.format.getTextRect(data.getName(i), label.getFont()).width;
        band = Math.max(band, width + px(label.get('edgeDistance'),rect.width) +
          px(line.get('length'),rect.width) + px(line.get('length2'),rect.width) +
          (label.get('distanceToLabelLine') || 0) + 4);
      }
      const radius = Math.min(outer, Math.max(10, rect.width/2 - band));
      return {radius: [outer ? inner*radius/outer : 0, radius]};
    });
    if (updates.some(update => update.radius)) chart.setOption({series: updates});
  }
  // A centered vertical colorbar belongs beside the data grid, which may be
  // offset by titles, rotated labels, or dendrograms. Measure the native view
  // after layout so its handles and endpoint text are included. Keep this in
  // the shared renderer so browser resize and vector export agree.
  function centerVisualMaps(chart, payload) {
    if (payload.legendTarget === 'visualMap') return positionVisualMaps(chart, payload);
    const definitions = payload.option?.visualMap;
    if (!definitions) return;
    const maps = Array.isArray(definitions) ? definitions : [definitions];
    let changed = false;
    const updates = maps.map((definition, index) => {
      if (!['middle', 'center'].includes(definition.top)) return {};
      const model = chart.getModel().getComponent('visualMap', index);
      if (!model?.get('show') || model.get('orient') !== 'vertical') return {};
      const areas = [];
      model.eachTargetSeries(series => {
        if (series.subType === 'heatmap' && series.coordinateSystem?.type === 'cartesian2d') {
          areas.push(series.coordinateSystem.getArea());
        }
      });
      if (!areas.length) return {};
      const top = Math.min(...areas.map(area => area.y));
      const bottom = Math.max(...areas.map(area => area.y + area.height));
      const view = chart.getViewOfComponentModel(model);
      const height = view.group.getBoundingRect().height;
      changed = true;
      return {top: (top + bottom - height) / 2};
    });
    if (changed) chart.setOption({visualMap: updates});
  }
  // Fit the package-owned timeline renderer on every surface. Measure native
  // legend/text bounds instead of reserving a fixed right-hand strip. ECharts
  // GridOption, LegendOption and AxisLabelBaseOption are the source contracts
  // (coord/cartesian/GridModel.ts, component/legend/LegendModel.ts,
  // coord/axisCommonTypes.ts). No data, zoom or selection settings are replaced.
  // spec: draw/first-cran-release#responsive-timelines
  function fitGantt(echarts, chart, payload) {
    const source = payload.option;
    const series = Array.isArray(source?.series) ? source.series : [source?.series];
    if (!series.some(s => s?.renderItem === 'rtemis.gantt.v1') ||
        !source.grid || Array.isArray(source.grid) ||
        !source.xAxis || !source.yAxis || Array.isArray(source.xAxis) || Array.isArray(source.yAxis)) return;
    const width = chart.getWidth(), model = chart.getModel();
    const y = model.getComponent('yAxis');
    const font = y.getModel('axisLabel').getFont();
    const labelWidth = Math.min(width * 0.35, y.get('data').reduce((max, label) =>
      Math.max(max, echarts.format.getTextRect(String(label), font).width + 2), 0));
    const update = {grid: {...source.grid},
      yAxis: {axisLabel: {width: labelWidth, overflow: 'truncate', ...source.yAxis.axisLabel}}};
    // Only adapt the builder's automatic legend. Explicit low-level placement
    // remains under the caller's control, including a hidden legend.
    const automatic = !payload.legendPosition && source.legend?.orient === 'vertical' &&
      source.legend.right === 8 && source.legend.top === 'middle' && source.legend.show !== false;
    let below = false;
    if (automatic) {
      const legend = model.getComponent('legend'), font = legend.getModel('textStyle').getFont();
      const natural = Math.max(0, ...legend.getData().map(item =>
        echarts.format.getTextRect(item.get('name'), font).width));
      const right = Math.max(source.grid.right, natural + legend.get('itemWidth') + 29);
      below = width - labelWidth - right - 32 < 240;
      const available = Math.max(24, width - legend.get('itemWidth') - 31);
      update.legend = {...source.legend, selected: legend.get('selected'), left: below ? 8 : null,
        right: 8, top: below ? null : 'middle', bottom: below ? 4 : null,
        orient: below ? 'horizontal' : 'vertical',
        textStyle: {...source.legend.textStyle,
          width: below && natural > available ? available : null,
          overflow: 'break'}};
      update.grid.right = below ? 16 : right;
    }
    // On a narrow surface put the toolbar on a separate header row, keeping
    // both the title and controls visible. Even untitled charts reserve its row.
    if (source.toolbox?.show !== false && Number.isFinite(source.toolbox?.top)) {
      const title = model.getComponent('title'), toolbox = model.getComponent('toolbox');
      const bounds = component => {
        if (!component) return null;
        const group = chart.getViewOfComponentModel(component).group;
        const rect = group.getBoundingRect().clone();
        rect.applyTransform(group.getComputedTransform());
        return rect;
      };
      const titleBox = bounds(title), toolsBox = bounds(toolbox);
      // A centered title can collide with a right-anchored toolbar even when
      // their combined widths fit. Compare their actual horizontal extents.
      const overlap = titleBox && toolsBox && titleBox.x < toolsBox.x + toolsBox.width + 8 &&
        toolsBox.x < titleBox.x + titleBox.width + 8;
      const top = overlap ? Math.max(source.toolbox.top, titleBox.y + titleBox.height + 8) : source.toolbox.top;
      update.toolbox = {top};
      update.grid.top = Math.max(source.grid.top, top + (toolsBox?.height || 14) + 12);
    }
    chart.setOption(update);
    if (below) {
      const legend = chart.getModel().getComponent('legend');
      const height = chart.getViewOfComponentModel(legend).group.getBoundingRect().height;
      chart.setOption({grid: {bottom: source.grid.bottom + height + 12}});
    }
    const grid = chart.getModel().getComponent('grid').coordinateSystem.getRect();
    chart.setOption({xAxis: {
      splitNumber: source.xAxis.splitNumber ?? Math.max(2, Math.min(5, Math.floor(grid.width / 80))),
      axisLabel: {hideOverlap: true, ...source.xAxis.axisLabel}
    }});
  }
  // Fit default vertical Sankey labels to each native node width. Explicit
  // label positions/widths remain caller-owned. SankeyNodeItemOption and native
  // dx/dy geometry: chart/sankey/SankeySeries.ts and SankeyView.ts.
  function fitSankey(echarts, chart, payload) {
    const sources = Array.isArray(payload.option.series) ? payload.option.series : [payload.option.series];
    const updates = sources.map((source, index) => {
      if (source?.type !== 'sankey' || source.orient !== 'vertical' ||
          source.label?.position != null || source.label?.width != null) return {};
      const series = chart.getModel().getSeriesByIndex(index), data = series.getData();
      const fontSize = series.getModel('label').get('fontSize') || 12;
      const fontFamily = series.getModel('label').get('fontFamily') || 'sans-serif';
      const targets = new Set(source.links.map(edge => edge.target));
      const origins = new Set(source.links.map(edge => edge.source));
      let top = 0, bottom = 0;
      const nodes = source.data.map((node, i) => {
        if (node.label?.position != null || node.label?.width != null) return node;
        const width = Math.max(1, data.getItemLayout(i).dx - 4);
        const position = origins.has(node.name) ? 'top' : 'bottom';
        const label = {...node.label, position, width, overflow:'break', lineHeight:fontSize + 2};
        const height = new echarts.graphic.Text({style:{text:node.name, fontSize, fontFamily,
          width, overflow:'break', lineHeight:fontSize + 2}}).getBoundingRect().height + 12;
        if (!targets.has(node.name)) top = Math.max(top, height);
        if (!origins.has(node.name)) bottom = Math.max(bottom, height);
        return {...node, label};
      });
      const px = value => typeof value === 'string' && value.endsWith('%') ? parseFloat(value) * chart.getHeight() / 100 : Number(value) || 0;
      return {data:nodes, top:Math.max(px(source.top), top), bottom:Math.max(px(source.bottom), bottom)};
    });
    if (updates.some(update => update.data)) chart.setOption({series:updates});
  }
  return {background, cells, fit, fitAxes, fitHeatmap, prepareLabels, prepareColors, positionLegend, centerVisualMaps, fitGantt, fitSankey};
});
