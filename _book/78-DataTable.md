# Efficient data analysis with __data.table__ {#datatable}



<STYLE type='text/css' scoped>
PRE.fansi SPAN {padding-top: .25em; padding-bottom: .25em};
</STYLE>

The [__data.table__](https://github.com/Rdatatable/data.table) package provides a modern and highly optimized version of R's data.frame structure. It is highly memory efficient and automatically parallelizes internal operations to achieve substantial speed improvements over data.frames. The `data.table` package weighs in at just a few kilobytes, has zero dependencies, and maintains compatibility with R versions going as far back as possible.  

There are two main ways in which `data.table` differs from `data.frame`:  

* You can perform many operations ***"in-place"*** without creating a copy (i.e. make changes to a `data.table` without having to assign it back to itself).
* There is a lot more than indexing and slicing that you can do within a `data.table`'s "frame" i.e. the square brackets after a `data.table`, like applying any custom function to specific columns and/or cases.


```r
library(rtemis)
```

```
  .:rtemis 0.8.0: Welcome, egenn
  [x86_64-apple-darwin17.0 (64-bit): Defaulting to 4/4 available cores]
  Documentation & vignettes: https://rtemis.lambdamd.org
```

```r
library(data.table)
```

```

Attaching package: 'data.table'
```

```
The following object is masked from 'package:rtemis':

    cube
```

Let's look at `data.table` vs. `data.frame` operations:

## Create a `data.table`

### By assignment: `data.table()`
Same syntax with `data.frame()`:


```r
(df <- data.frame(A = 1:5,
                  B = c(1.2, 4.3, 9.7, 5.6, 8.1),
                  C = c("a", "b", "b", "a", "a")))
```

```
  A   B C
1 1 1.2 a
2 2 4.3 b
3 3 9.7 b
4 4 5.6 a
5 5 8.1 a
```

```r
class(df)
```

```
[1] "data.frame"
```

```r
(dt <- data.table(A = 1:5,
                  B = c(1.2, 4.3, 9.7, 5.6, 8.1),
                  C = c("a", "b", "b", "a", "a")))
```

```
   A   B C
1: 1 1.2 a
2: 2 4.3 b
3: 3 9.7 b
4: 4 5.6 a
5: 5 8.1 a
```

```r
class(dt)
```

```
[1] "data.table" "data.frame"
```

Notice how `data.table` inherits from `data.frame`. This means that if a method does not exist for `data.table`, the method for `data.frame` will be used.  
One difference from `data.frame()` is that, as you can see above, is that `stringsAsFactors` defaults to FALSE in `data.table()`. Also, as part of efficiency improvements, data.tables do away with row names, which are rarely used. Instead of using rownames, you can always add an extra column with the same information - this is advisable when working with data.frame as well.


```r
(dt <- data.table(A = 1:5,
                  B = c(1.2, 4.3, 9.7, 5.6, 8.1),
                  C = c("a", "b", "b", "a", "a"),
                  stringsAsFactors = TRUE))
```

```
   A   B C
1: 1 1.2 a
2: 2 4.3 b
3: 3 9.7 b
4: 4 5.6 a
5: 5 8.1 a
```

### By coercion: `as.data.table()`


```r
dat <- data.frame(A = 1:5,
                  B = c(1.2, 4.3, 9.7, 5.6, 8.1),
                  C = c("a", "b", "b", "a", "a"))
(dat2 <- as.data.table(dat))
```

```
   A   B C
1: 1 1.2 a
2: 2 4.3 b
3: 3 9.7 b
4: 4 5.6 a
5: 5 8.1 a
```


### By coercion ***in-place***: `setDT()`

`setDT` converts a list or data.frame into a `data.table` in-place. Note: the original object itself is changed, you do not need to assign the output of `setDT` to a new name.


```r
dat <- data.frame(A = 1:5,
                  B = c(1.2, 4.3, 9.7, 5.6, 8.1),
                  C = c("a", "b", "b", "a", "a"))
class(dat)
```

```
[1] "data.frame"
```

```r
setDT(dat)
class(dat)
```

```
[1] "data.table" "data.frame"
```

You can similarly convert a `data.table` to a `data.frame`, in-place:


```r
setDF(dat)
class(dat)
```

```
[1] "data.frame"
```

### Read into `data.table` from file

__data.table__ includes the `fread()` function to read data from files, in a similar way as the base functions `read.csv()` and `read.table()`. It is orders of magnitude faster for very large data (e.g. thousands to millions of rows) and it can read directly from URLs, and zipped files. The `sep` arguments defines the separator (same as in `read.csv()` and `read.table()`), but when set to `"auto"` (the default) it does a great job of figuring it out by itself. 


```r
dat <- fread("path/to/file.csv")
dat <- fread("https::/url/to/file.csv.gz")
```

For its speed and convenience, `fread()` is recommended over `read.csv()`/`read.table()` even if you intend to work with a `data.frame` exclusively, in which case you can pass the argument `data.table = FALSE` to `fread()`

### Write a `data.table` to file: `fwrite()`


```r
fwrite(dt, "/path/to/file.csv")
```

## Combine `data.table`s

`cbind()` and `rbind()` work on `data.table`s the same as on `data.frame`s:


```r
dt1 <- data.table(a = 1:5)
dt2 <- data.table(b = 11:15)
cbind(dt1, dt2)
```

```
   a  b
1: 1 11
2: 2 12
3: 3 13
4: 4 14
5: 5 15
```

```r
rbind(dt1, dt1)
```

```
    a
 1: 1
 2: 2
 3: 3
 4: 4
 5: 5
 6: 1
 7: 2
 8: 3
 9: 4
10: 5
```

## `str` works the same (and you should keep using it!)


```r
str(df)
```

```
'data.frame':	5 obs. of  3 variables:
 $ A: int  1 2 3 4 5
 $ B: num  1.2 4.3 9.7 5.6 8.1
 $ C: chr  "a" "b" "b" "a" ...
```

```r
str(dt)
```

```
Classes 'data.table' and 'data.frame':	5 obs. of  3 variables:
 $ A: int  1 2 3 4 5
 $ B: num  1.2 4.3 9.7 5.6 8.1
 $ C: Factor w/ 2 levels "a","b": 1 2 2 1 1
 - attr(*, ".internal.selfref")=<externalptr> 
```

## Indexing a `data.table`

Indexing is largely unchanged, with a few notable exceptions.  
Integer indexing is mostly the same:


```r
df[1, ]
```

```
  A   B C
1 1 1.2 a
```

```r
dt[1, ]
```

```
   A   B C
1: 1 1.2 a
```

Selecting a single column with integer indexing in `data.table` does not drop to a vector (i.e. similar to `drop = FALSE` in a data.frame):


```r
df[, 1]
```

```
[1] 1 2 3 4 5
```

```r
df[, 1, drop = FALSE]
```

```
  A
1 1
2 2
3 3
4 4
5 5
```

```r
dt[, 1]
```

```
   A
1: 1
2: 2
3: 3
4: 4
5: 5
```

In `data.table`, you can access column names directly without quoting or using `$`:


```r
df[, "B"]
```

```
[1] 1.2 4.3 9.7 5.6 8.1
```

```r
df$B
```

```
[1] 1.2 4.3 9.7 5.6 8.1
```

```r
dt[, B]
```

```
[1] 1.2 4.3 9.7 5.6 8.1
```


```r
df[df$B > 5, ]
```

```
  A   B C
3 3 9.7 b
4 4 5.6 a
5 5 8.1 a
```

```r
with(df, df[B > 5, ])
```

```
  A   B C
3 3 9.7 b
4 4 5.6 a
5 5 8.1 a
```

```r
dt[B > 5, ]
```

```
   A   B C
1: 3 9.7 b
2: 4 5.6 a
3: 5 8.1 a
```

Think of working inside the `data.table` frame (i.e. the "[...]") like an environment. You have direct access to the variables within it.  
If you want to refer to variables outside the `data.table`, prefix the variable name with `..`. This is similar to how you access contents of a directory above your current directory in the terminal:


```r
varname = "C"
df[, varname]
```

```
[1] "a" "b" "b" "a" "a"
```

```r
dt[, ..varname]
```

```
   C
1: a
2: b
3: b
4: a
5: a
```

This tells the `data.table` "don't look for 'varname' in the data.table, go outside to find it"

### Conditionally select cases:

It is easy to select cases by combining conditions by using column names directly. Note that `data.table` does not require you to add ", " to select all columns after you have specified rows - works just the same if you so include it:

There are a few way to conditionally select in a data.frame:


```r
df[df$A > mean(df$A) & df$B > mean(df$B), ]
```

```
  A   B C
5 5 8.1 a
```

```r
subset(df, A > mean(A) & B > mean(B))
```

```
  A   B C
5 5 8.1 a
```

```r
with(df, df[A > mean(A) & B > mean(B), ])
```

```
  A   B C
5 5 8.1 a
```

The data.table equivalent is probably simplest:


```r
dt[A > mean(A) & B > mean(B)]
```

```
   A   B C
1: 5 8.1 a
```



```r
(a <- rnormmat(10, 5, seed = 2020, return.df = TRUE))
```

```
           V1          V2          V3          V4          V5
1   0.3769721 -0.85312282  2.17436525 -0.81250466  0.90850113
2   0.3015484  0.90925918  1.09818265 -0.74370217 -0.50505960
3  -1.0980232  1.19637296  0.31822032  1.09534507 -0.30100401
4  -1.1304059 -0.37158390 -0.07314756  2.43537371 -0.72603598
5  -2.7965343 -0.12326023  0.83426874  0.38811847 -1.18007703
6   0.7205735  1.80004312  0.19875064  0.29062767  0.25307471
7   0.9391210  1.70399588  1.29784138 -0.28559829 -0.37071130
8  -0.2293777 -3.03876461  0.93671831  0.07601472  0.02217956
9   1.7591313 -2.28897495 -0.14743319 -0.56029860  0.66004412
10  0.1173668  0.05830349  0.11043199  0.44718837  0.48879364
```

```r
a[1, 3] <- a[3, 4] <- a[5, 3] <- a[7, 3] <- NA
adt <- as.data.table(a)
```


```r
a[!is.na(a$V3), ]
```

```
           V1          V2          V3          V4          V5
2   0.3015484  0.90925918  1.09818265 -0.74370217 -0.50505960
3  -1.0980232  1.19637296  0.31822032          NA -0.30100401
4  -1.1304059 -0.37158390 -0.07314756  2.43537371 -0.72603598
6   0.7205735  1.80004312  0.19875064  0.29062767  0.25307471
8  -0.2293777 -3.03876461  0.93671831  0.07601472  0.02217956
9   1.7591313 -2.28897495 -0.14743319 -0.56029860  0.66004412
10  0.1173668  0.05830349  0.11043199  0.44718837  0.48879364
```

```r
adt[!is.na(V3)]
```

```
           V1          V2          V3          V4          V5
1:  0.3015484  0.90925918  1.09818265 -0.74370217 -0.50505960
2: -1.0980232  1.19637296  0.31822032          NA -0.30100401
3: -1.1304059 -0.37158390 -0.07314756  2.43537371 -0.72603598
4:  0.7205735  1.80004312  0.19875064  0.29062767  0.25307471
5: -0.2293777 -3.03876461  0.93671831  0.07601472  0.02217956
6:  1.7591313 -2.28897495 -0.14743319 -0.56029860  0.66004412
7:  0.1173668  0.05830349  0.11043199  0.44718837  0.48879364
```

### Select columns

by integer index, same as with a data.frame


```r
dt[, 2]
```

```
     B
1: 1.2
2: 4.3
3: 9.7
4: 5.6
5: 8.1
```

```r
dt[, 2:3]
```

```
     B C
1: 1.2 a
2: 4.3 b
3: 9.7 b
4: 5.6 a
5: 8.1 a
```

```r
dt[, c(1, 3)]
```

```
   A C
1: 1 a
2: 2 b
3: 3 b
4: 4 a
5: 5 a
```

by name: selecting a single column by name returns a vector:


```r
dt[, A]
```

```
[1] 1 2 3 4 5
```

by name: selecting one or more columns by name enclosed in `.()` which, in this case, is short for `list()`, return a `data.table`:


```r
dt[, .(A)]
```

```
   A
1: 1
2: 2
3: 3
4: 4
5: 5
```

```r
dt[, .(A, B)]
```

```
   A   B
1: 1 1.2
2: 2 4.3
3: 3 9.7
4: 4 5.6
5: 5 8.1
```

## Add new columns ***in-place***

Use `:=` assignment to add a new column in the existing `data.table`.
Once again, in-place means you do not have to assign the result to a variable, the existing `data.table` will be changed.


```r
dt[, AplusC := A + C]
```

```
Warning in Ops.factor(A, C): '+' not meaningful for factors
```

```r
dt
```

```
   A   B C AplusC
1: 1 1.2 a     NA
2: 2 4.3 b     NA
3: 3 9.7 b     NA
4: 4 5.6 a     NA
5: 5 8.1 a     NA
```

## Add multiple columns ***in-place***

To add multiple columns, use `:=` in a little more awkward notation:


```r
dt[, `:=`(AminusC = A - C, AoverC = A / C)]
```

```
Warning in Ops.factor(A, C): '-' not meaningful for factors
```

```
Warning in Ops.factor(A, C): '/' not meaningful for factors
```

```r
dt
```

```
   A   B C AplusC AminusC AoverC
1: 1 1.2 a     NA      NA     NA
2: 2 4.3 b     NA      NA     NA
3: 3 9.7 b     NA      NA     NA
4: 4 5.6 a     NA      NA     NA
5: 5 8.1 a     NA      NA     NA
```

## Convert column type
Use any base R coercion function (`as.*`) to convert a column in-place using the `:=` notation

```r
dt[, A := as.numeric(A)]
dt
```

```
   A   B C AplusC AminusC AoverC
1: 1 1.2 a     NA      NA     NA
2: 2 4.3 b     NA      NA     NA
3: 3 9.7 b     NA      NA     NA
4: 4 5.6 a     NA      NA     NA
5: 5 8.1 a     NA      NA     NA
```

## Delete column in-place

To delete a column, use `:=` to set it to NULL:


```r
dt[, AoverC := NULL]
dt
```

```
   A   B C AplusC AminusC
1: 1 1.2 a     NA      NA
2: 2 4.3 b     NA      NA
3: 3 9.7 b     NA      NA
4: 4 5.6 a     NA      NA
5: 5 8.1 a     NA      NA
```

Same awkward notation as earlier to delete multiple columns:


```r
dt[, `:=`(AplusC = NULL, AminusC = NULL)]
dt
```

```
   A   B C
1: 1 1.2 a
2: 2 4.3 b
3: 3 9.7 b
4: 4 5.6 a
5: 5 8.1 a
```

## Summarize

Create a *new* data.table using any summary function:


```r
Asummary <- dt[, .(Amax = max(A), Amin = min(A), Asd = sd(A))]
Asummary
```

```
   Amax Amin      Asd
1:    5    1 1.581139
```

### `address`: Object location in memory

When you add a new column to an existing data.frame, the data.frame is copied behind the scenes - you can tell becasue its memory address (where it's physically stored in your computer) changes:


```r
df1 <- data.frame(alpha = 1:5, beta = 11:15)
address(df1)
```

```
[1] "0x7fa3652795c8"
```

```r
df1$gamma <- df1$alpha + df1$beta
address(df1)
```

```
[1] "0x7fa3657152e8"
```

When you add a new column in a data.table ***in-place*** its address remains unchanged:


```r
dt1 <- data.table(alpha = 1:5, beta = 11:15)
address(dt1)
```

```
[1] "0x7fa365c70e00"
```

```r
dt1[, gamma := alpha + beta]
address(dt1)
```

```
[1] "0x7fa365c70e00"
```

### Reference semantics at work

Up to now, you are likely used to working with regular R objects that behave like this:


```r
(df1 <- data.frame(a = rep(1, 5)))
```

```
  a
1 1
2 1
3 1
4 1
5 1
```

```r
(df2 <- df1)
```

```
  a
1 1
2 1
3 1
4 1
5 1
```

```r
df2$a <- df2$a*2
df2
```

```
  a
1 2
2 2
3 2
4 2
5 2
```

```r
df1
```

```
  a
1 1
2 1
3 1
4 1
5 1
```

```r
address(df1)
```

```
[1] "0x7fa3669faa68"
```

```r
address(df2)
```

```
[1] "0x7fa366a34448"
```

`data.table` uses "reference semantics" or "pass-by-reference". Be very careful or you might be mightily confused:


```r
(dt1 <- data.table(a = rep(1, 5)))
```

```
   a
1: 1
2: 1
3: 1
4: 1
5: 1
```

```r
(dt2 <- dt1)
```

```
   a
1: 1
2: 1
3: 1
4: 1
5: 1
```

```r
dt2[, a := a * 2]
dt2
```

```
   a
1: 2
2: 2
3: 2
4: 2
5: 2
```

```r
dt1
```

```
   a
1: 2
2: 2
3: 2
4: 2
5: 2
```

```r
address(dt1)
```

```
[1] "0x7fa364294e00"
```

```r
address(dt2)
```

```
[1] "0x7fa364294e00"
```

\begin{note}
If you want to create a copy of a data.table, use \texttt{copy()}:
\end{note}


```r
(dt3 <- copy(dt1))
```

```
   a
1: 2
2: 2
3: 2
4: 2
5: 2
```

```r
address(dt3)
```

```
[1] "0x7fa3616f6400"
```

```r
dt3[, a := a * 2]
dt3
```

```
   a
1: 4
2: 4
3: 4
4: 4
5: 4
```

```r
dt1
```

```
   a
1: 2
2: 2
3: 2
4: 2
5: 2
```

## `set*()`: Set attributes ***in-place***

`data.table` includes a number of function that begin with `set*`, all of which change their input *by reference* and as such require no assignment.  
You may be surprised to find out that even an inocuous operation like changing the column names of a data.frame, requires a copy:


```r
address(df)
```

```
[1] "0x7fa3617992e8"
```

```r
colnames(df) <- c("A", "B", "Group")
address(df)
```

```
[1] "0x7fa3652707a8"
```

Use `setnames()` to edit a `data.table`'s column names ***in-place***:


```r
address(dt)
```

```
[1] "0x7fa363242a00"
```

```r
setnames(dt, old = 1:3, new = c("A", "B", "Group"))
address(dt)
```

```
[1] "0x7fa363242a00"
```

## `setorder()`: Set order of `data.table`

Since this is a `set*` function, it changes a `data.table` in-place. You can order by any number of columns, ascending or descending:  
Order by Group and then by A:


```r
setorder(dt, Group, A)
dt
```

```
   A   B Group
1: 1 1.2     a
2: 4 5.6     a
3: 5 8.1     a
4: 2 4.3     b
5: 3 9.7     b
```

Order by Group and then by decreasing B:


```r
setorder(dt, Group, -B)
dt
```

```
   A   B Group
1: 5 8.1     a
2: 4 5.6     a
3: 1 1.2     a
4: 3 9.7     b
5: 2 4.3     b
```

## Group according to `by`

Up to now, we have learned how to use the `data.table` frame `dat[i, j]` to filter cases in `i` or add/remove/transform columns in-place in `j`. There is a whole other dimension in the `data.table` frame: `by`.  


\begin{info}
The complete \texttt{data.table} syntax is:

\texttt{dt{[}i,\ j,\ by{]}}

\begin{itemize}
\tightlist
\item
  Take data.table \texttt{dt}
\item
  Subset rows using \texttt{i}
\item
  Manipulate columns with \texttt{j}
\item
  Grouped according to \texttt{by}
\end{itemize}
\end{info}

Again, using `.()` or `list()` in `j`, returns a new `data.table`:


```r
dt[, .(meanAbyGroup = mean(A)), by = Group]
```

```
   Group meanAbyGroup
1:     a     3.333333
2:     b     2.500000
```

```r
dt[, list(medianBbyGroup = median(B)), by = Group]
```

```
   Group medianBbyGroup
1:     a            5.6
2:     b            7.0
```

Making an assignment with `:=` in `j`, adds a column in-place. Since here we are grouping, the same value will be assigned to all cases of the group:


```r
dt[, meanAbyGroup := mean(A), by = Group]
dt
```

```
   A   B Group meanAbyGroup
1: 5 8.1     a     3.333333
2: 4 5.6     a     3.333333
3: 1 1.2     a     3.333333
4: 3 9.7     b     2.500000
5: 2 4.3     b     2.500000
```

For more complex operations, you may need to refer to the slice of the `data.table` defined by `by` within `j`. There is a special notation for this: `.SD` (think sub-`data.table`):


```r
dt[, A_DiffFromGroupMin := .SD[, 1] - min(.SD[, 1]), by = Group]
dt
```

```
   A   B Group meanAbyGroup A_DiffFromGroupMin
1: 5 8.1     a     3.333333                  4
2: 4 5.6     a     3.333333                  3
3: 1 1.2     a     3.333333                  0
4: 3 9.7     b     2.500000                  1
5: 2 4.3     b     2.500000                  0
```

\begin{note}
By now, it should be clearer that the \texttt{data.table} frame provides
a very flexible way to perform a very wide range of operations with
minimal new notation.
\end{note}

## Apply functions to columns
Any function that returns a list can be used in `j` to return a new data.table - therefore lapply is perfect for getting summary on multiple columns:

```r
(dt1 <- as.data.table(rnormmat(10, 3, seed = 2020)))
```

```
            V1          V2          V3
 1:  0.3769721 -0.85312282  2.17436525
 2:  0.3015484  0.90925918  1.09818265
 3: -1.0980232  1.19637296  0.31822032
 4: -1.1304059 -0.37158390 -0.07314756
 5: -2.7965343 -0.12326023  0.83426874
 6:  0.7205735  1.80004312  0.19875064
 7:  0.9391210  1.70399588  1.29784138
 8: -0.2293777 -3.03876461  0.93671831
 9:  1.7591313 -2.28897495 -0.14743319
10:  0.1173668  0.05830349  0.11043199
```

```r
setnames(dt1, c("Alpha", "Beta", "Gamma"))
dt1[, lapply(.SD, mean)]
```

```
        Alpha       Beta     Gamma
1: -0.1039628 -0.1007732 0.6748199
```

You can specify which columns to operate on by adding the `.SDcols` argument:

```r
dt2 <- data.table(A = 1:5,
                  B = c(1.2, 4.3, 9.7, 5.6, 8.1),
                  C = rnorm(5),
                  Group = c("a", "b", "b", "a", "a"))
dt2
```

```
   A   B          C Group
1: 1 1.2 -0.8125047     a
2: 2 4.3 -0.7437022     b
3: 3 9.7  1.0953451     b
4: 4 5.6  2.4353737     a
5: 5 8.1  0.3881185     a
```

```r
dt2[, lapply(.SD, mean), .SDcols = 1:2]
```

```
   A    B
1: 3 5.78
```

```r
# same as
dt2[, lapply(.SD, mean), .SDcols = c("A", "B")]
```

```
   A    B
1: 3 5.78
```

```r
cols <- c("A", "B")
dt2[, lapply(.SD, mean), .SDcols = cols]
```

```
   A    B
1: 3 5.78
```

You can combine `.SDcols` and `by`:

```r
dt2[, lapply(.SD, median), .SDcols = c("B", "C"), by = Group]
```

```
   Group   B         C
1:     a 5.6 0.3881185
2:     b 7.0 0.1758215
```


Create multiple new columns from transformation of existing and store with custom prefix:

```r
dt1
```

```
         Alpha        Beta       Gamma
 1:  0.3769721 -0.85312282  2.17436525
 2:  0.3015484  0.90925918  1.09818265
 3: -1.0980232  1.19637296  0.31822032
 4: -1.1304059 -0.37158390 -0.07314756
 5: -2.7965343 -0.12326023  0.83426874
 6:  0.7205735  1.80004312  0.19875064
 7:  0.9391210  1.70399588  1.29784138
 8: -0.2293777 -3.03876461  0.93671831
 9:  1.7591313 -2.28897495 -0.14743319
10:  0.1173668  0.05830349  0.11043199
```

```r
dt1[, paste0(names(dt1), "_abs") := lapply(.SD, abs)]
dt1
```

```
         Alpha        Beta       Gamma Alpha_abs   Beta_abs  Gamma_abs
 1:  0.3769721 -0.85312282  2.17436525 0.3769721 0.85312282 2.17436525
 2:  0.3015484  0.90925918  1.09818265 0.3015484 0.90925918 1.09818265
 3: -1.0980232  1.19637296  0.31822032 1.0980232 1.19637296 0.31822032
 4: -1.1304059 -0.37158390 -0.07314756 1.1304059 0.37158390 0.07314756
 5: -2.7965343 -0.12326023  0.83426874 2.7965343 0.12326023 0.83426874
 6:  0.7205735  1.80004312  0.19875064 0.7205735 1.80004312 0.19875064
 7:  0.9391210  1.70399588  1.29784138 0.9391210 1.70399588 1.29784138
 8: -0.2293777 -3.03876461  0.93671831 0.2293777 3.03876461 0.93671831
 9:  1.7591313 -2.28897495 -0.14743319 1.7591313 2.28897495 0.14743319
10:  0.1173668  0.05830349  0.11043199 0.1173668 0.05830349 0.11043199
```


```r
dt2
```

```
   A   B          C Group
1: 1 1.2 -0.8125047     a
2: 2 4.3 -0.7437022     b
3: 3 9.7  1.0953451     b
4: 4 5.6  2.4353737     a
5: 5 8.1  0.3881185     a
```

```r
cols <- c("A", "C")
dt2[, paste0(cols, "_groupMean") := lapply(.SD, mean), .SDcols = cols, by = Group]
dt2
```

```
   A   B          C Group A_groupMean C_groupMean
1: 1 1.2 -0.8125047     a    3.333333   0.6703292
2: 2 4.3 -0.7437022     b    2.500000   0.1758215
3: 3 9.7  1.0953451     b    2.500000   0.1758215
4: 4 5.6  2.4353737     a    3.333333   0.6703292
5: 5 8.1  0.3881185     a    3.333333   0.6703292
```

## Reshape a `data.table`

### `melt()`: Wide to long


```r
dt_wide <- data.table(ID = 1:4, Timepoint_A = 11:14,
                      Timepoint_B = 21:24, Timepoint_C = 51:54)
dt_wide
```

```
   ID Timepoint_A Timepoint_B Timepoint_C
1:  1          11          21          51
2:  2          12          22          52
3:  3          13          23          53
4:  4          14          24          54
```

```r
dt_long <- melt(dt_wide, id.vars = "ID",
                measure.vars = 2:4, # defaults to all non-id columns
                variable.name = "Timepoint",
                value.name = c("Score"))
dt_long
```

```
    ID   Timepoint Score
 1:  1 Timepoint_A    11
 2:  2 Timepoint_A    12
 3:  3 Timepoint_A    13
 4:  4 Timepoint_A    14
 5:  1 Timepoint_B    21
 6:  2 Timepoint_B    22
 7:  3 Timepoint_B    23
 8:  4 Timepoint_B    24
 9:  1 Timepoint_C    51
10:  2 Timepoint_C    52
11:  3 Timepoint_C    53
12:  4 Timepoint_C    54
```

### `dcast()`: Long to wide


```r
dt_long
```

```
    ID   Timepoint Score
 1:  1 Timepoint_A    11
 2:  2 Timepoint_A    12
 3:  3 Timepoint_A    13
 4:  4 Timepoint_A    14
 5:  1 Timepoint_B    21
 6:  2 Timepoint_B    22
 7:  3 Timepoint_B    23
 8:  4 Timepoint_B    24
 9:  1 Timepoint_C    51
10:  2 Timepoint_C    52
11:  3 Timepoint_C    53
12:  4 Timepoint_C    54
```

```r
dcast(dt_long, ID ~ Timepoint,
      value.var = "Score")
```

```
   ID Timepoint_A Timepoint_B Timepoint_C
1:  1          11          21          51
2:  2          12          22          52
3:  3          13          23          53
4:  4          14          24          54
```

## Table Joins

`data.table` allow you to perform table joins either with the base R `merge()` or with its own bracket notation:


```r
(a <- data.table(PID = c(1:9),
                Hospital = c("UCSF", "HUP", "Stanford", 
                             "Stanford", "UCSF", "HUP", 
                             "HUP", "Stanford", "UCSF"),
                Age = c(22, 34, 41, 19, 53, 21, 63, 22, 19),
                Sex = c(1, 1, 0, 1, 0, 0, 1, 0, 0)))
```

```
   PID Hospital Age Sex
1:   1     UCSF  22   1
2:   2      HUP  34   1
3:   3 Stanford  41   0
4:   4 Stanford  19   1
5:   5     UCSF  53   0
6:   6      HUP  21   0
7:   7      HUP  63   1
8:   8 Stanford  22   0
9:   9     UCSF  19   0
```

```r
(b  <- data.table(PID = c(6:12),
                  V1 = c(153, 89, 112, 228,  91, 190, 101),
                  Department = c("Neurology", "Radiology", "Emergency",
                                 "Cardiology", "Surgery", "Neurology",
                                 "Psychiatry")))
```

```
   PID  V1 Department
1:   6 153  Neurology
2:   7  89  Radiology
3:   8 112  Emergency
4:   9 228 Cardiology
5:  10  91    Surgery
6:  11 190  Neurology
7:  12 101 Psychiatry
```

### Inner


```r
merge(a, b)
```

```
   PID Hospital Age Sex  V1 Department
1:   6      HUP  21   0 153  Neurology
2:   7      HUP  63   1  89  Radiology
3:   8 Stanford  22   0 112  Emergency
4:   9     UCSF  19   0 228 Cardiology
```

### Outer


```r
merge(a, b, all = TRUE)
```

```
    PID Hospital Age Sex  V1 Department
 1:   1     UCSF  22   1  NA       <NA>
 2:   2      HUP  34   1  NA       <NA>
 3:   3 Stanford  41   0  NA       <NA>
 4:   4 Stanford  19   1  NA       <NA>
 5:   5     UCSF  53   0  NA       <NA>
 6:   6      HUP  21   0 153  Neurology
 7:   7      HUP  63   1  89  Radiology
 8:   8 Stanford  22   0 112  Emergency
 9:   9     UCSF  19   0 228 Cardiology
10:  10     <NA>  NA  NA  91    Surgery
11:  11     <NA>  NA  NA 190  Neurology
12:  12     <NA>  NA  NA 101 Psychiatry
```

### Left outer


```r
merge(a, b, all.x = TRUE)
```

```
   PID Hospital Age Sex  V1 Department
1:   1     UCSF  22   1  NA       <NA>
2:   2      HUP  34   1  NA       <NA>
3:   3 Stanford  41   0  NA       <NA>
4:   4 Stanford  19   1  NA       <NA>
5:   5     UCSF  53   0  NA       <NA>
6:   6      HUP  21   0 153  Neurology
7:   7      HUP  63   1  89  Radiology
8:   8 Stanford  22   0 112  Emergency
9:   9     UCSF  19   0 228 Cardiology
```

One way to allow fast joins with bracket notation is to set keys:


```r
setkey(a, "PID")
setkey(b, "PID")
```


```r
b[a, ]
```

```
   PID  V1 Department Hospital Age Sex
1:   1  NA       <NA>     UCSF  22   1
2:   2  NA       <NA>      HUP  34   1
3:   3  NA       <NA> Stanford  41   0
4:   4  NA       <NA> Stanford  19   1
5:   5  NA       <NA>     UCSF  53   0
6:   6 153  Neurology      HUP  21   0
7:   7  89  Radiology      HUP  63   1
8:   8 112  Emergency Stanford  22   0
9:   9 228 Cardiology     UCSF  19   0
```

### Right outer


```r
merge(a, b, all.y = TRUE)
```

```
   PID Hospital Age Sex  V1 Department
1:   6      HUP  21   0 153  Neurology
2:   7      HUP  63   1  89  Radiology
3:   8 Stanford  22   0 112  Emergency
4:   9     UCSF  19   0 228 Cardiology
5:  10     <NA>  NA  NA  91    Surgery
6:  11     <NA>  NA  NA 190  Neurology
7:  12     <NA>  NA  NA 101 Psychiatry
```


```r
a[b, ]
```

```
   PID Hospital Age Sex  V1 Department
1:   6      HUP  21   0 153  Neurology
2:   7      HUP  63   1  89  Radiology
3:   8 Stanford  22   0 112  Emergency
4:   9     UCSF  19   0 228 Cardiology
5:  10     <NA>  NA  NA  91    Surgery
6:  11     <NA>  NA  NA 190  Neurology
7:  12     <NA>  NA  NA 101 Psychiatry
```
