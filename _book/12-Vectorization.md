# Vectorized Operations {#vectorization}



Most built-in R functions are vectorized and many functions from external packages are as well.

<div class="rmdtip">
<p>A vectorized function operates on all elements of a vector at the same time.</p>
</div>

Vectorization is very efficient: it can save both human (your) time and machine time.  
In many cases, applying a function on all elements simultaneously may seem obvious or expected behavior, but since not all functions are vectorized, make sure to check the documentation if unsure.

## Operations between vectors of equal length

Such operations are applied between corresponding elements of each vector:


```r
x <- 1:10
z <- 11:20
x
```

```
 [1]  1  2  3  4  5  6  7  8  9 10
```

```r
z
```

```
 [1] 11 12 13 14 15 16 17 18 19 20
```

```r
x + z
```

```
 [1] 12 14 16 18 20 22 24 26 28 30
```
i.e. the above is equal to `c(x[1] + z[1], x[2] + z[2], ..., x[n] + z[n])`

## Operations between a vector and a scalar

In this cases, the scalar is essentially recycled, i.e. repeated to match the length of the vector:


```r
(x + 10)
```

```
 [1] 11 12 13 14 15 16 17 18 19 20
```

```r
(x * 2)
```

```
 [1]  2  4  6  8 10 12 14 16 18 20
```

```r
(x / 10)
```

```
 [1] 0.1 0.2 0.3 0.4 0.5 0.6 0.7 0.8 0.9 1.0
```

```r
(x ^ 2)
```

```
 [1]   1   4   9  16  25  36  49  64  81 100
```

## Operations between vectors of unequal length: **value recycling**

Operations between a vector and a scalar are a special case of operations between vectors of unequal length. Whenever you perform an operation between two objects of different length, ***the shorter object's elements are recycled***:


```r
x + c(2:1)
```

```
 [1]  3  3  5  5  7  7  9  9 11 11
```

<div class="rmdcaution">
<p>Operations between objects of unequal length can occur by mistake. If the shorter object’s length is a multiple of the longer object’s length, there will be <em>no error or warning</em>, as above. Otherwise, there is a warning (which may be confusing at first) BUT <strong><em>recycling still happens and is highly unlikely to be intentional</em></strong>:</p>
</div>


```r
x + c(1, 3, 9)
```

```
Warning in x + c(1, 3, 9): longer object length is not a multiple of shorter
object length
```

```
 [1]  2  5 12  5  8 15  8 11 18 11
```

## Vectorized matrix operations

Operations between matrices are similarly vectorized, i.e. performed between corresponding elements:


```r
a <- matrix(1:4, 2)
b <- matrix(11:14, 2)
a
```

```
     [,1] [,2]
[1,]    1    3
[2,]    2    4
```

```r
b
```

```
     [,1] [,2]
[1,]   11   13
[2,]   12   14
```

```r
a + b
```

```
     [,1] [,2]
[1,]   12   16
[2,]   14   18
```

```r
a * b
```

```
     [,1] [,2]
[1,]   11   39
[2,]   24   56
```

```r
a / b
```

```
           [,1]      [,2]
[1,] 0.09090909 0.2307692
[2,] 0.16666667 0.2857143
```

## Vectorized functions

Some examples of common mathematical operations that are vectorized:


```r
log(x)
```

```
 [1] 0.0000000 0.6931472 1.0986123 1.3862944 1.6094379 1.7917595 1.9459101
 [8] 2.0794415 2.1972246 2.3025851
```

```r
sqrt(x)
```

```
 [1] 1.000000 1.414214 1.732051 2.000000 2.236068 2.449490 2.645751 2.828427
 [9] 3.000000 3.162278
```

```r
sin(x)
```

```
 [1]  0.8414710  0.9092974  0.1411200 -0.7568025 -0.9589243 -0.2794155
 [7]  0.6569866  0.9893582  0.4121185 -0.5440211
```

```r
cos(x)
```

```
 [1]  0.5403023 -0.4161468 -0.9899925 -0.6536436  0.2836622  0.9601703
 [7]  0.7539023 -0.1455000 -0.9111303 -0.8390715
```

## `ifelse()`

`ifelse()` is vectorized and can be a great and compact alternative to a more complicated expression:


```r
a <- 1:10
(y <- ifelse(a > 5, 11:20, 21:30))
```

```
 [1] 21 22 23 24 25 16 17 18 19 20
```

so what did this do?

It is equivalent to:


```r
idl <- a > 5
yes <- 11:20
no <- 21:30
out <- vector("numeric", 10)
for (i in seq(a)) {
  if (idl[i]) {
    out[i] <- yes[i]
  } else {
    out[i] <- no[i]
  }
}
out
```

```
 [1] 21 22 23 24 25 16 17 18 19 20
```
i.e.

* Create a logical index using `test`
* for each element `i` in `test`:
    * if the element `i` is TRUE, return `yes[i]`, else `no[i]`

For another example, lets take integers `1:11` and square the odd ones and cube the even ones. We use the modulo operation `%%` to test if each element is odd or even:


```r
x <- 1:11
xsc <- ifelse(x %% 2 == 0, c(1:11)^3, c(1:11)^2)
xsc
```

```
 [1]    1    8    9   64   25  216   49  512   81 1000  121
```
