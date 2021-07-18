# Data Structures {#structures}



There are 5 main data structures in R:  

* **Vector**: 1-dimensional; homogeneous collection
* **Matrix**: 2-dimensional; homogeneous collection
* **Array**: N-dimensional; homogeneous collection
* **List**: 1-dimensional, but can be nested; heterogeneous collection
* **Data frame**: 2-dimensional: A special type of list; heterogeneous collection of columns

Homogeneous vs. hetereogeneous refers to the kind of data types (integer, double, character, logical, factor, etc.) that a structure can hold. This means a matrix can hold only numbers or only characters, but a data frame can hold different types in different columns. That is why data frames are very popular data structure for statistical work.

<div class="figure" style="text-align: center">
<img src="./R_datastructures.png" alt="R Data Structure summary - Best to read through this chapter first and then refer back to this figure" width="100%" />
<p class="caption">(\#fig:FigRDataStructures)R Data Structure summary - Best to read through this chapter first and then refer back to this figure</p>
</div>

<div class="rmdtip">
<p><strong>Check object class with <code>class()</code> and/or <code>str()</code>.</strong></p>
</div>

## Initialize - coerce - test (structures)

The following summary table lists the functions to *initialize*, *coerce* (=convert), and *test* the core data structures, which are shown in more detail in the following paragraphs:

| **Initialize**  | **Coerce**         | **Test**           |
|----------------:|-------------------:|-------------------:|
| `vector(n)`     | `as.vector(x)`     | `is.vector(x)`     |
| `matrix(n)`     | `as.matrix(x)`     | `is.matrix(x)`     |
| `array(n)`      | `as.array(x)`      | `is.array(x)`      |
| `list(n)`       | `as.list(x)`       | `is.list(x)`       |
| `data.frame(n)` | `as.data.frame(x)` | `is.data.frame(x)` |

## Vectors

A vector is the basic structure that contains data in R. Other structures that contain data are made up of one or more vectors.


```r
(x <- c(1, 3, 5, 7))
```

```
[1] 1 3 5 7
```

```r
class(x)
```

```
[1] "numeric"
```

```r
typeof(x)
```

```
[1] "double"
```

A vector has `length()` but no `dim()`:


```r
length(x)
```

```
[1] 4
```

```r
dim(x)
```

```
NULL
```


```r
(x2 <- 1:10)
```

```
 [1]  1  2  3  4  5  6  7  8  9 10
```

```r
(x3 <- rnorm(10))
```

```
 [1]  0.2281925  1.1028625  0.2942686  0.7183776  0.1772955 -0.5592790
 [7]  0.9804452 -1.0775334 -0.4524279  0.1418661
```

```r
(x4 <- seq(0, 1, .1))
```

```
 [1] 0.0 0.1 0.2 0.3 0.4 0.5 0.6 0.7 0.8 0.9 1.0
```

```r
seq(10)
```

```
 [1]  1  2  3  4  5  6  7  8  9 10
```

```r
(x5 <- sample(seq(100), 20))
```

```
 [1]  4 55 40 24 46 81 41 34 59 37 82 73 79  8 56 25 30 88 69 35
```

### Generating sequences with `seq()`

1. from, to, by


```r
seq(1, 10, .5)
```

```
 [1]  1.0  1.5  2.0  2.5  3.0  3.5  4.0  4.5  5.0  5.5  6.0  6.5  7.0  7.5  8.0
[16]  8.5  9.0  9.5 10.0
```

2. 1:n


```r
(seq(12))
```

```
 [1]  1  2  3  4  5  6  7  8  9 10 11 12
```

```r
# or 
(seq_len(12))
```

```
 [1]  1  2  3  4  5  6  7  8  9 10 11 12
```

```r
# is same as
1:12
```

```
 [1]  1  2  3  4  5  6  7  8  9 10 11 12
```

3. Along the length of another object


```r
seq_along(iris)
```

```
[1] 1 2 3 4 5
```

```r
1:ncol(iris)
```

```
[1] 1 2 3 4 5
```

4. `from`, `to` with length `n`


```r
seq(-5, 12, length.out = 11)
```

```
 [1] -5.0 -3.3 -1.6  0.1  1.8  3.5  5.2  6.9  8.6 10.3 12.0
```

### Initializing a vector


```r
x <- vector(length = 10)
x <- vector("numeric", 10)
x <- vector("list", 10)
```

## Matrices

A matrix is a **vector with 2 dimensions**.  

To create a matrix, you pass a vector to the `matrix()` command and specify number of rows using `nrow` and/or number of columns using `ncol`:


```r
x <- matrix(sample(seq(1000), 30),
            nrow = 10, ncol = 3)
x
```

```
      [,1] [,2] [,3]
 [1,]  775  859  723
 [2,]   90  958  719
 [3,]  225  410  849
 [4,]  521   64  741
 [5,]  896   21  456
 [6,]  769  702  328
 [7,]  104  807  863
 [8,]  340  693  757
 [9,]    1  934  737
[10,]  227  648  552
```

```r
class(x)
```

```
[1] "matrix" "array" 
```

<div class="rmdnote">
<p>A matrix has length (<code>length(x)</code>) equal to the number of all (i, j) elements or nrow * ncol (if <code>i</code> is the row index and <code>j</code> is the column index) and dimensions (<code>dim(x)</code>) as expected:</p>
</div>


```r
length(x)
```

```
[1] 30
```

```r
dim(x)
```

```
[1] 10  3
```

```r
nrow(x)
```

```
[1] 10
```

```r
ncol(x)
```

```
[1] 3
```

### Construct by row or by column

By default, vectors are constructed by column (byrow = FALSE)


```r
x <- matrix(1:20, nrow = 10, ncol = 2, byrow = FALSE)
x
```

```
      [,1] [,2]
 [1,]    1   11
 [2,]    2   12
 [3,]    3   13
 [4,]    4   14
 [5,]    5   15
 [6,]    6   16
 [7,]    7   17
 [8,]    8   18
 [9,]    9   19
[10,]   10   20
```


```r
x <- matrix(1:20, nrow = 10, ncol = 2, byrow = TRUE)
x
```

```
      [,1] [,2]
 [1,]    1    2
 [2,]    3    4
 [3,]    5    6
 [4,]    7    8
 [5,]    9   10
 [6,]   11   12
 [7,]   13   14
 [8,]   15   16
 [9,]   17   18
[10,]   19   20
```

### Initialize a matrix


```r
(x <- matrix(NA, nrow = 6, ncol = 4))
```

```
     [,1] [,2] [,3] [,4]
[1,]   NA   NA   NA   NA
[2,]   NA   NA   NA   NA
[3,]   NA   NA   NA   NA
[4,]   NA   NA   NA   NA
[5,]   NA   NA   NA   NA
[6,]   NA   NA   NA   NA
```

```r
(x <- matrix(0, nrow = 6, ncol = 4))
```

```
     [,1] [,2] [,3] [,4]
[1,]    0    0    0    0
[2,]    0    0    0    0
[3,]    0    0    0    0
[4,]    0    0    0    0
[5,]    0    0    0    0
[6,]    0    0    0    0
```

### Bind vectors by column or by row

Use `cbind` ("column-bind") to convert a set of input vectors to columns of a **matrix**. The vectors must be of the same length:


```r
x <- cbind(1:10, 11:20, 41:50)
x
```

```
      [,1] [,2] [,3]
 [1,]    1   11   41
 [2,]    2   12   42
 [3,]    3   13   43
 [4,]    4   14   44
 [5,]    5   15   45
 [6,]    6   16   46
 [7,]    7   17   47
 [8,]    8   18   48
 [9,]    9   19   49
[10,]   10   20   50
```

```r
class(x)
```

```
[1] "matrix" "array" 
```

Similarly, you can use `rbind` ("row-bind") to convert a set of input vectors to rows of a **matrix**. The vectors again must be of the same length:


```r
x <- rbind(1:10, 11:20, 41:50)
x
```

```
     [,1] [,2] [,3] [,4] [,5] [,6] [,7] [,8] [,9] [,10]
[1,]    1    2    3    4    5    6    7    8    9    10
[2,]   11   12   13   14   15   16   17   18   19    20
[3,]   41   42   43   44   45   46   47   48   49    50
```

```r
class(x)
```

```
[1] "matrix" "array" 
```

### Combine matrices
`cbind()` and `rbind()` can be used to combine two or more matrices together - or vector and matrices:


```r
cbind(matrix(1, 5, 2), matrix(2, 5, 4))
```

```
     [,1] [,2] [,3] [,4] [,5] [,6]
[1,]    1    1    2    2    2    2
[2,]    1    1    2    2    2    2
[3,]    1    1    2    2    2    2
[4,]    1    1    2    2    2    2
[5,]    1    1    2    2    2    2
```

## Arrays

Arrays are **vectors with dimensions**.  
You can have 1D, 2D or any-D, i.e. ND arrays.

### 1D array

A 1D array is just like a vector but of class `array` and with `dim(x)` equal to `length(x)` (remember, vectors have only `length(x)` and undefined `dim(x)`):


```r
x <- 1:10
xa <- array(1:10, dim = 10)
class(x)
```

```
[1] "integer"
```

```r
is.vector(x)
```

```
[1] TRUE
```

```r
length(x)
```

```
[1] 10
```

```r
dim(x)
```

```
NULL
```

```r
class(xa)
```

```
[1] "array"
```

```r
is.vector(xa)
```

```
[1] FALSE
```

```r
length(xa)
```

```
[1] 10
```

```r
dim(xa)
```

```
[1] 10
```

It is quite unlikely you will need to use a 1D array instead of a vector.

### 2D array

A 2D array is a matrix:


```r
x <- array(1:40, dim = c(10, 4))
class(x)
```

```
[1] "matrix" "array" 
```

```r
dim(x)
```

```
[1] 10  4
```

### ND array

You can build an N-dimensional array:


```r
(x <- array(1:60, dim = c(5, 4, 3)))
```

```
, , 1

     [,1] [,2] [,3] [,4]
[1,]    1    6   11   16
[2,]    2    7   12   17
[3,]    3    8   13   18
[4,]    4    9   14   19
[5,]    5   10   15   20

, , 2

     [,1] [,2] [,3] [,4]
[1,]   21   26   31   36
[2,]   22   27   32   37
[3,]   23   28   33   38
[4,]   24   29   34   39
[5,]   25   30   35   40

, , 3

     [,1] [,2] [,3] [,4]
[1,]   41   46   51   56
[2,]   42   47   52   57
[3,]   43   48   53   58
[4,]   44   49   54   59
[5,]   45   50   55   60
```

```r
class(x)
```

```
[1] "array"
```
You can provide names for each dimensions using the `dimnames` argument. It accepts a list where each elements is a character vector of legth equal to the dimension length. Using the same example as above, we pass three character vector of length 5, 4, and 3 to match the length of the dimensions:


```r
x <- array(1:60,
            dim = c(5, 4, 3),
            dimnames = list(letters[1:5],
                            c("alpha", "beta", "gamma", "delta"),
                            c("x", "y", "z")))
```

3D arrays can be used to represent color images. Here, just for fun, we use `rasterImage` to show how you would visualize such an image:


```r
x <- array(sample(1:255, 432, TRUE), dim = c(12, 12, 3))
par("pty")
```

```
[1] "m"
```

```r
par(pty = "s")
plot(NULL, NULL,
     xlim = c(0, 100), ylim = c(0, 100),
     axes = F, ann = F, pty = "s")
rasterImage(x/255, 0, 0, 100, 100)
```

<img src="08-DataStructures_files/figure-html/unnamed-chunk-24-1.png" width="960" />

## Lists

To define a list, we use `list()` to pass any number of objects.  
If these objects are passed as named arguments, the names will rename as element names:


```r
x <- list(one = 1:4,
          two = sample(seq(0, 100, .1), 10),
          three = c("mango", "banana", "tangerine"),
          four = median)
class(x)
```

```
[1] "list"
```

```r
str(x)
```

```
List of 4
 $ one  : int [1:4] 1 2 3 4
 $ two  : num [1:10] 36 87.4 25.8 16.3 9.6 87.7 45.7 65 61.2 31.1
 $ three: chr [1:3] "mango" "banana" "tangerine"
 $ four :function (x, na.rm = FALSE, ...)  
```

### Nested lists

Since each element can be any object at all, it is simple to build a nested list:


```r
x <- list(alpha = letters[sample(26, 4)],
          beta = sample(12),
          gamma = list(i = rnorm(10),
                       j = runif(10),
                       j = seq(0, 1000, length.out = 10)))
x
```

```
$alpha
[1] "b" "w" "k" "i"

$beta
 [1]  3  9  7  8  2 11 10 12  1  6  5  4

$gamma
$gamma$i
 [1]  1.612901811  0.607746017 -0.680081287 -0.001043907  1.517339177
 [6]  0.917328945 -1.532191188  0.221988037  0.244443591  1.327159248

$gamma$j
 [1] 0.94858370 0.68754591 0.23983337 0.76477570 0.21280491 0.08073839
 [7] 0.51003002 0.38106618 0.77052183 0.08827202

$gamma$j
 [1]    0.0000  111.1111  222.2222  333.3333  444.4444  555.5556  666.6667
 [8]  777.7778  888.8889 1000.0000
```


### Initialize a list


```r
x <- vector("list", 4)
x
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

### Combine lists

You can combine lists with `c()` (just like vectors):


```r
l1 <- list(q = 11:14, r = letters[11:14])
l2 <- list(s = LETTERS[21:24], t = 100:97)
(x <- c(l1, l2))
```

```
$q
[1] 11 12 13 14

$r
[1] "k" "l" "m" "n"

$s
[1] "U" "V" "W" "X"

$t
[1] 100  99  98  97
```

```r
length(x)
```

```
[1] 4
```

### Mixing types with `c()`

It's best to use `c()` to either combine elements of the same type into a vector, or to combine lists, otherwise you must inspect the outcome to be certain it was as intended.  

As we've seen, if all arguments passed to `c()` are of a single type, you get a vector of that type:


```r
(x <- c(12.9, 94.67, 23.74, 46.901))
```

```
[1] 12.900 94.670 23.740 46.901
```

```r
class(x)
```

```
[1] "numeric"
```
If arguments passed to `c()` are a mix of numeric and character, they all get ***coerced to character***. 


```r
(x <- c(23.54, "mango", "banana", 75))
```

```
[1] "23.54"  "mango"  "banana" "75"    
```

```r
class(x)
```

```
[1] "character"
```

If you pass more types of objects (which cannot be coerced to character) you get a list, since it is the only structure that can support all of them together:


```r
(x <- c(42, mean, "potatoes"))
```

```
[[1]]
[1] 42

[[2]]
function (x, ...) 
UseMethod("mean")
<bytecode: 0x7fb471ef4388>
<environment: namespace:base>

[[3]]
[1] "potatoes"
```

```r
class(x)
```

```
[1] "list"
```

<div class="rmdnote">
<p>Other than concatenating vectors of the same type or lists into a larger list, it probably best to avoid using <code>c()</code> and directly constructing the object you want using, e.g. <code>list()</code>.</p>
</div>

##  Data frames

<div class="rmdnote">
<p>A data frames is a <strong>special type of list</strong> where each element has the same length and forms a column, resulting in a 2D structure. Unlike matrices, each column can contain a different data type.</p>
</div>


```r
x <- data.frame(Feat_1 = 1:5,
                Feat_2 = rnorm(5),
                Feat_3 = paste0("rnd_", sample(seq(100), 5)))
x
```

```
  Feat_1      Feat_2 Feat_3
1      1  0.01530612 rnd_89
2      2 -1.44659523 rnd_24
3      3 -1.27083971  rnd_8
4      4 -0.88029316 rnd_33
5      5 -0.67147436 rnd_11
```

```r
class(x)
```

```
[1] "data.frame"
```

```r
str(x)
```

```
'data.frame':	5 obs. of  3 variables:
 $ Feat_1: int  1 2 3 4 5
 $ Feat_2: num  0.0153 -1.4466 -1.2708 -0.8803 -0.6715
 $ Feat_3: chr  "rnd_89" "rnd_24" "rnd_8" "rnd_33" ...
```

```r
class(x$Feat_1)
```

```
[1] "integer"
```


```r
mat <- matrix(1:100, 10)
length(mat)
```

```
[1] 100
```

```r
df <- as.data.frame(mat)
length(df)
```

```
[1] 10
```

## Attributes

R objects may have some builtin attributes but you can add arbitrary attributes to any R object. These are used to store additional information, sometimes called metadata.  

### Print all attributes

To print an object's attributes, use `attributes`:


```r
attributes(iris)
```

```
$names
[1] "Sepal.Length" "Sepal.Width"  "Petal.Length" "Petal.Width"  "Species"     

$class
[1] "data.frame"

$row.names
  [1]   1   2   3   4   5   6   7   8   9  10  11  12  13  14  15  16  17  18
 [19]  19  20  21  22  23  24  25  26  27  28  29  30  31  32  33  34  35  36
 [37]  37  38  39  40  41  42  43  44  45  46  47  48  49  50  51  52  53  54
 [55]  55  56  57  58  59  60  61  62  63  64  65  66  67  68  69  70  71  72
 [73]  73  74  75  76  77  78  79  80  81  82  83  84  85  86  87  88  89  90
 [91]  91  92  93  94  95  96  97  98  99 100 101 102 103 104 105 106 107 108
[109] 109 110 111 112 113 114 115 116 117 118 119 120 121 122 123 124 125 126
[127] 127 128 129 130 131 132 133 134 135 136 137 138 139 140 141 142 143 144
[145] 145 146 147 148 149 150
```

This returns a named list. In this case we got names, class, and row.names of the iris data frame.  

### Get or set specific attributes

You can assign new attributes using `attr`:


```r
(x <- c(1:10))
```

```
 [1]  1  2  3  4  5  6  7  8  9 10
```

```r
attr(x, "name") <- "Very special vector"
```

Printing the vector after adding a new attribute, prints the attribute name and value underneath the vector itself:


```r
x
```

```
 [1]  1  2  3  4  5  6  7  8  9 10
attr(,"name")
[1] "Very special vector"
```

Our trusty `str` function will print attributes as well


```r
str(x)
```

```
 int [1:10] 1 2 3 4 5 6 7 8 9 10
 - attr(*, "name")= chr "Very special vector"
```

#### A matrix is a vector - a closer look

Let's see how a matrix is literally just a vector with assigned dimensions.  
Start with a vector of length 20:


```r
x <- 1:20
x
```

```
 [1]  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20
```
The vector has no attributes - yet:


```r
attributes(x)
```

```
NULL
```
To convert to a matrix, we would normally pass our vector to the `matrix()` function and define number of rows and/or columns:


```r
xm <- matrix(x, 5)
xm
```

```
     [,1] [,2] [,3] [,4]
[1,]    1    6   11   16
[2,]    2    7   12   17
[3,]    3    8   13   18
[4,]    4    9   14   19
[5,]    5   10   15   20
```

```r
attributes(xm)
```

```
$dim
[1] 5 4
```

Just for demonstration, let's instead directly add a dimension attribute to our vector:


```r
attr(x, "dim") <- c(5, 4)
x
```

```
     [,1] [,2] [,3] [,4]
[1,]    1    6   11   16
[2,]    2    7   12   17
[3,]    3    8   13   18
[4,]    4    9   14   19
[5,]    5   10   15   20
```

```r
class(x)
```

```
[1] "matrix" "array" 
```

Just like that, we have a matrix.

### Common builtin attributes

Vectors can have named elements. A new vector has no names, but you can add them:


```r
x <- rnorm(10)
names(x)
```

```
NULL
```

```r
names(x) <- paste0("Value", seq(x))
x
```

```
    Value1     Value2     Value3     Value4     Value5     Value6     Value7 
-0.2664962 -0.3417241  0.2375586 -0.9246520 -0.4278786  1.3263591  0.8974578 
    Value8     Value9    Value10 
 1.0546539  0.4859710 -1.2453742 
```

Matrices and data frames can have column names (`colnames`) and row names (`rownames`):


```r
x <- matrix(1:15, 5)
colnames(x)
```

```
NULL
```

```r
rownames(x)
```

```
NULL
```

```r
colnames(x) <- paste0("Feature", seq(3))
rownames(x) <- paste0("Case", seq(5))
x
```

```
      Feature1 Feature2 Feature3
Case1        1        6       11
Case2        2        7       12
Case3        3        8       13
Case4        4        9       14
Case5        5       10       15
```

Lists are vectors so they have `names`. These can be defined when a list is created using the name-value pairs or added/changed at any time.


```r
x <- list(HospitalName = "CaliforniaGeneral",
          ParticipatingDepartments = c("Neurology", "Psychiatry", "Neurosurgery"),
          PatientIDs = 1001:1253)
names(x)
```

```
[1] "HospitalName"             "ParticipatingDepartments"
[3] "PatientIDs"              
```

Add/Change names:


```r
names(x) <- c("Hospital", "Departments", "PIDs")
x
```

```
$Hospital
[1] "CaliforniaGeneral"

$Departments
[1] "Neurology"    "Psychiatry"   "Neurosurgery"

$PIDs
  [1] 1001 1002 1003 1004 1005 1006 1007 1008 1009 1010 1011 1012 1013 1014 1015
 [16] 1016 1017 1018 1019 1020 1021 1022 1023 1024 1025 1026 1027 1028 1029 1030
 [31] 1031 1032 1033 1034 1035 1036 1037 1038 1039 1040 1041 1042 1043 1044 1045
 [46] 1046 1047 1048 1049 1050 1051 1052 1053 1054 1055 1056 1057 1058 1059 1060
 [61] 1061 1062 1063 1064 1065 1066 1067 1068 1069 1070 1071 1072 1073 1074 1075
 [76] 1076 1077 1078 1079 1080 1081 1082 1083 1084 1085 1086 1087 1088 1089 1090
 [91] 1091 1092 1093 1094 1095 1096 1097 1098 1099 1100 1101 1102 1103 1104 1105
[106] 1106 1107 1108 1109 1110 1111 1112 1113 1114 1115 1116 1117 1118 1119 1120
[121] 1121 1122 1123 1124 1125 1126 1127 1128 1129 1130 1131 1132 1133 1134 1135
[136] 1136 1137 1138 1139 1140 1141 1142 1143 1144 1145 1146 1147 1148 1149 1150
[151] 1151 1152 1153 1154 1155 1156 1157 1158 1159 1160 1161 1162 1163 1164 1165
[166] 1166 1167 1168 1169 1170 1171 1172 1173 1174 1175 1176 1177 1178 1179 1180
[181] 1181 1182 1183 1184 1185 1186 1187 1188 1189 1190 1191 1192 1193 1194 1195
[196] 1196 1197 1198 1199 1200 1201 1202 1203 1204 1205 1206 1207 1208 1209 1210
[211] 1211 1212 1213 1214 1215 1216 1217 1218 1219 1220 1221 1222 1223 1224 1225
[226] 1226 1227 1228 1229 1230 1231 1232 1233 1234 1235 1236 1237 1238 1239 1240
[241] 1241 1242 1243 1244 1245 1246 1247 1248 1249 1250 1251 1252 1253
```

Remember that data a frame is a special type of list. Therefore in data frames `colnames` and `names` are equivalent:


```r
colnames(iris)
```

```
[1] "Sepal.Length" "Sepal.Width"  "Petal.Length" "Petal.Width"  "Species"     
```

```r
names(iris)
```

```
[1] "Sepal.Length" "Sepal.Width"  "Petal.Length" "Petal.Width"  "Species"     
```

Note: As we saw, matrices have `colnames` and `rownames.` Using `names` on a matrix will assign names to *individual elements*, as if it was a long vector - this is not usually very useful.
