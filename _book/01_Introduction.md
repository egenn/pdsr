# Introduction



<STYLE type='text/css' scoped>
PRE.fansi SPAN {padding-top: .25em; padding-bottom: .25em};
</STYLE>

Throughout this book you will see boxes with R code followed by its output, if any. The code (or input) is decorated with a teal border on the left to separate it from its output, like in the following example:


```r
x <- rnorm(200)
x[1:20]
```

```
 [1]  1.36733704  1.36923924 -1.80234101  1.39115214 -0.55392449 -0.88017063
 [7]  0.40075800  0.01844506  0.40376335  1.10458735  0.82321280 -1.25445959
[13]  0.96665185  0.92676550 -2.62644808  1.83369051 -0.01109560 -0.95149158
[19] -0.23366163  0.53709415
```

Notice that R adds numbers in brackets in the beginning of each row. This happens when R prints the contents of a vector. The number is the integer index of the first element in that row. Therefore, the first one is always `[1]` and the number of the subsequent rows depends on how many elements fit in each line. If the output is a single element, it will still have `[1]` in front of it.  

Also notice that if we enclose the assignment operation of a variable in parentheses, this prints the resulting value of the variable. Therefore, this:


```r
(y <- 4)
```

```
[1] 4
```

is equivalent to:


```r
y <- 4
y
```

```
[1] 4
```

Note that if you mouse over the input code box, a clickable "Copy to clipboard" appears on the top right of the box allowing you to copy paste into an R session or file.

Lastly, you will see the following Info, Note, or Warning boxes at times:

\begin{info}
This is some info
\end{info}

\begin{note}
This is a note
\end{note}

\begin{warning}
This is a warning
\end{warning}

This book was created using [bookdown](https://CRAN.R-project.org/package=bookdown) [@R-bookdown]
<br/>  
