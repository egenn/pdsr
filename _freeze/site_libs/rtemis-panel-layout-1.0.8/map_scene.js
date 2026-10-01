// Portable choropleth colors, administrative key normalization, and joins.
// Shared by the MapLibre widget and the offline SVG renderer.
(function(root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory;
  else root.RtemisMapScene = factory(root.RtemisMap);
})(typeof globalThis !== "undefined" ? globalThis : this, function(deps) {
  const {chromatic, topojsonFeature} = deps;
  const MISSING_LIGHT = "#e4e4e7", MISSING_DARK = "#3f3f46";
    // ── Color scale (port of choroplethScale.ts) ────────────────────────────
    const sequentialScheme = (name) => {
      const map = {
        blues: "interpolateBlues",
        viridis: "interpolateViridis",
        ylorrd: "interpolateYlOrRd",
        greens: "interpolateGreens",
        magma: "interpolateMagma",
      };
      return map[name] ? chromatic[map[name]] : null;
    };
    const divergingScheme = (name) => {
      const map = {
        rdbu: "interpolateRdBu",
        rdylgn: "interpolateRdYlGn",
        spectral: "interpolateSpectral",
        brbg: "interpolateBrBG",
      };
      return map[name] ? chromatic[map[name]] : null;
    };

    // Sample n colors from an interpolator, biasing brighter in dark mode.
    const rampColors = (interp, n, dark, diverging) => {
      if (n <= 1) return [interp(0.5)];
      const t0 = diverging ? 0 : dark ? 0.3 : 0.12;
      const t1 = diverging ? 1 : dark ? 1 : 0.95;
      return Array.from({ length: n }, (_, i) =>
        interp(t0 + ((t1 - t0) * i) / (n - 1)),
      );
    };

    const quantileBreaks = (sorted, classes) => {
      const breaks = [];
      for (let i = 1; i < classes; i++) {
        const q = (sorted.length - 1) * (i / classes);
        const lo = Math.floor(q);
        const hi = Math.ceil(q);
        breaks.push(sorted[lo] + (sorted[hi] - sorted[lo]) * (q - lo));
      }
      return breaks;
    };

    const equalBreaks = (min, max, classes) => {
      const breaks = [];
      const step = (max - min) / classes;
      for (let i = 1; i < classes; i++) breaks.push(min + step * i);
      return breaks;
    };

    // Jenks natural breaks (Fisher-Jenks DP), capped by sampling for large n.
    const jenksBreaks = (values, classes) => {
      let data = values;
      const CAP = 1500;
      if (data.length > CAP) {
        const step = data.length / CAP;
        data = Array.from(
          { length: CAP },
          (_, i) => values[Math.floor(i * step)],
        );
      }
      const n = data.length;
      if (n <= classes) return quantileBreaks(values, classes);

      const mat1 = Array.from({ length: n + 1 }, () =>
        new Array(classes + 1).fill(0),
      );
      const mat2 = Array.from({ length: n + 1 }, () =>
        new Array(classes + 1).fill(0),
      );
      for (let j = 1; j <= classes; j++) {
        mat1[1][j] = 1;
        mat2[1][j] = 0;
        for (let i = 2; i <= n; i++) mat2[i][j] = Number.POSITIVE_INFINITY;
      }
      for (let l = 2; l <= n; l++) {
        let s1 = 0;
        let s2 = 0;
        let w = 0;
        for (let m = 1; m <= l; m++) {
          const i3 = l - m + 1;
          const val = data[i3 - 1];
          w++;
          s1 += val;
          s2 += val * val;
          const variance = s2 - (s1 * s1) / w;
          const i4 = i3 - 1;
          if (i4 !== 0) {
            for (let j = 2; j <= classes; j++) {
              if (mat2[l][j] >= variance + mat2[i4][j - 1]) {
                mat1[l][j] = i3;
                mat2[l][j] = variance + mat2[i4][j - 1];
              }
            }
          }
        }
        mat1[l][1] = 1;
        mat2[l][1] = s2 - (s1 * s1) / w;
      }

      const breaks = [];
      let k = n;
      for (let j = classes; j >= 2; j--) {
        const id = mat1[k][j] - 1;
        breaks.push(data[id]);
        k = mat1[k][j] - 1;
      }
      return breaks.reverse();
    };

    const fmt = (v) =>
      Math.abs(v) >= 100 || Number.isInteger(v)
        ? Math.round(v).toLocaleString()
        : v.toFixed(1);

    const buildScale = (rawValues, opts) => {
      const missingColor = opts.dark ? MISSING_DARK : MISSING_LIGHT;
      const diverging = divergingScheme(opts.scheme) !== null;
      const interp =
        sequentialScheme(opts.scheme) ||
        divergingScheme(opts.scheme) ||
        chromatic.interpolateBlues;

      const finite = rawValues.filter(
        (v) => typeof v === "number" && Number.isFinite(v),
      );
      const classes = Math.max(2, Math.min(12, Math.round(opts.classes)));
      const colors = rampColors(interp, classes, opts.dark, diverging);

      if (finite.length === 0) {
        return {
          classes,
          thresholds: [],
          colors,
          missingColor,
          min: 0,
          max: 0,
          legend: [],
        };
      }

      const sorted = [...finite].sort((a, b) => a - b);
      const min = sorted[0];
      const max = sorted[sorted.length - 1];

      let thresholds;
      if (min === max) {
        thresholds = [];
      } else if (opts.classification === "equal") {
        thresholds = equalBreaks(min, max, classes);
      } else if (opts.classification === "jenks") {
        thresholds = jenksBreaks(sorted, classes);
      } else {
        thresholds = quantileBreaks(sorted, classes);
      }
      thresholds = thresholds
        .filter((t, i, a) => i === 0 || t > a[i - 1])
        .filter((t) => t > min && t < max);

      const bounds = [min, ...thresholds, max];
      const legend = colors.slice(0, bounds.length - 1).map((color, i) => ({
        color,
        label: `${fmt(bounds[i])} – ${fmt(bounds[i + 1])}`,
      }));

      return {
        classes,
        thresholds,
        colors: colors.slice(0, thresholds.length + 1),
        missingColor,
        min,
        max,
        legend,
      };
    };

    // MapLibre fill-color expression: missing color when no joined value, else a
    // step over the classification thresholds.
    const fillColorExpression = (scale) => {
      const value = ["to-number", ["feature-state", "v"]];
      let matched;
      if (scale.thresholds.length === 0) {
        matched = scale.colors[0] || scale.missingColor;
      } else {
        const step = ["step", value, scale.colors[0]];
        scale.thresholds.forEach((t, i) => {
          step.push(t, scale.colors[i + 1]);
        });
        matched = step;
      }
      return [
        "case",
        ["!=", ["feature-state", "v"], null],
        matched,
        scale.missingColor,
      ];
    };

    // ── Location resolver (port of locationResolver.ts) ──────────────────────
    const STATE_ABBR_TO_FIPS = {
      AL: "01", AK: "02", AZ: "04", AR: "05", CA: "06", CO: "08", CT: "09",
      DE: "10", DC: "11", FL: "12", GA: "13", HI: "15", ID: "16", IL: "17",
      IN: "18", IA: "19", KS: "20", KY: "21", LA: "22", ME: "23", MD: "24",
      MA: "25", MI: "26", MN: "27", MS: "28", MO: "29", MT: "30", NE: "31",
      NV: "32", NH: "33", NJ: "34", NM: "35", NY: "36", NC: "37", ND: "38",
      OH: "39", OK: "40", OR: "41", PA: "42", RI: "44", SC: "45", SD: "46",
      TN: "47", TX: "48", UT: "49", VT: "50", VA: "51", WA: "53", WV: "54",
      WI: "55", WY: "56", PR: "72", VI: "78", GU: "66", AS: "60", MP: "69",
    };
    const STATE_NAME_TO_FIPS = {
      alabama: "01", alaska: "02", "american samoa": "60", arizona: "04",
      arkansas: "05", california: "06", colorado: "08",
      "commonwealth of the northern mariana islands": "69", connecticut: "09",
      delaware: "10", "district of columbia": "11", florida: "12",
      georgia: "13", guam: "66", hawaii: "15", idaho: "16", illinois: "17",
      indiana: "18", iowa: "19", kansas: "20", kentucky: "21", louisiana: "22",
      maine: "23", maryland: "24", massachusetts: "25", michigan: "26",
      minnesota: "27", mississippi: "28", missouri: "29", montana: "30",
      nebraska: "31", nevada: "32", "new hampshire": "33", "new jersey": "34",
      "new mexico": "35", "new york": "36", "north carolina": "37",
      "north dakota": "38", ohio: "39", oklahoma: "40", oregon: "41",
      pennsylvania: "42", "puerto rico": "72", "rhode island": "44",
      "south carolina": "45", "south dakota": "46", tennessee: "47",
      texas: "48", "united states virgin islands": "78", utah: "49",
      vermont: "50", virginia: "51", washington: "53", "west virginia": "54",
      wisconsin: "55", wyoming: "56",
    };
    const ISO2_TO_ISO3 = {
      AE: "ARE", AF: "AFG", AL: "ALB", AM: "ARM", AO: "AGO", AQ: "ATA",
      AR: "ARG", AT: "AUT", AU: "AUS", AZ: "AZE", BA: "BIH", BD: "BGD",
      BE: "BEL", BF: "BFA", BG: "BGR", BI: "BDI", BJ: "BEN", BN: "BRN",
      BO: "BOL", BR: "BRA", BS: "BHS", BT: "BTN", BW: "BWA", BY: "BLR",
      BZ: "BLZ", CA: "CAN", CD: "COD", CF: "CAF", CG: "COG", CH: "CHE",
      CI: "CIV", CL: "CHL", CM: "CMR", CN: "CHN", CO: "COL", CR: "CRI",
      CU: "CUB", CY: "CYP", CZ: "CZE", DE: "DEU", DJ: "DJI", DK: "DNK",
      DO: "DOM", DZ: "DZA", EC: "ECU", EE: "EST", EG: "EGY", EH: "ESH",
      ER: "ERI", ES: "ESP", ET: "ETH", FI: "FIN", FJ: "FJI", FK: "FLK",
      FR: "FRA", GA: "GAB", GB: "GBR", GE: "GEO", GH: "GHA", GL: "GRL",
      GM: "GMB", GN: "GIN", GQ: "GNQ", GR: "GRC", GT: "GTM", GW: "GNB",
      GY: "GUY", HN: "HND", HR: "HRV", HT: "HTI", HU: "HUN", ID: "IDN",
      IE: "IRL", IL: "ISR", IN: "IND", IQ: "IRQ", IR: "IRN", IS: "ISL",
      IT: "ITA", JM: "JAM", JO: "JOR", JP: "JPN", KE: "KEN", KG: "KGZ",
      KH: "KHM", KP: "PRK", KR: "KOR", KW: "KWT", KZ: "KAZ", LA: "LAO",
      LB: "LBN", LK: "LKA", LR: "LBR", LS: "LSO", LT: "LTU", LU: "LUX",
      LV: "LVA", LY: "LBY", MA: "MAR", MD: "MDA", ME: "MNE", MG: "MDG",
      MK: "MKD", ML: "MLI", MM: "MMR", MN: "MNG", MR: "MRT", MW: "MWI",
      MX: "MEX", MY: "MYS", MZ: "MOZ", NA: "NAM", NC: "NCL", NE: "NER",
      NG: "NGA", NI: "NIC", NL: "NLD", NO: "NOR", NP: "NPL", NZ: "NZL",
      OM: "OMN", PA: "PAN", PE: "PER", PG: "PNG", PH: "PHL", PK: "PAK",
      PL: "POL", PR: "PRI", PS: "PSE", PT: "PRT", PY: "PRY", QA: "QAT",
      RO: "ROU", RS: "SRB", RU: "RUS", RW: "RWA", SA: "SAU", SB: "SLB",
      SD: "SDN", SE: "SWE", SI: "SVN", SK: "SVK", SL: "SLE", SN: "SEN",
      SO: "SOM", SR: "SUR", SS: "SSD", SV: "SLV", SY: "SYR", SZ: "SWZ",
      TD: "TCD", TF: "ATF", TG: "TGO", TH: "THA", TJ: "TJK", TL: "TLS",
      TM: "TKM", TN: "TUN", TR: "TUR", TT: "TTO", TW: "TWN", TZ: "TZA",
      UA: "UKR", UG: "UGA", US: "USA", UY: "URY", UZ: "UZB", VE: "VEN",
      VN: "VNM", VU: "VUT", YE: "YEM", ZA: "ZAF", ZM: "ZMB", ZW: "ZWE",
    };

    const digits = (raw) => raw.replace(/[^0-9]/g, "");

    // Normalize one location value to the canonical TopoJSON join id.
    const normalizeKey = (raw, resolution) => {
      if (raw == null) return null;
      const s = String(raw).trim();
      if (!s) return null;

      if (resolution === "county") {
        const d = digits(s);
        if (!d || d.length > 5) return null;
        return d.padStart(5, "0");
      }
      if (resolution === "state") {
        const d = digits(s);
        if (d) return d.length <= 2 ? d.padStart(2, "0") : null;
        const up = s.toUpperCase();
        if (STATE_ABBR_TO_FIPS[up]) return STATE_ABBR_TO_FIPS[up];
        return STATE_NAME_TO_FIPS[s.toLowerCase()] || null;
      }
      // country
      const up = s.toUpperCase();
      if (up.length === 3) return up;
      if (up.length === 2) return ISO2_TO_ISO3[up] || null;
      return null;
    };


  function create(x, dark) {
    const model = x.model || {}, s = x.style || {}, geo = x.geo || {};
    const topo = JSON.parse(geo.topojson);
    if (!topo.objects[geo.object]) throw new Error("Map geometry object is missing.");
    const fc = topojsonFeature(topo, topo.objects[geo.object]);
    const ids = new Set();
    for (const f of fc.features) {
      const id = f.id == null ? "" : String(f.id);
      f.properties = {...f.properties, joinId: id};
      if (id) ids.add(id);
    }
    const rows = model.rows || [], values = new Map();
    const report = {matched: 0, unmatched: 0, unmatchedKeys: []};
    for (const row of rows) {
      const id = normalizeKey(row.location, model.resolution || "country");
      if (id && ids.has(id)) { values.set(id, row.value); report.matched++; }
      else { report.unmatched++; if (report.unmatchedKeys.length < 12) report.unmatchedKeys.push(row.location); }
    }
    const scale = buildScale(rows.map(r => r.value), {
      classification: s.classification || "quantile", scheme: s.colorScheme || "blues",
      classes: s.numClasses ?? 5, dark
    });
    return {fc, ids, values, report, scale};
  }
  function color(scale, value) {
    if (typeof value !== "number" || !Number.isFinite(value)) return scale.missingColor;
    let index = 0;
    while (index < scale.thresholds.length && value >= scale.thresholds[index]) index++;
    return scale.colors[index];
  }
  return {create, buildScale, normalizeKey, fillColorExpression, color};
});
