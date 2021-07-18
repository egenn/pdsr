# Basic operations {#basicops}

First, before even learning about data types and structures, it may be worth looking at some of the basic mathematical and statistical operations in R.



## Arithmetic


```r
x <- 10
y <- 3
```

Standard arithmetic operations are as expected:


```r
x + y
```

```
[1] 13
```

```r
x - y
```

```
[1] 7
```

```r
x * y
```

```
[1] 30
```

```r
x / 3
```

```
[1] 3.333333
```
Exponentiation uses `^`:
(This is worth pointing out, because while `^` is likely the most common way to represent exponentiation, the symbol used for exponentiation varies across languages)


```r
x^3
```

```
[1] 1000
```

Square root is `sqrt()`:


```r
sqrt(81)
```

```
[1] 9
```

Integer division 
i.e. *Divide and forget the remainder*


```r
x %/% 3
```

```
[1] 3
```

i.e. how many times the denominator fits in the numerator, without taking fractions of the denominator. It can be applied on decimals the same way:


```r
9.5 %/% 3.1
```

```
[1] 3
```

Modulo operation
i.e. *Divide and return just the remainder*


```r
x %% y
```

```
[1] 1
```

```r
x <- (-10:10)[-11]
y <- sample((-10:10)[-11], 20)
x - (x %/% y) * y == x %% y
```

```
 [1] TRUE TRUE TRUE TRUE TRUE TRUE TRUE TRUE TRUE TRUE TRUE TRUE TRUE TRUE TRUE
[16] TRUE TRUE TRUE TRUE TRUE
```
Try to figure out what the following does:  


```r
x <- rnorm(20)
y <- rnorm(20)
round(x - (x %/% y) * y, 5) == round(x %% y, 5)
```

```
 [1] TRUE TRUE TRUE TRUE TRUE TRUE TRUE TRUE TRUE TRUE TRUE TRUE TRUE TRUE TRUE
[16] TRUE TRUE TRUE TRUE TRUE
```

<div class="rmdtip">
<p><code>round(x, digits)</code> rounds <code>x</code> to the desired number of digits and is used to overcome rounding errors.</p>
</div>
## Logical operations

Logical AND with `&`


```r
T & T
```

```
[1] TRUE
```


```r
T & F
```

```
[1] FALSE
```

Logical OR with `|`


```r
T | F
```

```
[1] TRUE
```

Logical negation with `!`


```r
x <- TRUE
!x
```

```
[1] FALSE
```

Exclusive OR with `xor()`
(= one or the other is TRUE but not both)


```r
a <- c(T, T, T, F, F, F)
b <- c(F, F, T, F, T, T)
a & b
```

```
[1] FALSE FALSE  TRUE FALSE FALSE FALSE
```

```r
a | b
```

```
[1]  TRUE  TRUE  TRUE FALSE  TRUE  TRUE
```

```r
xor(a, b)
```

```
[1]  TRUE  TRUE FALSE FALSE  TRUE  TRUE
```

Test all elements are TRUE with `all()`:


```r
all(a)
```

```
[1] FALSE
```

Test if any element is TRUE with `any()`:


```r
any(a)
```

```
[1] TRUE
```

## Common descriptive stats

Let's use the `rnorm` function to draw 200 numbers from a random normal distribution:


```r
x <- rnorm(200)
```

Basic descriptive stat operations:


```r
mean(x)
```

```
[1] 0.2022442
```

```r
median(x)
```

```
[1] 0.1697613
```

```r
sd(x) # standard deviation
```

```
[1] 1.046756
```

```r
min(x)
```

```
[1] -2.487476
```

```r
max(x)
```

```
[1] 2.429501
```

```r
range(x)
```

```
[1] -2.487476  2.429501
```

```r
summary(x)
```

```
   Min. 1st Qu.  Median    Mean 3rd Qu.    Max. 
-2.4875 -0.5679  0.1698  0.2022  1.0503  2.4295 
```
