# Functions {#functions}



Writing functions is a core part of programming. 
When should you write a function?  
Whenever you find yourself repeating pieces of code.  
Why is it important?  
Writing functions helps reduce the total amount of code, which reduces the chances of error, and makes your code more readable.  

Reminder: Functions in R are "first class objects".  
This means you can pass them in and out of other functions or objects like any other R structure.  
For example, we have seen that you can use a command like `apply(mat, 2, mean)`   

Functions in R are *for the most part* like mathematical functions: they have one or more inputs and one output. The inputs are known as the function arguments. If you want to return multiple outputs, you can return a list containing any number of R objects.


## Simple functions

Let's start with a very simple function: single argument with no default value:


```r
square <- function(x) {
  x^2
}

square(3)
```

```
[1] 9
```

Notice above that `x^2` is automatically returned by the function. It is the same as explicitly returning it with `return()`:


```r
square <- function(x) {
  out <- x^2
  return(out)
}

square(4)
```

```
[1] 16
```

which is the same as:


```r
square <- function(x) {
  out <- x^2
  out
}

square(5)
```

```
[1] 25
```

A function returns either:

- an object passed to `return()`
- the value of the last expression within the function definition such as `out` or `x^2` above.

Note that the following function definition does not return anything:


```r
sq <- function(x) {
  out <- x^2
}

sq(5)
```

`return()` is a way to end evaluation early:


```r
square.pos <- function(x) {
  if (x > 0) {
    return(x^2)
  } else {
    x
  }
  cat("The input was left unchanged\n")
}

x <- sample(-10:10, 1)
x
```

```
[1] 9
```

```r
square.pos(x)
```

```
[1] 81
```

Multiple arguments, with and without defaults:


```r
raise <- function(x, power = 2) {
  x^power
}

x <- sample(10, 1)
x
```

```
[1] 6
```

```r
raise(x)
```

```
[1] 36
```

```r
raise(x, power = 3)
```

```
[1] 216
```

```r
raise(x, 3)
```

```
[1] 216
```

## Arguments with prescribed list of allowed values

You can match specific values for an argument using `match.arg()`:


```r
myfn <- function(type = c("alpha", "beta", "gamma")) {
  type <- match.arg(type)
  cat("You have selected type '", type, "'\n", sep = "")
}

myfn("a")
```

```
You have selected type 'alpha'
```

```r
myfn("b")
```

```
You have selected type 'beta'
```

```r
myfn("g")
```

```
You have selected type 'gamma'
```

```r
myfn("d")
```

```
Error in match.arg(type): 'arg' should be one of "alpha", "beta", "gamma"
```

Above you see that partial matching using `match.arg()` was able to identify a valid option, and when there was no match, an informative error was printed.

Partial matching is also automatically done on the argument names themselves, but it's important to avoid depending on that. 


```r
adsr <- function(attack = 100,
                 decay = 250,
                 sustain = 40,
                 release = 1000) {
  cat("Attack time:", attack, "ms\n",
      "Decay time:", decay, "ms\n",
      "Sustain level:", sustain, "\n",
      "Release time:", release, "ms\n")
}

adsr(50, s = 100, r = 500)
```

```
Attack time: 50 ms
 Decay time: 250 ms
 Sustain level: 100 
 Release time: 500 ms
```

## Passing extra arguments to another function with the `...` argument

Many functions include a `...` argument at the end. Any arguments not otherwise matched are collected there. A common use for this is to pass them to another function:


```r
cplot <- function(x, y,
                  cex = 1.5,
                  pch = 16,
                  col = "#18A3AC",
                  bty = "n", ...) {
  plot(x, y, cex = cex, pch = pch, col = col, bty = bty, ...)
                  }
```

`...` is also used for variable number of iputs, often as the first argument of a function. For example, look at the documentation of `c`, `cat`, `cbind`, `rbind`, `paste`  

Note: Any arguments after the `...`, **must** be named fully, i.e. will not be partially matched.

## Return multiple objects

R function can only return a single object. This is not much of a problem because you can simply put any collection of objects into a list and return it:


```r
lfn <- function(x, fn = square) {
  xfn <- fn(x)
  
  list(x = x,
       xfn = xfn,
       fn = fn)
}

lfn(3)
```

```
$x
[1] 3

$xfn
[1] 9

$fn
function(x) {
  out <- x^2
  out
}
<bytecode: 0x7fa226688400>
```

## Warnings and errors

You can produce a warning at any point during a function evaluation using `warning("warning message here")`. This cause `warning message here` to be printed to the console as a warning, but does not stop function evaluation.  

To stop function execution, e.g. if an error is encountered, use `stop()`. The following function calculates
$$ e^{log_{10}(x)} $$
which is not defined for negative `x`. In this case we could let R give an error when it tries to compute `log10(x)`, or check x ourselves and write a custom error:


```r
el10 <- function(x) {
  if (x < 0) stop("x must be positive")
  exp(log10(x))
}

el10(-3)
```

```
Error in el10(-3): x must be positive
```

```r
el10(3)
```

```
[1] 1.611429
```

## Scoping

Functions exist in their own environment, i.e. contain their own variable definitions.


