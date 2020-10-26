# 3x Graphics {#graphics3x}



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

```r
library(ggplot2)
library(plotly)
```

```

Attaching package: 'plotly'
```

```
The following object is masked from 'package:ggplot2':

    last_plot
```

```
The following object is masked from 'package:stats':

    filter
```

```
The following object is masked from 'package:graphics':

    layout
```

```r
library(mgcv)
```

```
Loading required package: nlme
```

```
This is mgcv 1.8-33. For overview type 'help("mgcv-package")'.
```

Visualization is central to statistics and data science. It is used to check data, explore data, and communicate results.

R has powerful graphical capabilities built in to the core language. It contains two largely separate graphics systems: 'base' graphics in the `graphics` package, inherited from the S language, and 'grid' graphics in the `grid` package: a "rewrite of the graphics layout capabilities". There is limited support for interaction between the two. In practice, for a given application, choose one or the other. There are no high level functions for the grid graphics system built into the base R distribution, but a few very popular packages have been built on top of it. Both graphics systems can produce beautiful, layered, high quality graphics. It is possible to build functions using either system to produce most, if not all, types of plots.  

## Base graphics

Common R plotting functions like `plot`, `barplot`, `boxplot`, `heatmap`, etc. are built ontop of base graphics [@murrell2018r]. Their default arguments provide a minimalist output, but can be tweaked extensively. An advantage of base graphics is they are very fast and relatively easy to extend.  

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

Always make sure that your plotting characters, axis labels and titles are legible. You must avoid, at all costs, ever using a huge graph with tiny letters spread over a whole slide in a presentation.  

* *cex*: Character expansion for the plotting characters
* *cex.axis*: cex for axis annotation
* *cex.lab*: cex for x and y labels
* *cex.main*: cex for main title

Note: All of these can be set either with a call to `pa()r` prior to plotting or passed as arguments in a plotting command, like `plot()`.  
However, there is one important distinction: `cex` set with `par()` (which defaults to 1), sets the baseline and all other `cex` parameters multiply it. However, `cex` set within `plot()` stil multiplies `cex` set with `par()`, but only affectts the plotting character size.

## Grid graphics

The two most popular packages built on top of the `grid` package are:  

