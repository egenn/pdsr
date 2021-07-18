# Colors in R {#colors}



<STYLE type='text/css' scoped>
PRE.fansi SPAN {padding-top: .25em; padding-bottom: .25em};
</STYLE>


```r
library(rtemis)
```

```
  .:rtemis 0.8.1: Welcome, egenn
  [x86_64-apple-darwin17.0 (64-bit): Defaulting to 4/4 available cores]
  Documentation & vignettes: https://rtemis.lambdamd.org
```

Colors in R can be defined in many different ways:  

* Using names: `colors()` gives all available options
* Using a [hexadecimal](https://en.wikipedia.org/wiki/Hexadecimal) [RGB](https://en.wikipedia.org/wiki/RGB_color_model) code in the form `#RRGGBBAA`, e.g. `#FF0000FF` for opaque red
* Using the `rgb(red, green, blue, alpha)` function (outputs a hex number)
* Using the `hsv(h, s, v, alpha)` function for the [HSV color system](https://en.wikipedia.org/wiki/HSL_and_HSV) (also outputs a hex number)
* Using integers: these index the output of `palette()`, whose defaults can be changed by the user (e.g. `palette("cyan", "blue", "magenta", "red")`)

## Color names

There is a long list of color names R understands, and can be listed using `colors()`.  
They can be passed directly as characters.  
Shades of gray are provided as `gray0`/`grey0` (white) to `gray100`/`grey100` (black).  
Absurdly wide PDFs with all built-in R colors, excluding the grays/greys, are available sorted [alphabeticaly](https://rtemis.netlify.com/RColors.pdf) and sorted by [increasing Red and decreasing Green and Blue values](https://rtemis.netlify.com/RColors_incRed_decBlueGreen.pdf)

## Hexadecimal codes

Hexadecimal color codes are characters starting with the pound sign, followed by 4 pairs of hex codes representing Red, Green, Blue, and Alpha values. Since RGB values go from 0 to 255, hex goes from 00 to FF. You can convert decimal to hex using `as.hexmode`:


```r
as.hexmode(0)
```

```
[1] "0"
```

```r
as.hexmode(127)
```

```
[1] "7f"
```

```r
as.hexmode(255)
```

```
[1] "ff"
```

The last two values for the alpha setting are optional: if not included, defaults to max (opaque)

## RGB


```r
rgb(0, 0, 1)
```

```
[1] "#0000FF"
```

Note the default `maxColorValue = 1`, set to 255 to use the usual RGB range of 0 to 255:


```r
rgb(0, 0, 255, maxColorValue = 255)
```

```
[1] "#0000FF"
```

## HSV

Color can also be parameterized using the hue, saturation, and value system ([HSV](https://en.wikipedia.org/wiki/HSL_and_HSV)). Each range from 0 to 1.  
Simplistically: Hue controls the color. Saturation 1 is max color and 0 is white. Value 1 is max color and 0 is black.


```r
hsv(1, 1, 1)
```

```
[1] "#FF0000"
```

In the following plot, the values around the polar plot represent hue. Moving inwards to the center, saturation changes from 1 to 0.


```r
mplot.hsv()
```

<img src="81-Colors_files/figure-html/unnamed-chunk-8-1.png" width="480" />

```r
mplot.hsv(v = .5)
```

<img src="81-Colors_files/figure-html/unnamed-chunk-8-2.png" width="480" />