```r
x <- 3
y <- 4
fn <- function(x, y) {
  x <- 10*x
  y <- 20*y
  cat("Inside the function, x = ", x, " and y = ", y, "\n")
}

fn(x, y)
```

```
Inside the function, x =  30  and y =  80 
```

```r
cat("Outside the function, x = ", x, " and y = ", y, "\n")
```

```
Outside the function, x =  3  and y =  4 
```

However, if a variable is referenced within a function but no local definition exists, the interpreter will look for the variable at the parent directory. It is best to not rely on this and instead make sure all variables are passed to the functions that need them.  

In the following example, `x` is only defined outside the function definition, but referenced within it.


```r
x <- 21

itfn <- function(y, lr = 1) {
  x + lr * y
}

itfn(3)
```

```
[1] 24
```

### function vs. for loop

Let's z-score the built-in `mtcars` dataset once with a for loop and once with a custom function. This links back to the example seen earlier in the [for loop](#fordata) section. In practice this is performed with the `scale()` command:

Within the for loop, we are assigning columns directly to the object outside the loop. In the following example, we print the environment outside and inside the loop function to see that it is the same. This is purely for demonstration:


```r
# initialize new object 'mtcars_z'
mtcars_z <- mtcars
cat("environment outside for loop is: ")
```

```
environment outside for loop is: 
```

```r
print(environment())
```

```
<environment: R_GlobalEnv>
```

```r
# z-score one column at a time in a for loop
for (i in 1:ncol(mtcars)) {
  mtcars_z[, i] <- (mtcars[, i] - mean(mtcars[, i])) / sd(mtcars[, i])
  cat("environment inside for loop is: ")
  print(environment())
}
```

```
environment inside for loop is: <environment: R_GlobalEnv>
environment inside for loop is: <environment: R_GlobalEnv>
environment inside for loop is: <environment: R_GlobalEnv>
environment inside for loop is: <environment: R_GlobalEnv>
environment inside for loop is: <environment: R_GlobalEnv>
environment inside for loop is: <environment: R_GlobalEnv>
environment inside for loop is: <environment: R_GlobalEnv>
environment inside for loop is: <environment: R_GlobalEnv>
environment inside for loop is: <environment: R_GlobalEnv>
environment inside for loop is: <environment: R_GlobalEnv>
environment inside for loop is: <environment: R_GlobalEnv>
```

With a function, all operations remain local within the function and the output must be returned:


```r
ztransform <- function(x) {
  cat("environment inside function body is: ")
  print(environment())
  z <- as.data.frame(sapply(mtcars, function(i) (i - mean(i))/sd(i)))
  rownames(z) <- rownames(x)
  z
}
mtcars_z2 <- ztransform(mtcars)
```

```
environment inside function body is: <environment: 0x7fa226b456a0>
```

```r
cat("environment outside function body is: ")
```

```
environment outside function body is: 
```

```r
print(environment())
```

```
<environment: R_GlobalEnv>
```

Notice how the environment outside and inside the loop function is the same, it is the Global environemnt, but the environment within the function is different. That is why any objects created or changed within a function must be returned if we want to make them available.

## The pipe operator {#pipe}

<div class="figure" style="text-align: center">
<img src="./R_pipes.png" alt="Illustration of pipes in R" width="80%" />
<p class="caption">(\#fig:FigRpipes)Illustration of pipes in R</p>
</div>

A pipe operator was first introduced to R with the [magrittr](https://magrittr.tidyverse.org/) 
package with the `%>%` symbol. Note that a number of other packages that allow or endorse the use of pipes export the pipe operator as well.  

Starting with R version 4.1, a native pipe operator is included in the language with the `|>` symbol.

A pipe allows writing `f(x)` as `x |> f()` (native pipe) or `x %>% f` (magrittr). 
Note that the native pipe requires parentheses, but magrittr works with or without them.

A pipe is often used to avoid multiple temporary assignments in a multistep procedure, or as an alternative to nesting functions. Some packages and developers promote its use, other discourage it. As always, there is a big subjective component here and you should try and see if and when it suits you.


The following:


```r
x <- f1(x)
x <- f2(x)
x <- f3(x)
```

is equivalent to:


```r
x <- f3(f2(f1(x)))
```

is equivalent to:


```r
x <- x |> f1() |> f2() |> f3()
```


```r
iris[, -5] |>
  split(iris$Species) |>
  lapply(function(i) sapply(i, mean))
```

```
$setosa
Sepal.Length  Sepal.Width Petal.Length  Petal.Width 
       5.006        3.428        1.462        0.246 

$versicolor
Sepal.Length  Sepal.Width Petal.Length  Petal.Width 
       5.936        2.770        4.260        1.326 

$virginica
Sepal.Length  Sepal.Width Petal.Length  Petal.Width 
       6.588        2.974        5.552        2.026 
```

Pipes are used extensively in the [tidyverse](https://www.tidyverse.org) packages.  
You can learn more about the pipe operator in the [magrittr vignette](https://cran.r-project.org/web/packages/magrittr/vignettes/magrittr.html)

<div class="rmdtip">
<p>In <a href="https://rstudio.com/">RStudio</a> the keyboard shortcut for the pipe operator is <code>Shift Command M</code> (MacOS) or <code>Ctrl Shift M</code> (Windows)</p>
</div>
