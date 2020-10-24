# Preface {-}



<STYLE type='text/css' scoped>
PRE.fansi SPAN {padding-top: .25em; padding-bottom: .25em};
</STYLE>

Throughout this book you will see boxes with R code followed by its output, if any. The code (or input) is decorated with a teal border on the left to separate it from its output, like in the following example:


```r
x <- rnorm(200)
x[1:20]
```

```
 [1]  0.64498967  1.23894510 -2.18147246 -1.53761348 -1.53525116 -0.32262701
 [7]  1.14464990  0.57522349  0.61303041 -0.61649758  0.41128072 -0.69787207
[13] -0.02459984  1.36688414 -0.56696146  0.17337763 -0.45843159 -0.74921847
[19]  0.47032865  0.45535550
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
