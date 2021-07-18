# Preface {#preface}



<STYLE type='text/css' scoped>
PRE.fansi SPAN {padding-top: .25em; padding-bottom: .25em};
</STYLE>

Throughout this book you will see boxes with R code followed by its output, if any. The code (or input) is decorated with a teal border on the left to separate it from its output, like in the following example:


```r
x <- rnorm(200)
x[1:20]
```

```
 [1]  0.73978772  0.09416414  0.24307269 -0.86621246 -1.53587779 -0.90071742
 [7] -0.42088062  0.96870100 -0.30259308 -0.57730205 -0.62772927 -0.75827799
[13]  0.90572488  0.29325163  1.23578310 -0.21677657  1.24685269  1.33748852
[19] -0.10274750 -0.57857678
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
