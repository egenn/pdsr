# Base Graphics {#basegraphics}



<STYLE type='text/css' scoped>
PRE.fansi SPAN {padding-top: .25em; padding-bottom: .25em};
</STYLE>

R has powerful graphical capabilities built in to the core language. This chapter is an introduction to what is known as base graphics which is provided by the **graphics** built-in package. Their defaults produce minimalist plots, but they can be customized extensively. In this chapter we shall begin with default plots and demonstrate some of the more common/useful ways to customize them.

| Plot type     | Command                  |
|--------------:|:-------------------------|
| Scatterplot   | `plot(x, y)`             |
| Line plot     | `plot(x, y, type = 'l')` |
| Histogram     | `hist(x)`                |
| Density plot  | `plot(density(x))`       |
| Barplot       | `barplot(x)`             |
| Boxplot       | `boxplot(x)`             |
| Heatmap       | `heatmap(x)`             |

R documentation for each of the above commands provides extensive coverage of graphical parameters. `?par` gives the main documentation file for a long list of graphical parameters. These can be set either with the `par()` command before using any plotting command. 

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

### **`col`**: point color

See [Colors in R](#colors) to learn about the different ways to define colors in R.

Some common ways include:

- By name using one of 657 names given by `colors()`, e.g. "red", "magenta", "blue", "navy", "cyan"
- By RGB code


```r
plot(x, y, col = "slateblue")
```

<img src="79-BaseGraphics_files/figure-html/unnamed-chunk-5-1.png" width="480" />

### **`bty`**: box type

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


### **`pch`**: point character

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

We can add a grid behind the plot area using the `panel.first` argument, which accepts a graphical expression (a function that draws something), which will be evaluated before plotting the points on the graph (therefore appears behind the points).


```r
plot(x, y,
     bty = "n", pch = 16,
     col = adjustcolor("slateblue", alpha.f = .5),
     panel.first = grid(lty = 1, col = 'gray90'))
```

<img src="79-BaseGraphics_files/figure-html/unnamed-chunk-11-1.png" width="480" />

### **`main`**, **`xlab`**, **`ylab`**: Title and axes labels


```r
plot(x, y,
     bty = "n", pch = 16,
     col = adjustcolor("slateblue", alpha.f = .5),
     panel.first = grid(lty = 1, col = 'gray90'),
     main = "y vs. x",
     xlab = "Variable x (xunits)",
     ylab = "Variable y (yunits)")
```

<img src="79-BaseGraphics_files/figure-html/unnamed-chunk-12-1.png" width="480" />

Note that depending on where you intend to display the plot, you may leave the title blank and instead place it in the figure caption along with an explanation of the data (e.g. in a journal article)

## Histogram

Input: **numeric vector**

A histogram displays an approximation of the distribution of a numeric vector. First the data is binned and then the number of elements that falls in each bin is counted. The histogram plot draws bars for each bin whose heights corresponds to the count of elements in the corresponding interval.


```r
hist(x)
```

<img src="79-BaseGraphics_files/figure-html/unnamed-chunk-13-1.png" width="480" />

### **`col`**: bar color


```r
hist(x, col = "slategrey")
```

<img src="79-BaseGraphics_files/figure-html/unnamed-chunk-14-1.png" width="480" />

### **`border`**: border color

Setting border color to the same as the background gives a clean look:


```r
hist(x, col = "slategrey", border = "white")
```

<img src="79-BaseGraphics_files/figure-html/unnamed-chunk-15-1.png" width="480" />

### `breaks`: number or value of breakpoints

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

#### **`col`** and **`border`**: bar fill and border color

As in most plotting functions, color is controlled by the **`col`** argument. **`border`** can be set to any color separately, or to `NA` to omit, which gives a clean look:


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

### Formula interface

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
- outliers (defined as `x < Q1 - 1.5 * IQR | x > Q3 + 1.5 * IQR`)
- range after excluding outliers

<div class="figure">
<img src="79-BaseGraphics_files/figure-html/boxanat-1.png" alt="Boxplot anatomy" width="480" />
<p class="caption">(\#fig:boxanat)Boxplot anatomy</p>
</div>

Some synthetic data:


```r
alpha <- rnorm(10)
beta <- rnorm(100)
gamma <- rnorm(200, 1, 2)
dl <- list(alpha = alpha, beta = beta, gamma = gamma)
```

### Multiple vectors


```r
boxplot(alpha, beta, gamma)
```

<img src="79-BaseGraphics_files/figure-html/unnamed-chunk-27-1.png" width="480" />

### List


```r
boxplot(dl)
```

<img src="79-BaseGraphics_files/figure-html/unnamed-chunk-28-1.png" width="480" />

### Matrix

Passing a matrix to `boxplot()` draws one boxplot per column:


```r
mat <- sapply(seq(5), function(i) rnorm(20))
boxplot(mat)
```

<img src="79-BaseGraphics_files/figure-html/unnamed-chunk-29-1.png" width="480" />

### Formula interface

The formula interface can be used to group any vector by a factor of the same length.

Let's use the built-in `sleep` dataset which shows the effect of two different drugs in increasing hours of sleep compared to a control group.


```r
boxplot(extra ~ group, sleep)
```

<img src="79-BaseGraphics_files/figure-html/unnamed-chunk-30-1.png" width="480" />

The **`col`** and **`border`** arguments work as expected. Here we define two custom colors using their hexadecimal RGB code and use the solid version for the border and a 50% transparent version for the fill. Note that we do not need two separate colors to produce an unambiguous plot since they are clearly labeled in the y-axis. It is often considered desirable/preferred to use the minimum number of different colors that is necessary. (Color coding like the following could be useful if for example data from the two groups were used on a different plot, like a scatterplot, in a multi-panel figure).


```r
border <- c("#18A3AC", "#F48024")
col <- c(adjustcolor("#18A3AC", .5), adjustcolor("#F48024", .5))
boxplot(extra ~ group, sleep,
        col = col, border = border)
```

<img src="79-BaseGraphics_files/figure-html/unnamed-chunk-31-1.png" width="480" />

### **`names`**: group labels

The x-axis group names can be defined with the `names` argument:


```r
boxplot(extra ~ group, sleep,
        col = col, border = border,
        names = c("Drug A", "Drug B"))
```

<img src="79-BaseGraphics_files/figure-html/unnamed-chunk-32-1.png" width="480" />

## Heatmap

Input: **matrix**

A heatmap is a 2D matrix-like plot with x- and y-axis labels and a value in each cell. It can be used to display many different types of data. A common usage in data science is to plot the correlation matrix of a set of numerical features. In many cases, the rows and/or columns of a heatmap can be reordered based on hierarchical clustering.


```r
x <- sapply(1:20, function(i) rnorm(20))
x_cor <- cor(x)
```

By default, the `heatmap()` function draws marginal dendrograms and rearranges rows and columns. We can prevent that by setting `Rowv` and `Colv` to `NA`:


```r
heatmap(x_cor, Rowv = NA, Colv = NA)
```

<img src="79-BaseGraphics_files/figure-html/unnamed-chunk-34-1.png" width="480" />

To allow clustering and row and column reordering, use the defaults:


```r
heatmap(x_cor)
```

<img src="79-BaseGraphics_files/figure-html/unnamed-chunk-35-1.png" width="480" />

## Graphical parameters

The `par` function allows setting or querying graphical parameters of the base graphics system. Have a look at its documentation (`?par`).  
Some graphical parameters can only be set with a call to `par` prior to using a base plotting function. However, many parameters can also be passed using the `...` construct of each base plotting function.  

Some common base graphical parameters:  

* *pch*: Point character
* *col*: Color
* *cex*: Character expansion, i.e. relative size
* *bty*: Box type
* *xlab*: x-axis label
* *ylab*: y-axis label
* *main*: Main title

Always make sure that your plotting characters, axis labels and titles are legible. You must avoid, at all costs, ever using a huge graph with tiny letters spread over an entire slide in a presentation.  

* *cex*: Character expansion for the plotting characters
* *cex.axis*: cex for axis annotation
* *cex.lab*: cex for x and y labels
* *cex.main*: cex for main title

Note: All of these can be set either with a call to `par()` prior to plotting or passed as arguments in a plotting command, like `plot()`.  

There is one important distinction: `cex` set with `par()` (which defaults to 1), sets the baseline and all other `cex` parameters multiply it. However, `cex` set within `plot()` still multiplies `cex` set with `par()`, but only affects the plotting character size.

## Multipanel plots

There are different ways to create multipanel plots, but probably the most straightforward is to use either the `mfrow` or the `mfcol` argument of `par()`.


```r
set.seed(2020)
x <- rnorm(500)
y <- x^3 + rnorm(500) * 2
z <- x^2 + rnorm(500)
```

Both `mfrow` and `mfcol` accept an integer vector of length 2 indicating number of rows and number of columns, respectively. With `mfrow`, the plots are drawn row-wise and with `mfcol` they are drawn column-wise. Remember to reset `mfrow` or `mfcol` back to `c(1, 1)`

For example, let's plot a 2-by-3 panel of plots, drawn row-wise:


```r
par(mfrow = c(2, 3))
hist(x)
hist(y)
hist(z)
plot(x, y)
plot(x, z)
plot(y, z)
```

<img src="79-BaseGraphics_files/figure-html/unnamed-chunk-37-1.png" width="672" />

```r
par(mfrow = c(1, 1))
```
