# Control flow {#controlflow}



Code is often not executed linearly (i.e. line-by-line). Control flow (or flow of control) operations define the order in which code segments are executed.

Execution is often conditional (`if - then - else` or `switch`).

Segments of code may be repeated multiple times (`for`) or as long as certain conditions are met (`while`).

Control flow operations form some of the fundamental building blocks of programs. Each operation is very simple - combine enough of them and you can build up to any amount of complexity.

* `if` [Condition] `then` [Expression] `else` [Alternate Expression]
* `for` [Variable in Sequence] do [Expression]
* `while` [Condition] do [Expression]
* `repeat` [Expression] until `break`
* `break`: break out of `for`, `while` or `repeat` loop
* `next`: skip current iteration and proceed to next

## `if` - `then` - `else`:


```r
a <- 4
if (a < 10) {
  cat("a is not that big")
} else {
  cat("a is not too small")
}
```

```
a is not that big
```

## `if` - `then` - `else if` - `else`:


```r
a <- sample(seq(-2, 2, .5), 1)
a
```

```
[1] 0
```

```r
if (a > 0) {
  result <- "positive"
} else if (a == 0) {
  result <- "zero"
} else {
  result <- "negative"
}
result
```

```
[1] "zero"
```

## Conditional assignment with `if` - `else`:

You can use an `if` statement as part of an assignment:


```r
a <- 8
y <- if (a > 5) {
  10
} else {
  0
}
```

## Conditional assignment with `ifelse`:


```r
a <- 3
(y <- ifelse(a > 5, 10, 0))
```

```
[1] 0
```

`ifelse` is [vectorized](#vectorization):


```r
a <- 1:10
(y <- ifelse(a > 7, a^2, a))
```

```
 [1]   1   2   3   4   5   6   7  64  81 100
```

## `for` loops

Use `for` loops to repeat execution of a block of code a certain number of times.

The syntax is `for (var in vector) expression`.  
The `expression` is usually surrounded by curly brackets and can include any number of lines, any amount of code:


```r
for (i in 1:5) {
  print("I love coffee")
}
```

```
[1] "I love coffee"
[1] "I love coffee"
[1] "I love coffee"
[1] "I love coffee"
[1] "I love coffee"
```

The loop executes for `length(vector)` times.  
At iteration `i`, `var = vector[i]`.  
You will often use the value of `var` inside the loop (but you don't have to):


```r
for (i in seq(10)) {
  cat(i^2, "\n")
}
```

```
1 
4 
9 
16 
25 
36 
49 
64 
81 
100 
```

`letters` is a built-in constant that includes all 26 lowercase letters of the Roman alphabet; `LETTERS` similarly includes all 26 uppercase letters.


```r
for (letter in letters[1:5]) {
  cat(letter, "is a letter!\n")
}
```

```
a is a letter!
b is a letter!
c is a letter!
d is a letter!
e is a letter!
```

### Nested `for` loops


```r
a <- matrix(1:9, 3)
for (i in seq(3)) {
  for (j in seq(3)) {
    cat("  a[", i, ",", j, "] is ", a[i, j], "\n", sep = "")
  }
}
```

```
  a[1,1] is 1
  a[1,2] is 4
  a[1,3] is 7
  a[2,1] is 2
  a[2,2] is 5
  a[2,3] is 8
  a[3,1] is 3
  a[3,2] is 6
  a[3,3] is 9
```

## Select one of multiple alternatives with `switch`

Instead of using multiple `if` - `else if` statements, we can build a more compact call using `switch`. (It is best suited for options that are of type character, rather than numeric)


```r
y <- sample(letters[seq(8)], 1)
y
```

```
[1] "h"
```

```r
output <- switch(y,                      # 1. Some expression
                 a = "Well done",        # 2. The possible values of the expression, unquoted
                 b = "Not bad",          #    followed by the `=` and the conditional output
                 c = "Nice try",
                 d = "Not a nice try",
                 e = "This is bad",
                 f = "Fail",
                 "This is not even a possible grade") # 3. An optional last argument is the default
                                                      #    value, if there is no match above
output
```

```
[1] "This is not even a possible grade"
```


```r
a <- rnorm(1)
a
```

```
[1] 0.3699507
```

```r
out <- switch(as.integer(a > 0),
              `1` = "Input is positive",
              `0` = "Input is not positive")
out
```

```
[1] "Input is positive"
```


```r
a <- rnorm(1)
a
```

```
[1] -1.334346
```

```r
out <- switch(as.character(a > 0),
              `TRUE` = "Input is positive",
              `FALSE` = "Input is not positive")
out
```

```
[1] "Input is not positive"
```

### `switch` example: HTTP Status Codes


```r
status <- sample(400:410, 1)
status
```

```
[1] 402
```

```r
response <- switch(as.character(status),
                   `400` = "Bad Request",
                   `401` = "Unauthorized",
                   `402` = "Payment Required",
                   `403` = "Forbidden",
                   `404` = "Not Found",
                   `405` = "Method Not Allowed",
                   `406` = "Not Acceptable",
                   `407` = "Proxy Authentication Required",
                   `408` = "Request Timeout",
                   `409` = "Conflict",
                   `410` = "Gone")
response
```

```
[1] "Payment Required"
```

## `while` loops


```r
a <- 10
while (a > 0) {
  a <- a - 1
  cat("a is equal to", a, "\n")
}
```

```
a is equal to 9 
a is equal to 8 
a is equal to 7 
a is equal to 6 
a is equal to 5 
a is equal to 4 
a is equal to 3 
a is equal to 2 
a is equal to 1 
a is equal to 0 
```

```r
cat("when all is said and done, a is", a)
```

```
when all is said and done, a is 0
```

## `break` stops execution of a loop:


```r
for (i in seq(10)) {
  if (i == 5) break()
  cat(i, "squared is", i^2, "\n")
}
```

```
1 squared is 1 
2 squared is 4 
3 squared is 9 
4 squared is 16 
```

## `next` skips the current iteration:


```r
for (i in seq(7)) {
  if (i == 5) next()
  cat(i, "squared is", i^2, "\n")
}
```

```
1 squared is 1 
2 squared is 4 
3 squared is 9 
4 squared is 16 
6 squared is 36 
7 squared is 49 
```

## `repeat` loops

`repeat` initiates an infinite loop and you **must** use `break` to exit. Probably best to use any other type of loop instead.


```r
i <- 10
repeat {
 i <- i - 1
 if (i == 0) break()
 cat("i is", i, "\n")
}
```

```
i is 9 
i is 8 
i is 7 
i is 6 
i is 5 
i is 4 
i is 3 
i is 2 
i is 1 
```
