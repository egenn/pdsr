# Base Graphics {#basegraphics}



<STYLE type='text/css' scoped>
PRE.fansi SPAN {padding-top: .25em; padding-bottom: .25em};
</STYLE>

R has powerful graphical capabilities built in to the core language. This chapter is an introduction to what is known as base graphics which is provided by the **graphics** builtin package. Their defaults produce minimalist plots, but they can be customized extensively. In this chapter we shall begin with default plots and demonstrate some of the more common/useful ways to customize them.

| Plot type     | Command                  |
|--------------:|:-------------------------|
| Scatterplot   | `plot(x, y)`             |
| Line plot     | `plot(x, y, type = 'l')` |
| Histogram     | `hist(x)`                |
| Density plot  | `plot(density(x))`       |
| Barplot       | `barplot(x)`             |
| Boxplot       | `boxplot(x)`             |
| Heatmap       | `heatmap(x)`             |

R documentation for each of the above commands provides extensive coverage of graphical parameters. `?par` gives the main documentation file for a long list of graphical parameters. These can be set either with the `par()` command ahed before using any plotting command 

Let's create some synthetic data:


```r
set.seed(2020)
x <- rnorm(300)
y_true <- 12 + x^3
y <- 12 + x^3 + 2.5 * rnorm(300)*1.5
```

## Scatter plot

Input: 2 **numeric vectors**

A 2D scatterplot displays of two numeric vectors as X and Y coordinates.


```r
plot(x, y)
```

<img src="79-BaseGraphics_files/figure-html/unnamed-chunk-4-1.png" width="480" />

### `**col**`: point color

