# Introduction {#introduction}



<STYLE type='text/css' scoped>
PRE.fansi SPAN {padding-top: .25em; padding-bottom: .25em};
</STYLE>

Throughout this book you will see boxes with R code followed by its output, if any. The code (or input) is decorated with a teal border on the left to separate it from its output, like in the following example:


```r
x <- rnorm(200)
x[1:20]
```

```
 [1] -0.13906780 -1.64420314 -0.48452659 -0.71603328 -1.15571102  0.72398398
 [7]  0.30011492  0.80836850 -1.12984315 -0.32822436  0.99793257  1.17067472
[13] -2.04040837 -0.26386836 -0.79917908 -0.16000738  0.12311188 -0.98353748
[19]  0.06112871 -1.66684105
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

Lastly, you will see the following informational boxes at times:

<div class="rmdnote">
<p>Note</p>
</div>

<div class="rmdtip">
<p>Tip</p>
</div>

<div class="rmdimportant">
<p>Important</p>
</div>

<div class="rmdwarning">
<p>Warning</p>
</div>

<div class="rmdcaution">
<p>Caution</p>
</div>

This book was created using [bookdown](https://CRAN.R-project.org/package=bookdown) [@R-bookdown]
<br/>  