* [lattice](https://cran.r-project.org/web/packages/lattice/lattice.pdf) 
* [ggplot2](https://ggplot2.tidyverse.org) [@wickham2011ggplot2]

### `ggplot2`

`ggplot2`, created by Hadley Wickham [@wickham2011ggplot2], follows the [Grammar of Graphics](https://www.springer.com/statistics/computational/book/978-0-387-24544-7) approach of Leland Wilkinson [@wilkinson2012grammar] and has a very different syntax than base functions.  
The general idea is to start by defining the data and then add and/or modify graphical elements in a stepwise manner, which allows one to build complex and layered visualizations. A simplified interface to `ggplot` graphics is provided in the `qplot` function of `ggplot2` (but you should avoid it and use learn to use the `ggplot` command which is fun and much more flexible and useful to know)

## 3rd party APIs

There are also third party libraries with R APIs that provide even more modern graphic capabilities to the R user:  

* [plotly](https://plot.ly) [@sievert2017plotly]
* [rbokeh](https://hafen.github.io/rbokeh/index.html)

Both build interactive plots, which can be viewed in a web browser or exported to bitmap graphics, and both also follow the grammar of graphics paradigm, and therefore follow similar syntax to `ggplot2`.

The [**rtemis**](https://rtemis.lambdamd.org) package [@gennatas2017towards] provides visualization functions built on top of base graphics (for speed and extendability) and **plotly** (for interactivity):  

* [mplot3](https://rtemis.lambdamd.org/staticgraphics.html) static graphics (base)
* [dplot3](https://rtemis.lambdamd.org/interactivegraphics.html) interactive graphics (plotly)

Let's go over the most common plot types using base graphics, mplot3, dplot3, and ggplot.  
You should be familiar with the basic functionality of both base graphics and ggplot as they are extensively used.

## Scatterplot

### base

A default base graphics plot is rather minimalist:


```r
plot(iris$Sepal.Length, iris$Petal.Length)
```

![](80-3xGraphics_files/figure-latex/unnamed-chunk-4-1.pdf)<!-- --> 

By tweaking a few parameters, we get a perhaps prettier result:


```r
plot(iris$Sepal.Length, iris$Petal.Length,
     pch = 16,
     col = "#18A3AC66",
     cex = 1.4,
     bty = "n",
     xlab = "Sepal Length", ylab = "Petal Length")
```

![](80-3xGraphics_files/figure-latex/unnamed-chunk-5-1.pdf)<!-- --> 

### **mplot3**


```r
mplot3.xy(iris$Sepal.Length, iris$Petal.Length)
```

![](80-3xGraphics_files/figure-latex/unnamed-chunk-6-1.pdf)<!-- --> 

[`dplot3()`](https://rtemis.lambdamd.org/interactivegraphics.html) provides similar functionality to `mplot3()`, built on top of **plotly**. Notice how you can interact with the plot using the mouse:

### **dplot3**


```r
dplot3.xy(iris$Sepal.Length, iris$Petal.Length)
```

![](80-3xGraphics_files/figure-latex/unnamed-chunk-7-1.pdf)<!-- --> 

### **ggplot2**

Note: The name of the package is `ggplot2`, the name of the function is `ggplot`.


```r
ggplot(iris, aes(Sepal.Length, Petal.Length)) + geom_point()
```

![](80-3xGraphics_files/figure-latex/unnamed-chunk-8-1.pdf)<!-- --> 

### **plotly**


```r
p <- plot_ly(iris, x = ~Sepal.Length, y = ~Petal.Length) %>% 
  add_trace(type = "scatter", mode = "markers")
p
```

![](80-3xGraphics_files/figure-latex/unnamed-chunk-9-1.pdf)<!-- --> 

### Grouped

In `mplot3()` and `dplot3()`, add a `group` argument:


```r
mplot3.xy(iris$Sepal.Length, iris$Petal.Length,
          group = iris$Species)
```

![](80-3xGraphics_files/figure-latex/unnamed-chunk-10-1.pdf)<!-- --> 


```r
dplot3.xy(iris$Sepal.Length, iris$Petal.Length,
          group = iris$Species)
```

![](80-3xGraphics_files/figure-latex/unnamed-chunk-11-1.pdf)<!-- --> 

In **ggplot2**, specify `color` within `aes`.  
`ggplot` plots can be assigned to an object. Print the object to view it.


```r
p <- ggplot(iris, aes(Sepal.Length, Petal.Length, color = Species)) +
  geom_point()
p
```

![](80-3xGraphics_files/figure-latex/unnamed-chunk-12-1.pdf)<!-- --> 

In **plotly** define the `color` argument:


```r
p <- plot_ly(iris, x = ~Sepal.Length, y = ~Petal.Length, color = ~Species) %>% 
  add_trace(type = "scatter", mode = "markers")
p
```

![](80-3xGraphics_files/figure-latex/unnamed-chunk-13-1.pdf)<!-- --> 

## Scatterplot with fit

### **mplot3**

In `mplot3.xy()`, define the algorithm to use to fit a curve, with `fit`. `se.fit` allows plotting the standard error bar (if it can be provided by the algorithm in `fit`)


```r
mplot3.xy(iris$Sepal.Length, iris$Petal.Length,
          fit = "gam", se.fit = T)
```

![](80-3xGraphics_files/figure-latex/unnamed-chunk-14-1.pdf)<!-- --> 

Passing a `group` argument, automatically fits separate models:


```r
mplot3.xy(iris$Sepal.Length, iris$Petal.Length,
          fit = "gam", se.fit = T,
          group = iris$Species)
```

![](80-3xGraphics_files/figure-latex/unnamed-chunk-15-1.pdf)<!-- --> 

### **dplot3**

Same syntax as `mplot3.xy()` above:


```r
dplot3.xy(iris$Sepal.Length, iris$Petal.Length,
          fit = "gam", se.fit = T)
```

![](80-3xGraphics_files/figure-latex/unnamed-chunk-16-1.pdf)<!-- --> 


```r
dplot3.xy(iris$Sepal.Length, iris$Petal.Length,
          fit = "gam", se.fit = T,
          group = iris$Species)
```

![](80-3xGraphics_files/figure-latex/unnamed-chunk-17-1.pdf)<!-- --> 

### **ggplot2**

In `ggplot()`, add a `geom_smooth`:


```r
ggplot(iris, aes(x = Sepal.Length, y = Petal.Length)) +
  geom_point() +
  geom_smooth(method = 'gam')
```

```
`geom_smooth()` using formula 'y ~ s(x, bs = "cs")'
```

![](80-3xGraphics_files/figure-latex/unnamed-chunk-18-1.pdf)<!-- --> 

To group, again, use `color`:


```r
ggplot(iris, aes(x = Sepal.Length, y = Petal.Length, color = Species)) +
  geom_point() +
  geom_smooth(method = 'gam')
```

```
`geom_smooth()` using formula 'y ~ s(x, bs = "cs")'
```

![](80-3xGraphics_files/figure-latex/unnamed-chunk-19-1.pdf)<!-- --> 

### **plotly**

In `plot_ly()`, `add_lines()`:


```r
library(mgcv)
mod.gam <- gam(Petal.Length ~ s(Sepal.Length), data = iris)
plot_ly(iris, x = ~Sepal.Length) %>%
  add_trace(y = ~Petal.Length, type = "scatter", mode = "markers") %>% 
  add_lines(y = mod.gam$fitted.values)
```

![](80-3xGraphics_files/figure-latex/unnamed-chunk-20-1.pdf)<!-- --> 

To get fit by group, you add all elements one after the other - one way would be this:


```r
iris.bySpecies <- split(iris, iris$Species)
gam.fitted <- lapply(iris.bySpecies, function(i) {
  gam(Petal.Length ~ s(Sepal.Length), data = i)$fitted
})
index <- lapply(iris.bySpecies, function(i) order(i$Sepal.Length))
col <- c("#44A6AC", "#F4A362", "#3574A7")
.names <- names(iris.bySpecies)
p <- plot_ly()
for (i in seq_along(iris.bySpecies)) {
  p <- add_trace(p, x = ~Sepal.Length, y = ~Petal.Length, 
                 type = "scatter", mode = "markers",
                 data = iris.bySpecies[[i]],
                 name = .names[i],
                 color = col[i])
}
for (i in seq_along(iris.bySpecies)) {
  p <- add_lines(p, x = iris.bySpecies[[i]]$Sepal.Length[index[[i]]],
                 y = gam.fitted[[i]][index[[i]]], 
                 # type = "scatter", mode = "markers",
                 data = iris.bySpecies[[i]],
                 name = paste(.names[i], "GAM fit"),
                 color = col[i])
}
p
```

![](80-3xGraphics_files/figure-latex/unnamed-chunk-21-1.pdf)<!-- --> 

It's a lot of work, and that's why `dplot3()` exists.

## Density plot

There is no builtin density plot, but you can get x and y coordinates from the `density` function and add a polygon:

### base


```r
.density <- density(iris$Sepal.Length)
class(.density)
```

```
[1] "density"
```

```r
plot(.density$x, .density$y,
     type = "l", yaxs = "i")
```

![](80-3xGraphics_files/figure-latex/unnamed-chunk-22-1.pdf)<!-- --> 

```r
plot(.density$x, .density$y,
     type = 'l', yaxs = "i",
     bty = "n",
     xlab = "",  ylab = "Density",
     col = "#18A3AC66",
     main = "Sepal Length Density")
polygon(c(.density$x, rev(.density$x)), c(.density$y, rep(0, length(.density$y))),
        col = "#18A3AC66", border = NA)
```

![](80-3xGraphics_files/figure-latex/unnamed-chunk-22-2.pdf)<!-- --> 

### **mplot3**


```r
mplot3.x(iris$Sepal.Length, 'density')
```

![](80-3xGraphics_files/figure-latex/unnamed-chunk-23-1.pdf)<!-- --> 

### **dplot3**


```r
dplot3.x(iris$Sepal.Length)
```

![](80-3xGraphics_files/figure-latex/unnamed-chunk-24-1.pdf)<!-- --> 

### **ggplot2**


```r
ggplot(iris, aes(x = Sepal.Length)) + geom_density()
```

![](80-3xGraphics_files/figure-latex/unnamed-chunk-25-1.pdf)<!-- --> 

Add color:


```r
ggplot(iris, aes(x = Sepal.Length)) + geom_density(color = "#18A3AC66", fill = "#18A3AC66")
```

![](80-3xGraphics_files/figure-latex/unnamed-chunk-26-1.pdf)<!-- --> 

#### Grouped


```r
mplot3.x(iris$Sepal.Length, group = iris$Species)
```

![](80-3xGraphics_files/figure-latex/unnamed-chunk-27-1.pdf)<!-- --> 


```r
dplot3.x(iris$Sepal.Length, group = iris$Species)
```

![](80-3xGraphics_files/figure-latex/unnamed-chunk-28-1.pdf)<!-- --> 


```r
(ggplot(iris, aes(Sepal.Length, color = Species, fill = Species)) + 
  geom_density(alpha = .5) +
  scale_color_manual(values = c("#44A6AC", "#F4A362", "#3574A7")) +
  scale_fill_manual(values = c("#44A6AC", "#F4A362", "#3574A7")) +
  labs(x = "Sepal Length", y = "Density"))
```

![](80-3xGraphics_files/figure-latex/unnamed-chunk-29-1.pdf)<!-- --> 

## Histogram


```r
set.seed(2020)
a <- rnorm(500)
```

### base


```r
hist(a)
```

![](80-3xGraphics_files/figure-latex/unnamed-chunk-31-1.pdf)<!-- --> 

```r
hist(a, col = "#18A3AC66")
```

![](80-3xGraphics_files/figure-latex/unnamed-chunk-31-2.pdf)<!-- --> 

```r
hist(a, col = "#18A3AC99", border = "white", main = "", breaks = 30)
```

![](80-3xGraphics_files/figure-latex/unnamed-chunk-31-3.pdf)<!-- --> 

### **mplot3**


```r
mplot3.x(a, "histogram")
```

![](80-3xGraphics_files/figure-latex/unnamed-chunk-32-1.pdf)<!-- --> 

```r
mplot3.x(a, "histogram", hist.breaks = 30)
```

![](80-3xGraphics_files/figure-latex/unnamed-chunk-32-2.pdf)<!-- --> 

### **dplot3**


```r
dplot3.x(a, "hist")
```

![](80-3xGraphics_files/figure-latex/unnamed-chunk-33-1.pdf)<!-- --> 

```r
dplot3.x(a, "hist", hist.n.bins = 40)
```

![](80-3xGraphics_files/figure-latex/unnamed-chunk-33-2.pdf)<!-- --> 

### **ggplot2**


```r
(p <- ggplot(mapping = aes(a)) + geom_histogram())
```

```
`stat_bin()` using `bins = 30`. Pick better value with `binwidth`.
```

![](80-3xGraphics_files/figure-latex/unnamed-chunk-34-1.pdf)<!-- --> 

```r
(p <- ggplot(mapping = aes(a)) + geom_histogram(binwidth = .2))
```

![](80-3xGraphics_files/figure-latex/unnamed-chunk-34-2.pdf)<!-- --> 

```r
(p <- ggplot(mapping = aes(a)) +
    geom_histogram(binwidth = .2, fill = "#18A3AC99"))
```

![](80-3xGraphics_files/figure-latex/unnamed-chunk-34-3.pdf)<!-- --> 

#### Grouped


```r
mplot3.x(iris$Petal.Length, 'h', group = iris$Species, hist.breaks = 10)
```

![](80-3xGraphics_files/figure-latex/unnamed-chunk-35-1.pdf)<!-- --> 


```r
dplot3.x(iris$Sepal.Length, 'h', group = iris$Species)
```

![](80-3xGraphics_files/figure-latex/unnamed-chunk-36-1.pdf)<!-- --> 


```r
ggplot(iris, aes(x = Sepal.Length, fill = Species)) + 
  geom_histogram(binwidth = .1)
```

![](80-3xGraphics_files/figure-latex/unnamed-chunk-37-1.pdf)<!-- --> 

### Barplot


```r
schools <- data.frame(UCSF = 4, Stanford = 7, Penn = 12)
```

### base


```r
barplot(as.matrix(schools))
```

![](80-3xGraphics_files/figure-latex/unnamed-chunk-39-1.pdf)<!-- --> 

```r
barplot(as.matrix(schools), col = "dodgerblue3")
```

![](80-3xGraphics_files/figure-latex/unnamed-chunk-39-2.pdf)<!-- --> 

### **mplot3**


```r
mplot3.bar(schools)
```

![](80-3xGraphics_files/figure-latex/unnamed-chunk-40-1.pdf)<!-- --> 

### **dplot3**


```r
dplot3.bar(schools)
```

![](80-3xGraphics_files/figure-latex/unnamed-chunk-41-1.pdf)<!-- --> 

### **ggplot2**

`ggplot` requires an explicit column in the data that define the categorical x-axis:

```r
schools.df <- data.frame(University = colnames(schools),
                         N_schools = as.numeric(schools[1, ]))
ggplot(schools.df, aes(University, N_schools)) +
  geom_bar(stat = "identity", color = "#18A3AC", fill = "#18A3AC")
```

![](80-3xGraphics_files/figure-latex/unnamed-chunk-42-1.pdf)<!-- --> 

## Box plot


```r
x <- rnormmat(200, 4, return.df = TRUE, seed = 2019)
colnames(x) <- c("mango", "banana", "tangerine", "sugar")
```

### base


```r
boxplot(x)
```

![](80-3xGraphics_files/figure-latex/unnamed-chunk-44-1.pdf)<!-- --> 


```r
boxplot(x, col = "steelblue4")
```

![](80-3xGraphics_files/figure-latex/unnamed-chunk-45-1.pdf)<!-- --> 

### **mplot3**


```r
mplot3.box(x)
```

![](80-3xGraphics_files/figure-latex/unnamed-chunk-46-1.pdf)<!-- --> 

### **dplot3**


```r
dplot3.box(x)
```

![](80-3xGraphics_files/figure-latex/unnamed-chunk-47-1.pdf)<!-- --> 

### **ggplot2**

Again, ggplot requires an explicit categorical x-axis, which is this case means a conversion from wide to long dataset:


```r
library(tidyr)
(x.long <- pivot_longer(x, 1:4, names_to = "Fruit", values_to = "Feature"))
```

<PRE class="fansi fansi-output"><CODE><span style='color: #555555;'># A tibble: 800 x 2</span><span>
   Fruit     Feature
   </span><span style='color: #555555;font-style: italic;'>&lt;chr&gt;</span><span>       </span><span style='color: #555555;font-style: italic;'>&lt;dbl&gt;</span><span>
</span><span style='color: #555555;'> 1</span><span> mango      0.739 
</span><span style='color: #555555;'> 2</span><span> banana     0.721 
</span><span style='color: #555555;'> 3</span><span> tangerine -</span><span style='color: #BB0000;'>1.26</span><span>  
</span><span style='color: #555555;'> 4</span><span> sugar     -</span><span style='color: #BB0000;'>0.018</span><span style='color: #BB0000;text-decoration: underline;'>7</span><span>
</span><span style='color: #555555;'> 5</span><span> mango     -</span><span style='color: #BB0000;'>0.515</span><span> 
</span><span style='color: #555555;'> 6</span><span> banana    -</span><span style='color: #BB0000;'>0.395</span><span> 
</span><span style='color: #555555;'> 7</span><span> tangerine  0.258 
</span><span style='color: #555555;'> 8</span><span> sugar     -</span><span style='color: #BB0000;'>0.030</span><span style='color: #BB0000;text-decoration: underline;'>1</span><span>
</span><span style='color: #555555;'> 9</span><span> mango     -</span><span style='color: #BB0000;'>1.64</span><span>  
</span><span style='color: #555555;'>10</span><span> banana     0.983 
</span><span style='color: #555555;'># ... with 790 more rows</span><span>
</span></CODE></PRE>

```r
(p <- ggplot(x.long, aes(Fruit, Feature)) + geom_boxplot())
```

![](80-3xGraphics_files/figure-latex/unnamed-chunk-48-1.pdf)<!-- --> 

Add some color:


```r
(p <- ggplot(x.long, aes(Fruit, Feature)) +
   geom_boxplot(fill = c("#44A6AC66", "#F4A36266", "#3574A766", "#C23A7066"),
                colour = c("#44A6ACFF", "#F4A362FF", "#3574A7FF", "#C23A70FF")))
```

![](80-3xGraphics_files/figure-latex/unnamed-chunk-49-1.pdf)<!-- --> 

## Heatmap

Let's create some synthetic correlation data:


```r
x <- rnormmat(20, 20, seed = 2020)
x.cor <- cor(x)
```

### base

R has a great builtin heatmap function, which supports hierarchical clustering and plots the dendrogram in the margins by default:


```r
heatmap(x.cor)
```

![](80-3xGraphics_files/figure-latex/unnamed-chunk-51-1.pdf)<!-- --> 

It may be a little surprising that clustering is on by default. To disable row and column dendrograms, set `Rowv` and `Colv` to `NA`:


```r
heatmap(x.cor, Rowv = NA, Colv = NA)
```

![](80-3xGraphics_files/figure-latex/unnamed-chunk-52-1.pdf)<!-- --> 

### **mplot3**

mplot3 adds a colorbar to the side of the heatmap. Notice there are 10 circles above and 10 circles below zero to represent 10% increments.

```r
mplot3.heatmap(x.cor)
```

![](80-3xGraphics_files/figure-latex/unnamed-chunk-53-1.pdf)<!-- --> 


### **dplot3**


```r
dplot3.heatmap(x.cor)
```

![](80-3xGraphics_files/figure-latex/unnamed-chunk-54-1.pdf)<!-- --> 

### **ggplot2**

ggplot does not have a builtin heatmap function per se, but you can use `geom_tile` to build one. It also needs a data frame input in long form once again:


```r
x.cor.dat <- as.data.frame(x.cor)
colnames(x.cor.dat) <- rownames(x.cor.dat) <- paste0("V", seq(20))
colnames(x.cor) <- rownames(x.cor) <- paste0("V", seq(20))
x.cor.long <- data.frame(NodeA = rownames(x.cor)[row(x.cor)],
                         NodeB = colnames(x.cor)[col(x.cor)],
                         Weight = c(x.cor))
(p <- ggplot(x.cor.long, aes(NodeA, NodeB, fill = Weight)) +
    geom_tile() + coord_equal())
```

![](80-3xGraphics_files/figure-latex/unnamed-chunk-55-1.pdf)<!-- --> 

## Saving plots to file

### base

You can save base graphics to disk using a number of different file formats. To do this, you have to:  

* Open a graphic device - e.g. `pdf("path/to/xy_scatter.pdf")`
* Write to it - e.g. `plot(x, y)`
* Close graphic device - `dev.off()`

The following commands are used to open graphical devices that will save to a file of the corresponding type:  

* `bmp(filename = "path/to/file", width = [in pixels], height = [in pixels])`
* `jpeg(filename = "path/to/file", width = [in pixels], height = [in pixels])`
* `png(filename = "path/to/file", width = [in pixels], height = [in pixels])`
* `tiff(filename = "path/to/file", width = [in pixels], height = [in pixels])`
* `svg(filename = "path/to/file", width = [in INCHES], height = [in INCHES]`
* `pdf(file = "path/to/file", width = [in INCHES], height = [in INCHES])`

Notice that when writing to a vector graphics format (svg and pdf), you defined width and height in inches, not pixels. Also, you specify `file` instead of `filename` in 
Notice the difference when writing to PDF: you define a `file` instead of a `filename`, and width and height are in INCHES, not pixels.  
It is recommended to save plots in PDF format because it handles vector graphics therefore plots will scale, and it is easy to export to other graphics formats later on if needed.


```r
pdf("~/Desktop/plot.pdf", width = 5, height = 5)
plot(iris$Sepal.Length, iris$Petal.Length,
     pch = 16,
     col = "#18A3AC66",
     cex = 1.8,
     bty = "n", # also try "l"
     xlab = "Sepal Length", ylab = "Petal Length")
dev.off()
```
