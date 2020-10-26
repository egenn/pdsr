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
 [1]  0.47645211 -0.69891619  1.19772948 -0.88601125 -1.96599745  1.52594939
 [7] -0.54704194 -1.43230093 -1.86177111  0.58646377 -0.18951479  0.12668333
[13] -1.24514478 -0.19629431 -0.65642230  0.57251499  0.07557951 -0.76134303
[19]  1.17646784  0.74133570
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

<div class="info">
<p>This is some info</p>
</div>

<div class="note">
<p>This is a note</p>
</div>

<div class="warning">
<p>This is a warning</p>
</div>

This book was created using [bookdown](https://CRAN.R-project.org/package=bookdown) [@R-bookdown]
<br/>  
