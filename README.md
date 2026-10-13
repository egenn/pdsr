# ![PDSR](src/assets/pdsr>.svg)

<img src="https://pdsr.rtemis.org/assets/pdsr_cover.avif" alt="PDSR" style="width:100%;filter: drop-shadow(0 0 .3rem #333);"/>
<br>
PDSR is aimed as an introductory- to intermediate-level R programming learning resource.  
It is the online companion to the in-person UCSF Biostat 213 & 214 courses, Programming for Health Data Science I & II.
<br><br>
E.D. Gennatas

[Laboratory of Computational Medicine](https://www.lambdamd.org/),
[UCSF](https://www.ucsf.edu/)


## Local development

Render with `just render` or preview with `just preview`. The book uses Quarto Live's
`live-html` format and knitr. Browser R cells use `{webr}`; chapters containing them
include `_extensions/r-wasm/live/_knitr.qmd` after their YAML header.

`just update-webr` updates the vendored official `r-wasm/quarto-live` extension.
`just sync-theme` refreshes the shared rtemis theme and regenerates the Live editor
syntax colors from the same palettes. PDSR-specific exercise styles live in
`theme/code.css` and `theme/webexercises.css`, outside the managed theme files.

R's `webexercises` package generates the MCQs; `include/webex.html` checks them in
the browser. Quarto Live runs and grades the R exercises, detects six-underscore
answer blanks, and reveals their solutions. Feedback icons are vendored Lucide SVGs.
