# Indexing - Subsetting - Slicing {#indexing}



An index is used to select elements of a vector, matrix, array, list or data frame.  
You can select (or exclude) one or multiple elements at a time.  

An index is one of two types:

- logical index: for each elements in an object specify `TRUE` if you want to include it, or `FALSE` to exclude it from the selection.
- integer index: define the position of elements to select.  

The main indexing operator in R is the square bracket `[`.  
Logical indexes are usually created as the output of a logical operation, e.g. an elemntwise comparison.  
Integer indexing in R is 1-based, meaning the first item of a vector is in position 1.  
(If you are wondering why we even have to mention this, know that many programming languages use [0-based indexing](https://en.wikipedia.org/wiki/Zero-based_numbering#Computer_programming))

## Vectors {#indexvectors}


```r
x <- 15:24
x
```

```
 [1] 15 16 17 18 19 20 21 22 23 24
```

Get the 5th element of a vector (integer index):


```r
x[5]
```

```
[1] 19
```

Get elements 6 through 9 of the same vector (integer index):


```r
x[6:9]
```

```
[1] 20 21 22 23
```

Select elements with value greater than 19 (logical index):


```r
x[x > 19]
```

```
[1] 20 21 22 23 24
```

## Matrices {#indexmatrices}

Reminder:

- A matrix is a 2D vector and contains elements of one type only (numeric, integer, character, factor).  
- A data frame is a 2D list and each column can contain different type of data.

To index a 2D structure, whether a matrix or data frame, we use the form `[row, column]`  
The following indexing operations are therefore the same whether applied on a matrix or a data frame.


```r
mat <- matrix(1:40, 10)
colnames(mat) <- paste0("Feature_", seq(ncol(mat)))
rownames(mat) <- paste0("Row_", seq(nrow(mat)))
mat
```

```
       Feature_1 Feature_2 Feature_3 Feature_4
Row_1          1        11        21        31
Row_2          2        12        22        32
Row_3          3        13        23        33
Row_4          4        14        24        34
Row_5          5        15        25        35
Row_6          6        16        26        36
Row_7          7        17        27        37
Row_8          8        18        28        38
Row_9          9        19        29        39
Row_10        10        20        30        40
```

```r
df <- as.data.frame(mat)
df
```

```
       Feature_1 Feature_2 Feature_3 Feature_4
Row_1          1        11        21        31
Row_2          2        12        22        32
Row_3          3        13        23        33
Row_4          4        14        24        34
Row_5          5        15        25        35
Row_6          6        16        26        36
Row_7          7        17        27        37
Row_8          8        18        28        38
Row_9          9        19        29        39
Row_10        10        20        30        40
```

To get the contents of the fifth row, second column:


```r
mat[5, 2]
```

```
[1] 15
```

```r
df[5, 2]
```

```
[1] 15
```

If you want to select an entire row or an entire column, you leave the row or column index blank, but - necessarily - use a comma:

Get the first row:


```r
mat[1, ]
```

```
Feature_1 Feature_2 Feature_3 Feature_4 
        1        11        21        31 
```

Get the second column:


```r
mat[, 2]
```

```
 Row_1  Row_2  Row_3  Row_4  Row_5  Row_6  Row_7  Row_8  Row_9 Row_10 
    11     12     13     14     15     16     17     18     19     20 
```
Note that colnames and rownames where added to the matrix above for convenience - if they are absent, the labels are not shown above each element.

### Range of rows and columns

You can define ranges for both rows and columns:


```r
mat[6:7, 2:4]
```

```
      Feature_2 Feature_3 Feature_4
Row_6        16        26        36
Row_7        17        27        37
```

You can return rows and/or columns reversed too if desired:


```r
mat[7:6, 4:2]
```

```
      Feature_4 Feature_3 Feature_2
Row_7        37        27        17
Row_6        36        26        16
```

Or use vectors to specify of any rows and columns:


```r
mat[c(2, 4, 7), c(1, 4, 3)]
```

```
      Feature_1 Feature_4 Feature_3
Row_2         2        32        22
Row_4         4        34        24
Row_7         7        37        27
```

### Matrix of indexes

This is quite less common, but potentially useful. It allows you to specify a series of individual `[i, j]` indexes (i.e. is a way to select multiple non-contiguous elements)


```r
idm <- matrix(c(2, 4, 7, 4, 3, 1), 3)
idm
```

```
     [,1] [,2]
[1,]    2    4
[2,]    4    3
[3,]    7    1
```

An n-by-2 matrix can be used to index as a length n vector of `[row, colum]` indexes. Therefore, the above matrix, will return elements `[2, 4], [4, 3], [7, 1]`:


```r
mat[idm]
```

```
[1] 32 24  7
```

### Logical index {#matidl}

Select all rows with values greater than 15 on the second column:

The logical index for this operation is:


```r
mat[, 2] > 15
```

```
 Row_1  Row_2  Row_3  Row_4  Row_5  Row_6  Row_7  Row_8  Row_9 Row_10 
 FALSE  FALSE  FALSE  FALSE  FALSE   TRUE   TRUE   TRUE   TRUE   TRUE 
```

It can be used directly to index the matrix:


```r
mat[mat[, 2] > 15, ]
```

```
       Feature_1 Feature_2 Feature_3 Feature_4
Row_6          6        16        26        36
Row_7          7        17        27        37
Row_8          8        18        28        38
Row_9          9        19        29        39
Row_10        10        20        30        40
```

## Lists {#indexlists}

Reminder: A list can contain elements of different class and of different length:


```r
(x <- list(one = 1:4,
           two = sample(seq(0, 100, .1), 10),
           three = c("mango", "banana", "tangerine"),
           four = median))
```

```
$one
[1] 1 2 3 4

$two
 [1] 19.3 43.7  9.0 59.0 40.4 23.8 13.6 77.3 27.4  3.8

$three
[1] "mango"     "banana"    "tangerine"

$four
function (x, na.rm = FALSE, ...) 
UseMethod("median")
<bytecode: 0x7fc81b0b08f8>
<environment: namespace:stats>
```

You can access a list element with:

- `$` followed by name of the element (therefore only works if elements are named)
- using double brackets `[[` with either name or integer index

To access the third element:


```r
x$three
```

```
[1] "mango"     "banana"    "tangerine"
```

```r
x[["three"]]
```

```
[1] "mango"     "banana"    "tangerine"
```

```r
class(x[["three"]])
```

```
[1] "character"
```

```r
x[[3]]
```

```
[1] "mango"     "banana"    "tangerine"
```

To access an element with a name or integer index stored in a variable, only the bracket notation works - therefore programmatically you would always use double brackets to access different elements:


```r
idi <- 3
idc <- "three"
x[[idi]]
```

```
[1] "mango"     "banana"    "tangerine"
```

```r
x[[idc]]
```

```
[1] "mango"     "banana"    "tangerine"
```

`$` or `[[` return an element.  
In contrast, single bracket `[` indexing of a list returns a pruned list:


```r
x[[idi]]
```

```
[1] "mango"     "banana"    "tangerine"
```

```r
class(x[[idi]])
```

```
[1] "character"
```
vs.


```r
x[idi]
```

```
$three
[1] "mango"     "banana"    "tangerine"
```

```r
class(x[idi])
```

```
[1] "list"
```

Extract multiple list elements with single brackets, as expected:


```r
x[2:3]
```

```
$two
 [1] 19.3 43.7  9.0 59.0 40.4 23.8 13.6 77.3 27.4  3.8

$three
[1] "mango"     "banana"    "tangerine"
```

```r
class(x[2:3])
```

```
[1] "list"
```

Beware (confusing) recursive indexing.  
(This is probably rarely used).  
Unlike in the single brackets example above, colon notation in double brackets accesses elements recursively at the given position.  
The following extracts the 3rd element of the 2nd element of the list:


```r
x[[2:3]]
```

```
[1] 9
```

You can convert a list to one lone vector containing all the individual components of the original list using `unlist()`. Notice how names are automatically created based on the original structure:


```r
(x <- list(alpha = sample(seq(100), 10),
          beta = sample(seq(100), 10),
          gamma = sample(seq(100), 10)))
```

```
$alpha
 [1] 63  5 10 83 98 30 24 79 34 66

$beta
 [1] 50 56 75 85 47 68 43 28 79 34

$gamma
 [1] 63 50 72 44 65 86  6 76 56 20
```

```r
unlist(x)
```

```
 alpha1  alpha2  alpha3  alpha4  alpha5  alpha6  alpha7  alpha8  alpha9 alpha10 
     63       5      10      83      98      30      24      79      34      66 
  beta1   beta2   beta3   beta4   beta5   beta6   beta7   beta8   beta9  beta10 
     50      56      75      85      47      68      43      28      79      34 
 gamma1  gamma2  gamma3  gamma4  gamma5  gamma6  gamma7  gamma8  gamma9 gamma10 
     63      50      72      44      65      86       6      76      56      20 
```

### Logical index {#idllist}

We can use a logical index on a list as well:


```r
x[c(T, F, T, F)]
```

```
$alpha
 [1] 63  5 10 83 98 30 24 79 34 66

$gamma
 [1] 63 50 72 44 65 86  6 76 56 20
```

## Data frames {#indexdfs}

We've already seen above that a data frame can be indexed in the same ways as a matrix.  
At the same time, we know that a data frame is a rectangular list. Like a list, its elements are vectors of any type (integer, double, character, factor, and more) but, unlike a list, they have to be of the same length. A data frame can also be indexed the same way as a list.  
Similar to indexing a list, notice that some methods return a smaller data frame, while others return vectors.  

<div class="rmdtip">
<p>You can index a data frame using all the ways you can index a list and all the ways you can index a matrix.</p>
</div>

Let's create a simple data frame:


```r
x <- data.frame(Feat_1 = 21:25,
                Feat_2 = rnorm(5),
                Feat_3 = paste0("rnd_", sample(seq(100), 5)))
x
```

```
  Feat_1      Feat_2 Feat_3
1     21  0.32486737 rnd_37
2     22  0.70125433 rnd_54
3     23 -0.08201909  rnd_2
4     24 -0.24750644 rnd_74
5     25  0.60954856 rnd_28
```

### Extract column(s)

Just like in a list, using the `$` operator returns an element, i.e. a **vector**:


```r
x$Feat_2
```

```
[1]  0.32486737  0.70125433 -0.08201909 -0.24750644  0.60954856
```

```r
class(x$Feat_2)
```

```
[1] "numeric"
```

Accessing a column by name with square brackets, returns a single-column **data.frame**:


```r
x["Feat_2"]
```

```
       Feat_2
1  0.32486737
2  0.70125433
3 -0.08201909
4 -0.24750644
5  0.60954856
```

```r
class(x["Feat_2"])
```

```
[1] "data.frame"
```

Again, similar to a list, if you double the square brackets, you access the element within the data.frame, which is a vector:


```r
x[["Feat_2"]]
```

```
[1]  0.32486737  0.70125433 -0.08201909 -0.24750644  0.60954856
```

Accessing a column by `[row, column]` either by position or name, return a vector by default:


```r
x[, 2]
```

```
[1]  0.32486737  0.70125433 -0.08201909 -0.24750644  0.60954856
```

```r
class(x[, 2])
```

```
[1] "numeric"
```

```r
x[, "Feat_2"]
```

```
[1]  0.32486737  0.70125433 -0.08201909 -0.24750644  0.60954856
```

```r
class(x[, "Feat_2"])
```

```
[1] "numeric"
```

The above happens, because by default the argument `drop` is set to `TRUE`. Set it to `FALSE` to return a `data.frame`:


```r
class(x[, 2, drop = FALSE])
```

```
[1] "data.frame"
```

```r
class(x[, "Feat_2", drop = FALSE])
```

```
[1] "data.frame"
```

As in lists, with the exception of the `$` notation, all other indexing and slicing operations work with a variable holding either a column name of or an integer location:


```r
idi <- 2
idc <- "Feat_2"
x[idi]
```

```
       Feat_2
1  0.32486737
2  0.70125433
3 -0.08201909
4 -0.24750644
5  0.60954856
```

```r
x[idc]
```

```
       Feat_2
1  0.32486737
2  0.70125433
3 -0.08201909
4 -0.24750644
5  0.60954856
```

```r
x[[idi]]
```

```
[1]  0.32486737  0.70125433 -0.08201909 -0.24750644  0.60954856
```

```r
x[[idc]]
```

```
[1]  0.32486737  0.70125433 -0.08201909 -0.24750644  0.60954856
```

```r
x[, idi]
```

```
[1]  0.32486737  0.70125433 -0.08201909 -0.24750644  0.60954856
```

```r
x[, idc]
```

```
[1]  0.32486737  0.70125433 -0.08201909 -0.24750644  0.60954856
```

```r
x[, idi, drop = F]
```

```
       Feat_2
1  0.32486737
2  0.70125433
3 -0.08201909
4 -0.24750644
5  0.60954856
```

```r
x[, idc, drop = F]
```

```
       Feat_2
1  0.32486737
2  0.70125433
3 -0.08201909
4 -0.24750644
5  0.60954856
```

Extracting multiple columns returns a data frame:


```r
x[, 2:3]
```

```
       Feat_2 Feat_3
1  0.32486737 rnd_37
2  0.70125433 rnd_54
3 -0.08201909  rnd_2
4 -0.24750644 rnd_74
5  0.60954856 rnd_28
```

```r
class(x[, 2:3])
```

```
[1] "data.frame"
```

### Extract rows

A row is a small data.frame, since it contains multiple columns:


```r
x[1, ]
```

```
  Feat_1    Feat_2 Feat_3
1     21 0.3248674 rnd_37
```

```r
class(x[1, ])
```

```
[1] "data.frame"
```

Convert into a list using `c()`:


```r
c(x[1, ])
```

```
$Feat_1
[1] 21

$Feat_2
[1] 0.3248674

$Feat_3
[1] "rnd_37"
```

```r
class(c(x[1, ]))
```

```
[1] "list"
```

Convert into a (named) vector using `unlist()`:


```r
unlist(x[1, ])
```

```
             Feat_1              Feat_2              Feat_3 
               "21" "0.324867365782229"            "rnd_37" 
```

```r
class(unlist(x[1, ]))
```

```
[1] "character"
```

### Logical index {#dfidl}


```r
x[x$Feat_1 > 22, ]
```

```
  Feat_1      Feat_2 Feat_3
3     23 -0.08201909  rnd_2
4     24 -0.24750644 rnd_74
5     25  0.60954856 rnd_28
```

## Logical <-> Integer indexing

As we saw, there are two types of indexes/indices: integer and logical.  

<div class="rmdnote">
<ul>
<li><p>A logical index needs to be of the same dimensions as the object it is indexing (unless you really want to recycle values - see chapter on <a href="#vectorization">vectorization</a>):<br />
you are specifying whether to include or exclude each element</p></li>
<li><p>An integer index will be shorter than the object it is indexing: you are specifying which subset of elements to include (or with a <code>-</code> in front, which elements to exclude)</p></li>
</ul>
</div>

It's easy to convert between the two types.  

For example, start with a sequence of integers:


```r
x <- 21:30
x
```

```
 [1] 21 22 23 24 25 26 27 28 29 30
```

Let's create a logical index based on two inequalities:


```r
logical_index <- x > 23 & x < 28
logical_index
```

```
 [1] FALSE FALSE FALSE  TRUE  TRUE  TRUE  TRUE FALSE FALSE FALSE
```

### Logical to integer index with `which()`:


<div class="rmdcaution">
<p>The common mistake is to attempt to convert a logical index to an integer index using <code>as.integer()</code>. This results in a vector of 1’s and 0’s, NOT an integer index.<br />
<code>which()</code> converts a logical index to an integer index.</p>
</div>

`which()` literally gives the position of all `TRUE` elements in a vector, thus converting a logical to an integer index:


```r
integer_index <- which(logical_index)
integer_index
```

```
[1] 4 5 6 7
```
i.e. positions 4, 5, 6, 7 of the `logical_index` are TRUE


<div class="rmdnote">
<p>A logical and an integer index are equivalent if they select the exact same elements</p>
</div>

Let's check than when used to index `x`, they both return the same result:


```r
x[logical_index]
```

```
[1] 24 25 26 27
```

```r
x[integer_index]
```

```
[1] 24 25 26 27
```

```r
all(x[logical_index] == x[integer_index])
```

```
[1] TRUE
```

### Integer to logical index

On the other hand, if we want to convert an integer index to a logical index, we can begin with a logical vector of the same length or dimension as the object we want to index with all FALSE values:


```r
logical_index_too <- vector(length = length(x))
logical_index_too
```

```
 [1] FALSE FALSE FALSE FALSE FALSE FALSE FALSE FALSE FALSE FALSE
```

And use the integer index to replace the corresponding elements to TRUE:


```r
logical_index_too[integer_index] <- TRUE
logical_index_too
```

```
 [1] FALSE FALSE FALSE  TRUE  TRUE  TRUE  TRUE FALSE FALSE FALSE
```
This, of course, is the same as the logical index we started with.


```r
all(logical_index == logical_index_too)
```

```
[1] TRUE
```

## Exclude cases using an index

Very often, we want to use an index, whether logical or integer, to exclude cases instead of to select cases.  
To do that with a logical integer, we simply use an exclamation point in front of the index to negate each element (convert each TRUE to FALSE and each FALSE to TRUE):


```r
logical_index
```

```
 [1] FALSE FALSE FALSE  TRUE  TRUE  TRUE  TRUE FALSE FALSE FALSE
```

```r
!logical_index
```

```
 [1]  TRUE  TRUE  TRUE FALSE FALSE FALSE FALSE  TRUE  TRUE  TRUE
```


```r
x[!logical_index]
```

```
[1] 21 22 23 28 29 30
```

To exclude elements using an integer index, R allows you to use negative indexing:


```r
x[-integer_index]
```

```
[1] 21 22 23 28 29 30
```

<div class="rmdnote">
<p>To get the complement of an index, you negate a logical index (<code>!logical_index</code>) or you subtract an integer index (<code>-integer_index</code>):</p>
</div>

## `subset()`

`subset()` allows you to filter cases that meet certain conditions using the `subset` argument, and optionally also select columns using the `select` argument:  

(`head()` returns the first few lines of a data frame. We use it to avoid printing too many lines)


```r
head(iris)
```

```
  Sepal.Length Sepal.Width Petal.Length Petal.Width Species
1          5.1         3.5          1.4         0.2  setosa
2          4.9         3.0          1.4         0.2  setosa
3          4.7         3.2          1.3         0.2  setosa
4          4.6         3.1          1.5         0.2  setosa
5          5.0         3.6          1.4         0.2  setosa
6          5.4         3.9          1.7         0.4  setosa
```

```r
iris_sl.gt.med <- subset(iris, Sepal.Length > median(Sepal.Length))
```

Note: You can use the column name Sepal.Length directly, i.e. unquoted and you don't need to use `iris$Sepal.Length`. (This is called Non-Standard Evaluation, NSE)


```r
x <- data.frame(one = 1:10,
                two = rnorm(10),
                group = c(rep("alpha", 4),  rep("beta", 6)))
subset(x, subset = two > 0, select = two)
```

```
         two
1  0.3610997
2  0.9541543
4  0.2316539
5  1.2465727
10 2.4799577
```

```r
subset(x, two > 0, -one)
```

```
         two group
1  0.3610997 alpha
2  0.9541543 alpha
4  0.2316539 alpha
5  1.2465727  beta
10 2.4799577  beta
```

```r
subset(x, two > 0, two:one)
```

```
         two one
1  0.3610997   1
2  0.9541543   2
4  0.2316539   4
5  1.2465727   5
10 2.4799577  10
```

```r
subset(x, two > 0, two:group)
```

```
         two group
1  0.3610997 alpha
2  0.9541543 alpha
4  0.2316539 alpha
5  1.2465727  beta
10 2.4799577  beta
```

## `split()`

Split a data frame into multiple data frames by groups defined by a factor:


```r
x_by_group <- split(x, x$group)
```

## `with()`

Within a `with()` expression, you can access data.frame columns without quoting or using the `$` operator:


```r
with(x, x[group == "alpha", ])
```

```
  one        two group
1   1  0.3610997 alpha
2   2  0.9541543 alpha
3   3 -0.2384525 alpha
4   4  0.2316539 alpha
```

```r
with(x, x[two > 0, ])
```

```
   one       two group
1    1 0.3610997 alpha
2    2 0.9541543 alpha
4    4 0.2316539 alpha
5    5 1.2465727  beta
10  10 2.4799577  beta
```
