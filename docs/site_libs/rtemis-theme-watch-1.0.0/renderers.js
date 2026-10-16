// Shared custom-series renderers for browser widgets and Node SVG export.
// renderItem names and itemPayload remain plain JSON in the compiled option.
// See CustomSeriesOption / CustomSeriesRenderItemParams in ECharts
// src/chart/custom/CustomSeries.ts and name lookup in CustomView.ts.
(function (root, register) {
  if (typeof module === "object" && module.exports) {
    module.exports = register;
  } else {
    register(root.echarts);
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function (echarts) {
  "use strict";

  // Match native boxplot dodging, including active-series legend filtering.
  // The full distribution width stays independent of a narrow inset box.
  function boxPoint(settings, api, boxIndex, category, value, jitter) {
    const active = api.currentSeriesIndices();
    const boxes = settings.boxSeries.filter(function (i) { return active.includes(i); });
    const index = boxes.indexOf(boxIndex);
    if (index < 0) return null;
    const horizontal = settings.horizontal;
    const dim = horizontal ? 1 : 0;
    const point = api.coord(horizontal ? [value, category] : [category, value]);
    const band = Math.abs(api.size(horizontal ? [0, 1] : [1, 0])[dim]);
    const available = band * 0.8 - 2;
    const gap = available / boxes.length * 0.3;
    const width = (available - gap * (boxes.length - 1)) / boxes.length;
    const offset = width / 2 - available / 2 + index * (gap + width);
    const visibleWidth = Math.min(Math.max(width, 7), 50);
    point[dim] += offset + jitter * visibleWidth;
    return { point: point, width: visibleWidth };
  }

  const renderers = {
    "rtemis.rug.v1": function(params, api) {
      const point=api.coord([api.value(0),api.value(1)]), box=params.coordSys;
      const style={stroke:api.visual("color"), opacity:.5, lineWidth:1};
      return {type:"group",children:[
        {type:"line",shape:{x1:point[0],x2:point[0],y1:box.y+box.height,y2:box.y+box.height-6},style},
        {type:"line",shape:{x1:box.x,x2:box.x+6,y1:point[1],y2:point[1]},style}
      ]};
    },
    "rtemis.ribbon.v1": function(params, api) {
      return { type: "polygon", shape: {points:params.itemPayload.vertices.map(p=>api.coord(p))},
        style: {fill:api.visual("color"), opacity:params.itemPayload.opacity} };
    },
    // Materialized labels preserve real time spacing and remain vector text.
    "rtemis.axis_labels.v1": function (params, api) {
      const point = api.coord([api.value(0), 0]);
      const box = params.coordSys;
      if (point[0] < box.x - 1 || point[0] > box.x + box.width + 1) return;
      return { type: "text", style: { x: point[0], y: box.y + box.height + 10,
        text: String(api.value(1)), align: "center", verticalAlign: "top",
        fill: "#888888", font: api.font({ fontSize: 12 }) } };
    },
    // Data: [lower edge, upper edge, normalized height, raw count]. Numeric
    // coordinates retain unequal bin widths and align optional density lines.
    "rtemis.histogram.v1": function (params, api) {
      const settings=params.itemPayload, height=api.value(2);
      let lo=api.value(0), hi=api.value(1), base=0;
      if(settings.mode && settings.mode!=="overlay") {
        const active=api.currentSeriesIndices();
        const indices=settings.seriesIndices.filter(i=>active.includes(i));
        const position=indices.indexOf(params.seriesIndex);
        if(position<0) return;
        if(settings.mode==="group") {
          const span=(hi-lo)/indices.length;
          lo+=position*span;hi=lo+span;
        } else {
          for(const index of indices.slice(0,position)) {
            const value=settings.heights[settings.seriesIndices.indexOf(index)][params.dataIndex];
            if((height>=0 && value>=0)||(height<0 && value<0)) base+=value;
          }
        }
      }
      const left = api.coord([lo, base+height]);
      const right = api.coord([hi, base]);
      return { type: "rect", shape: {
        x: Math.min(left[0], right[0]), y: Math.min(left[1], right[1]),
        width: Math.abs(right[0] - left[0]), height: Math.abs(right[1] - left[1])
      }, style: { fill: api.visual("color"), opacity: params.itemPayload.fillAlpha } };
    },
    // Data: [category, exact value, observation ID, deterministic offset].
    "rtemis.boxplot_points.v1": function (params, api) {
      const settings = params.itemPayload;
      const layout = boxPoint(settings, api, settings.boxIndex, api.value(0), api.value(1), api.value(3));
      if (!layout) return;
      return {
        type: "circle",
        shape: { cx: layout.point[0], cy: layout.point[1], r: settings.pointSize / 2 },
        style: { fill: api.visual("color"), opacity: settings.pointAlpha },
      };
    },

    // Profiles are precomputed Gaussian density positions and relative widths.
    // A one-position profile is a constant sample, rendered as a crossbar.
    "rtemis.violin.v1": function (params, api) {
      const settings = params.itemPayload;
      const profile = settings.profiles[params.dataIndex];
      if (!profile || !profile.position) return;
      const dim = settings.horizontal ? 1 : 0;
      const left = [], right = [];
      for (let i = 0; i < profile.position.length; i++) {
        const layout = boxPoint(settings, api, settings.boxIndex, api.value(0), profile.position[i], 0);
        if (!layout) return;
        const a = layout.point.slice(), b = layout.point.slice();
        a[dim] -= profile.width[i] * layout.width / 2;
        b[dim] += profile.width[i] * layout.width / 2;
        left.push(a); right.push(b);
      }
      return {
        type: left.length === 1 ? "polyline" : "polygon",
        shape: { points: left.concat(right.reverse()) },
        style: { fill: left.length === 1 ? null : api.visual("color"),
          fillOpacity: settings.fillAlpha, stroke: api.visual("color"), lineWidth: 1 },
      };
    },

    // Data: [from category, value, offset, to category, value, offset, ID].
    "rtemis.boxplot_pairs.v1": function (params, api) {
      const settings = params.itemPayload;
      const from = boxPoint(settings, api, settings.boxIndex, api.value(0), api.value(1), api.value(2));
      const to = boxPoint(settings, api, settings.boxIndex, api.value(3), api.value(4), api.value(5));
      if (!from || !to) return;
      return { type: "polyline", shape: { points: [from.point, to.point] },
        style: { fill: null, stroke: api.visual("color"), opacity: settings.alpha, lineWidth: settings.width } };
    },

    // Data: [from category, to category, value position, from/to series, label].
    "rtemis.boxplot_brackets.v1": function (params, api) {
      const settings = params.itemPayload;
      const from = boxPoint(settings, api, api.value(3), api.value(0), api.value(2), 0);
      const to = boxPoint(settings, api, api.value(4), api.value(1), api.value(2), 0);
      if (!from || !to) return;
      const a = from.point, b = to.point;
      const endA = a.slice(), endB = b.slice();
      const dim = settings.horizontal ? 0 : 1;
      endA[dim] += settings.horizontal ? -6 : 6;
      endB[dim] += settings.horizontal ? -6 : 6;
      const center = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
      center[dim] += settings.horizontal ? 5 : -5;
      return { type: "group", children: [
        { type: "polyline", shape: { points: [endA, a, b, endB] },
          style: { fill: null, stroke: "#888888", lineWidth: 1 } },
        { type: "text", rotation: settings.horizontal ? -Math.PI / 2 : 0,
          originX: center[0], originY: center[1],
          style: { x: center[0], y: center[1], text: String(api.value(5)),
          fill: "#888888", font: api.font({ fontSize: 12 }),
          align: "center", verticalAlign: "bottom" } },
      ] };
    },

    // Data: [row, start, end, optional border flag]. Colors are resolved by
    // ECharts so series legends and per-datum styling use the same visual.
    "rtemis.gantt.v1": function (params, api) {
      const settings = params.itemPayload;
      const row = api.value(0);
      const start = api.coord([api.value(1), row]);
      const end = api.coord([api.value(2), row]);
      const height = api.size([0, 1])[1] * settings.barHeight;
      const style = { fill: api.visual("color") };
      if (api.value(3)) {
        style.stroke = settings.borderColor;
        style.lineWidth = settings.borderWidth;
      }
      return {
        type: "rect",
        transition: ["shape"],
        shape: {
          x: start[0], y: start[1] - height / 2,
          width: Math.max(1, end[0] - start[0]), height: height,
          r: settings.barRadius,
        },
        style: style,
      };
    },

    // Data: [left position, right position, left height, right height,
    // merge height]. Each merge contributes one three-segment U shape.
    "rtemis.heatmap_tracks.v1": function(params, api) {
      const settings = params.itemPayload, index = api.value(0);
      const row = settings.orientation === "row", rect = params.coordSys;
      const center = api.coord(row ? [0, index] : [index, 0]);
      const size = api.size([1, 1]);
      return { type: "group", children: settings.colors[index].map(function(color, track) {
        return { type: "rect", shape: row
          ? { x: rect.x - 4 - (track + 1) * 12, y: center[1] - Math.abs(size[1])/2,
              width: 10, height: Math.abs(size[1]) }
          : { x: center[0] - Math.abs(size[0])/2,
              y: settings.top ? rect.y - 4 - (track + 1) * 12 : rect.y + rect.height + 4 + track * 12,
              width: Math.abs(size[0]), height: 10 }, style: { fill: color } };
      }) };
    },
    "rtemis.dendrogram.v1": function (params, api) {
      const settings = params.itemPayload;
      const lp = api.value(0), rp = api.value(1);
      const lh = api.value(2), rh = api.value(3), mh = api.value(4);
      const points = settings.orientation === "row"
        ? [[lh, lp], [mh, lp], [mh, rp], [rh, rp]]
        : [[lp, lh], [lp, mh], [rp, mh], [rp, rh]];
      return {
        type: "polyline",
        shape: { points: points.map(function (point) { return api.coord(point); }) },
        style: { stroke: settings.colors ? settings.colors[params.dataIndex] : settings.color, lineWidth: 1, fill: null },
      };
    },
  };

  Object.keys(renderers).forEach(function (name) {
    echarts.registerCustomSeries(name, renderers[name]);
  });
  return Object.keys(renderers);
});
