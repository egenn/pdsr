# Data Types {#types}



<STYLE type='text/css' scoped>
PRE.fansi SPAN {padding-top: .25em; padding-bottom: .25em};
</STYLE>

<div class="rmdtip">
<p>In R, everything is an object.</p>
<p>Every “action” is a function.</p>
<p><a href="#functions">Functions</a> are also objects, which means they can be passed as arguments to functions or returned from other functions.</p>
<p>We shall see the relevance of this, for example, in the <a href="#loopfns">Loop Functions</a> chapter.</p>
</div>

## Base types

R includes a number of builtin data types.  

These are defined by the R core team: users cannot define their own data types, but they can define their own classes - see section on [Classes and Object-Oriented Programming](#classes).  

Some of the more popular data types in R are:

* Logical (a.k.a. [Boolean](https://en.wikipedia.org/wiki/Boolean_data_type))
* Numeric, integer
* Numeric, [double](https://en.wikipedia.org/wiki/Double-precision_floating-point_format)
* Character
* Environment
* Closure (i.e. function)

<div class="rmdcaution">
<p>Many errors in R occur because a variable is, or gets coerced to, the wrong type by accident.</p>
</div>

<div class="rmdtip">
<p><strong>Check variable types with <code>typeof()</code> and/or <code>str()</code>.</strong></p>
</div>

## Assignment

Use `<-` for all assignments:


```r
x <- 3
# You can add comments within code blocks using the usual "#" prefix
```

<div class="rmdtip">
<p>In <a href="https://rstudio.com/">RStudio</a> the keyboard shortcut for the assignment operator <code>&lt;-</code> is <code>Option -</code> (MacOS) or <code>Alt -</code> (Windows).</p>
</div>

Typing the name of an object...


```r
x
```

```
[1] 3
```
...is equivalent to printing it


```r
print(x)
```

```
[1] 3
```

You can also place any assignment in parentheses and this will perform the assignment and print the object:


```r
(x <- 3)
```

```
[1] 3
```

<div class="rmdnote">
<p>While you <em>could</em> use the equal sign ‘=’ for assignment, you should only use it to pass arguments to functions.</p>
</div>

You can assign the same value to multiple objects - this can be useful when initializing variables.


```r
x <- z <- init <- 0
x
```

```
[1] 0
```

```r
z
```

```
[1] 0
```

```r
init
```

```
[1] 0
```

Excitingly, R allows assignment in the opposite direction as well:


```r
10 -> x
x
```

```
[1] 10
```

We shall see later that the `->` assignment can be convenient at the end of a [pipe](https://class.lambdamd.org/progdatscir/functions.html#the-pipe-operator).

You can even do this, which is fun (?) but unlikely to be useful:


```r
x <- 7 -> z
x
```

```
[1] 7
```

```r
z
```

```
[1] 7
```

Use `c()` to combine multiple values into a vector - this is one of the most widely used R functions:


```r
x <- c(-12, 3.5, 104)
x
```

```
[1] -12.0   3.5 104.0
```


## Initialize - coerce - test (types)

The following summary table lists the functions to *initialize*, *coerce* (=convert), and *test* the core data types, which are shown in more detail in the following paragraphs:

| **Initialize** | **Coerce**        | **Test**          |
|---------------:|------------------:|------------------:|
| `logical(n)`   | `as.logical(x)`   | `is.logical(x)`   |
| `integer(n)`   | `as.integer(x)`   | `is.integer(x)`   |
| `double(n)`    | `as.double(x)`    | `is.double(x)`    |
| `character(n)` | `as.character(x)` | `is.character(x)` |

## Logical 

If you are writing code, use `TRUE` and `FALSE`.  
On the console, you can abbreviate to `T` and `F`.


```r
a <- c(TRUE, FALSE)
a <- c(T, F)
x <- 4
b <- x > 10
b
```

```
[1] FALSE
```

```r
str(b)
```

```
 logi FALSE
```

```r
typeof(b)
```

```
[1] "logical"
```

## Integer

Create a range of integers using colon notation `start:end`:


```r
(x <- 11:15)
```

```
[1] 11 12 13 14 15
```

```r
typeof(x)
```

```
[1] "integer"
```

```r
str(x)
```

```
 int [1:5] 11 12 13 14 15
```

Note that assigning an integer defaults to type double:


```r
x <- 1
typeof(x)
```

```
[1] "double"
```

```r
str(x)
```

```
 num 1
```

You can force it to be stored as integer by adding an `L` suffix:


```r
x <- 1L
typeof(x)
```

```
[1] "integer"
```

```r
str(x)
```

```
 int 1
```

```r
x <- c(1L, 3L, 5L)
str(x)
```

```
 int [1:3] 1 3 5
```

## Double


```r
x <- c(1.2, 3.4, 10.987632419834556)
x
```

```
[1]  1.20000  3.40000 10.98763
```

```r
typeof(x)
```

```
[1] "double"
```

```r
str(x)
```

```
 num [1:3] 1.2 3.4 11
```

## Character

A character vector consists of one or more elements, each of which consists of one or more actual characters, i.e. it is **not** a vector of single characters. (The length of a character vector is the number of individual elements, and is not related to the number of characters in each element)


```r
x <- "word"
typeof(x)
```

```
[1] "character"
```

```r
length(x)
```

```
[1] 1
```


```r
(x <- c("a", "b", "gamma", "delta"))
```

```
[1] "a"     "b"     "gamma" "delta"
```

```r
typeof(x)
```

```
[1] "character"
```

```r
length(x)
```

```
[1] 4
```

## Environment

Defining your own environments is probably for advanced use only:


```r
x <- new.env()
x$name <- "Guava"
x$founded <- 2020
x
```

```
<environment: 0x7ff24b08ef48>
```

```r
typeof(x)
```

```
[1] "environment"
```

## Closure (function)

Closures are functions - they contain their own variable definitions.  
Read more on [functions](#functions).


```r
square <- function(x) x^2
square(3)
```

```
[1] 9
```

```r
typeof(square)
```

```
[1] "closure"
```

## Initialize vectors

You can create / initialize vectors of specific type with the `vector` command and specifying a `mode` or directly by calling the relevant function:


```r
(xl <- vector(mode = "logical", length = 10))
```

```
 [1] FALSE FALSE FALSE FALSE FALSE FALSE FALSE FALSE FALSE FALSE
```

```r
(xd <- vector(mode = "double", length = 10))
```

```
 [1] 0 0 0 0 0 0 0 0 0 0
```

```r
(xn <- vector(mode = "numeric", length = 10)) # same as "double"
```

```
 [1] 0 0 0 0 0 0 0 0 0 0
```

```r
(xi <- vector(mode = "integer", length = 10))
```

```
 [1] 0 0 0 0 0 0 0 0 0 0
```

```r
(xc <- vector(mode = "character", length = 10))
```

```
 [1] "" "" "" "" "" "" "" "" "" ""
```

These are aliases of the `vector` command above (print their source code to see for yourself)


```r
xl <- logical(10)
xd <- double(10)
xn <- numeric(10) # same as double
xi <- integer(10)
xc <- character(10)
```

## Explicit coercion

We can explicitly convert objects of one type to a different type using `as.*` functions:


```r
(x <- c(1.2, 2.3, 3.4))
```

```
[1] 1.2 2.3 3.4
```

```r
(x <- as.logical(x))
```

```
[1] TRUE TRUE TRUE
```

```r
(x <- as.double(x))
```

```
[1] 1 1 1
```

```r
(x <- as.numeric(x))
```

```
[1] 1 1 1
```

```r
(x <- as.integer(x))
```

```
[1] 1 1 1
```

```r
(x <- as.character(x))
```

```
[1] "1" "1" "1"
```

Logical vectors are converted to 1s and 0s as expected:  

TRUE becomes 1 and FALSE becomes 0


```r
x <- c(TRUE, TRUE, FALSE)
as.numeric(x)
```

```
[1] 1 1 0
```

Note that converting from numeric to logical **anything other than zero is TRUE**:


```r
x <- seq(-2, 2, .5)
as.logical(x)
```

```
[1]  TRUE  TRUE  TRUE  TRUE FALSE  TRUE  TRUE  TRUE  TRUE
```

Not all conversions are possible.  
There is no meaningful/consistent way to convert a character vector to numeric.  
The following outputs NA values and prints a (helpful) error message.


```r
x <- c("mango", "banana", "tangerine")
as.numeric(x)
```

```
Warning: NAs introduced by coercion
```

```
[1] NA NA NA
```

## Implicit coercion

Remember, the language tries to make life easier and will often automatically coerce from one class to another to make requested operations possible.

For example, you can sum a logical vector.  
It will automatically be converted to numeric as we saw earlier.


```r
x <- c(TRUE, TRUE, FALSE)
sum(x)
```

```
[1] 2
```

On the other hand, you cannot sum a factor, for example.  
You get an error with an explanation:


```r
x <- factor(c("mango", "banana", "mango"))
sum(x)
```

```
Error in Summary.factor(structure(c(2L, 1L, 2L), .Label = c("banana", : 'sum' not meaningful for factors
```

<div class="rmdnote">
<p>Note: We had to add <code>error = TRUE</code> in the Rmarkdown’s code block’s options (not visible in the HTML output), because otherwise compilation of the Rmarkdown document would stop at the error.</p>
</div>

If for some reason it made sense, you could explicitly coerce to numeric and then sum:


```r
x <- factor(c("mango", "banana", "mango"))
sum(as.numeric(x))
```

```
[1] 5
```

## `NA`: Missing Values

Missing values in any data type - logical, integer, double, or character - are coded using `NA`.  
To check for the presence of `NA` values, use `is.na()`:


```r
(x <- c(1.2, 5.3, 4.8, NA, 9.6))
```

```
[1] 1.2 5.3 4.8  NA 9.6
```

```r
is.na(x)
```

```
[1] FALSE FALSE FALSE  TRUE FALSE
```


```r
(x <- c("mango", "banana", NA, "sugar", "ackee"))
```

```
[1] "mango"  "banana" NA       "sugar"  "ackee" 
```

```r
is.na(x)
```

```
[1] FALSE FALSE  TRUE FALSE FALSE
```


```r
(x <- c(T, T, F, T, F, F, NA))
```

```
[1]  TRUE  TRUE FALSE  TRUE FALSE FALSE    NA
```

```r
is.na(x)
```

```
[1] FALSE FALSE FALSE FALSE FALSE FALSE  TRUE
```

`is.na()` works similarly on matrices:


```r
x <- matrix(1:20, 5)
x[4, 3] <- NA
is.na(x)
```

```
      [,1]  [,2]  [,3]  [,4]
[1,] FALSE FALSE FALSE FALSE
[2,] FALSE FALSE FALSE FALSE
[3,] FALSE FALSE FALSE FALSE
[4,] FALSE FALSE  TRUE FALSE
[5,] FALSE FALSE FALSE FALSE
```

<div class="rmdnote">
<p>Note that <code>is.na()</code> returns a response for each element (i.e. is <a href="#vectorization">vectorized</a>) in contrast to <code>is.numeric()</code>, <code>is.logical()</code>, etc. It makes sense, since the latter are chacking the type of a whole object, while the former is checking individual elements.</p>
</div>

`anyNA()` is a very useful function to check if there an any NA values in an object:


```r
anyNA(x)
```

```
[1] TRUE
```


<div class="rmdnote">
<p>Any operations on an <code>NA</code> results in <code>NA</code></p>
</div>


```r
x <- c(1.2, 5.3, 4.8, NA, 9.6)
x*2
```

```
[1]  2.4 10.6  9.6   NA 19.2
```
Multiple functions that accept as input an object with multiple values (a vector, a matrix, a data.frame, etc.) will return `NA` if *any* element is `NA`:


```r
mean(x)
```

```
[1] NA
```

```r
median(x)
```

```
[1] NA
```

```r
sd(x)
```

```
[1] NA
```

```r
min(x)
```

```
[1] NA
```

```r
max(x)
```

```
[1] NA
```

```r
range(x)
```

```
[1] NA NA
```

First, make sure `NA` values represent legitimate missing data and not some error.  
Then, decide how you want to handle it.

In all of the above commands you can pass `na.rm = TRUE` to ignore `NA` values:


```r
mean(x, na.rm = TRUE)
```

```
[1] 5.225
```

```r
median(x, na.rm = TRUE)
```

```
[1] 5.05
```

```r
sd(x, na.rm = TRUE)
```

```
[1] 3.441293
```

```r
min(x, na.rm = TRUE)
```

```
[1] 1.2
```

```r
max(x, na.rm = TRUE)
```

```
[1] 9.6
```

```r
range(x, na.rm = TRUE)
```

```
[1] 1.2 9.6
```

The chapter on [Handling Missing Data](#missingdata) describes some approaches to handling missing data in the context of statistics or modeling, commonly supervised learning.

## `NaN`: Not a number

`NaN` is a special case of `NA` and can be the result of undefined mathematical operations:


```r
a <- log(-4)
```

```
Warning in log(-4): NaNs produced
```

Note that `class()` returns "numeric":


```r
class(a)
```

```
[1] "numeric"
```

To test for `NaN`s, use:


```r
is.nan(a)
```

```
[1] TRUE
```
`NaN`s are also `NA`:


```r
is.na(a)
```

```
[1] TRUE
```
But the opposite is not true:


```r
is.nan(NA)
```

```
[1] FALSE
```
<div class="rmdnote">
<p><code>NaN</code> can be considered a subtype of <code>NA</code>, as such: <code>is.na(NaN)</code> is <code>TRUE</code>, but <code>is.nan(NA)</code> is <code>FALSE</code>.</p>
</div>


## `NULL`: the empty object

The `NULL` object represents an empty object.

<div class="rmdnote">
<p><code>NULL</code> means empty, <strong><em>not missing</em></strong>, and is therefore entirely different from <code>NA</code></p>
</div>

`NULL` shows up for example when initializing a list:


```r
a <- vector("list", 4)
a
```

```
[[1]]
NULL

[[2]]
NULL

[[3]]
NULL

[[4]]
NULL
```

and it can be replaced normally:


```r
a[[1]] <- 3
a
```

```
[[1]]
[1] 3

[[2]]
NULL

[[3]]
NULL

[[4]]
NULL
```

### Replacing with NULL

You cannot replace one or more elements of a vector/matrix/array with `NULL` because `NULL` has length 0 and replacement requires object of equal length:


```r
a <- 11:15
a
```

```
[1] 11 12 13 14 15
```

```r
a[1] <- NULL
```

```
Error in a[1] <- NULL: replacement has length zero
```

However, in lists and therefore also data frames, replacing an element with `NULL` ***removes that element***:


```r
al <- list(alpha = 11:15,
           beta = rnorm(10),
           gamma = c("mango", "banana", "tangerine"))
al
```

```
$alpha
[1] 11 12 13 14 15

$beta
 [1]  0.48374522 -0.30304136 -0.83162050  0.03965321 -0.42187083  0.20580496
 [7] -0.12728272 -0.26500108  0.40817366  0.32006139

$gamma
[1] "mango"     "banana"    "tangerine"
```

```r
al[[2]] <- NULL
al
```

```
$alpha
[1] 11 12 13 14 15

$gamma
[1] "mango"     "banana"    "tangerine"
```

Finally, `NULL` is often used as the default value in a function's argument. The function definition must then determine what the default behavior/value should be.