See [Colors in R](#colors) to learn about the different ways to define colors in R.

Some common ways include:

- By name using one of 657 names given by `colors()`, e.g. "red", "magenta", "blue", "navy", "cyan"
- By RGB code


```r
plot(x, y, col = "slateblue")
```

<img src="79-BaseGraphics_files/figure-html/unnamed-chunk-5-1.png" width="480" />

### `**bty**`: box type

There are 7 bty options: "o" "l", "7", "c", "u", or "]" and "none".
They produce a box that resembles the corresponding symbol.
"none" draws no box but allows the axes to show:


```r
plot(x, y, bty = "l")
```

<img src="79-BaseGraphics_files/figure-html/unnamed-chunk-6-1.png" width="480" />


```r
plot(x, y, bty = "none")
```

<img src="79-BaseGraphics_files/figure-html/unnamed-chunk-7-1.png" width="480" />


### `**pch**`: point character

The default point character is a circle as seen above. This helps visualize overlapping points (especially for devices that do not support transparency).  

There are 25 point characters, designated by integers 1 through 25.

Here's a preview of all 25 `pch` options.
`pch` types 21 through 25 can be filled by a color specified by `bg`.


```r
plot(1:25, rep(1, 25), pch = 1:25, bg = "blue")
```

<img src="79-BaseGraphics_files/figure-html/unnamed-chunk-8-1.png" width="480" />

Let's use a solid disc:


```r
plot(x, y, bty = "n", pch = 16)
```

<img src="79-BaseGraphics_files/figure-html/unnamed-chunk-9-1.png" width="480" />

We cannot tell how many points are overlapping in the middle and therefore it's a good idea to make the points a little transparent.

There are different ways to add transparency (see [Colors](#colors)). The easiest way is probably to use `adjustcolor()`. In the context of colors, `alpha` refers to transparency: `a = 1` is opaque and `a = 0` is completely transparent (therefore use a value greater than 0).


```r
plot(x, y,
     bty = "n", pch = 16,
     col = adjustcolor("slateblue", alpha.f = .5))
```

<img src="79-BaseGraphics_files/figure-html/unnamed-chunk-10-1.png" width="480" />

### grid

We can add a grid behind the plot area using the `panel.first`, which accepts a graphical expression (a function that draws something), which is evaluated before plotting the points on the graph (therefore appears behind the points as required).


```r
plot(x, y,
     bty = "n", pch = 16,
     col = adjustcolor("slateblue", alpha.f = .5),
     panel.first = grid(lty = 1, col = 'gray90'))
```

<img src="79-BaseGraphics_files/figure-html/unnamed-chunk-11-1.png" width="480" />

### `**main**`, `**xlab**`, `**ylab**`: Title and axes labels


```r
plot(x, y,
     bty = "n", pch = 16,
     col = adjustcolor("slateblue", alpha.f = .5),
     panel.first = grid(lty = 1, col = 'gray90'),
     main = "y vs. x",
     xlab = "This is variable x (xunits)",
     ylab = "This is variable y (yunits)")
```

<img src="79-BaseGraphics_files/figure-html/unnamed-chunk-12-1.png" width="480" />

Note that depending on where you intend to display the plot, you may leave the title blank and instead place it in the figure caption along with an explanation of the data (e.g. in a journal article)

## Histogram

Input: **numeric vector**

A histogram displays an approximation of the distribution of a numeric vector. First the data is binned and then the number of elements that falls in each bin is counted. The histogram plot draws bars ofr each bin whose heights corresponds to the count of elements in the corresponding interval.


```r
hist(x)
```

<img src="79-BaseGraphics_files/figure-html/unnamed-chunk-13-1.png" width="480" />

### `**col**`: bar color


```r
hist(x, col = "slategrey")
```

<img src="79-BaseGraphics_files/figure-html/unnamed-chunk-14-1.png" width="480" />

### `**border**`: border color

Setting border color to the same as the background gives a clean look:


```r
hist(x, col = "slategrey", border = "white")
```

<img src="79-BaseGraphics_files/figure-html/unnamed-chunk-15-1.png" width="480" />

### `breaks`: number and/or value of breakpoints

The `breaks` argument can be used to define the breakpoints to use for the binning of the values of the input to `hist()`. See the documentation in `?hist` for the full range of options. An easy way to control the number of bins is to pass an integer to the `breaks` argument. Depending on the length of x and its distribution, it may or may not be possible to use the exact number requested, but the closest possible number will be automatically chosen.


```r
hist(x, col = "slategrey", border = "white",
     breaks = 8)
```

<img src="79-BaseGraphics_files/figure-html/unnamed-chunk-16-1.png" width="480" />

## Density plot

Input: numeric vector

A density plot is a different way to display an approximation of the distribution of a numeric vector. The `density()` function estimates the density of x and can be passed to `plot()` directly:


```r
plot(density(x))
```

<img src="79-BaseGraphics_files/figure-html/unnamed-chunk-17-1.png" width="480" />
You can use `main = NA` or `main = ""` to suppress printing a title.


```r
plot(density(x), col = "blue",
     bty = "n",
     main = NA)
```

<img src="79-BaseGraphics_files/figure-html/unnamed-chunk-18-1.png" width="480" />

## Barplot

Input: **vector** or **matrix**

Let's look at the VADeaths built-in dataset which describes death rater per 1000 population per year broken down by age range and population group.

### Single vector

We can plot a single column or row. Note how R automatically gets the corresponding dimension names:


```r
barplot(VADeaths[, 1])
```

<img src="79-BaseGraphics_files/figure-html/unnamed-chunk-19-1.png" width="480" />


```r
barplot(VADeaths[1, ])
```

<img src="79-BaseGraphics_files/figure-html/unnamed-chunk-20-1.png" width="480" />

#### `**col**` and `**border**`: bar fill and border color

As in most plotting functions, color is controlled by the `**col**` argument. `**border**` can be set to any color separately, or to `NA` to omit, which gives a clean look:


```r
barplot(VADeaths[, 1],
        col = "aquamarine3", border = NA)
```

<img src="79-BaseGraphics_files/figure-html/unnamed-chunk-21-1.png" width="480" />

### Matrix

We can draw barplots of multiple columns at the same time by passing a matrix input. The grouping on the x-axis is based on the columns. By default, data from different rows is stacked. The argument `legend.text` can be used to add a legend with the row labels:


```r
barplot(VADeaths, legend.text = TRUE)
```

<img src="79-BaseGraphics_files/figure-html/unnamed-chunk-22-1.png" width="480" />
Alternatively, we can draw groups of bars beside each other with the argument `beside = TRUE`:


```r
barplot(VADeaths, beside = TRUE,
        legend.text = TRUE, args.legend = list(x = "topright"))
```

<img src="79-BaseGraphics_files/figure-html/unnamed-chunk-23-1.png" width="672" />

To use custom colors, we pass a vector of length equal to the number of bars within each group. These will get recycled across groups, giving a consistent color coding.  
Here, we use the `adjustcolor()` function again to produce 5 shades of navy.


```r
col <- sapply(seq(.2, .8, length.out = 5), function(i) adjustcolor("navy", i))
barplot(VADeaths,
        col = col,
        border = NA,
        beside = TRUE,
        legend.text = TRUE, args.legend = list(x = "topright"))
```

<img src="79-BaseGraphics_files/figure-html/unnamed-chunk-24-1.png" width="672" />

## Boxplot

Input: One or more **vectors** of any length

A boxplot is another way to visualize the distribution of one or more vectors. Each vector does not need to be of the same length. For example if you are plotting lab results of a patient and control group, they do not have to contain the same number of individuals.

There are two ways to use the `boxplot()` function. Either pass two separate vectors of data (whet)

`boxplot()` makes it easy to plot your data from different objects. It can accept:

- individual vectors
- columns of a matrix, columns/elements of a data.frame, elements of a list
- formula interface of the form `variable ~ factor`


### Single vector


```r
a <- rnorm(500, mean = 12, sd = 2)
boxplot(a)
```

<img src="79-BaseGraphics_files/figure-html/unnamed-chunk-25-1.png" width="480" />

### Anatomy of a boxplot

A boxplot shows: 

- the median
- first and third quartiles
- outliers (defines as `x < Q1 - 1.5 * IQR | x > Q3 + 1.5 * IQR`)
- range after excluding outliers























