# Working with data frames {#dataframes}



## Table Joins (i.e. Merging data.frames)

Scenario: You have received two or more tables with data. Each table consists of a unique identifier (ID), which is shared among the tables, plus a number of variables in columns, which may be unique to each table. You want to merge them into one big table so that for each ID you have all available information.  

Let's make up some data:


```r
a <- data.frame(PID = c(1:9),
                Hospital = c("UCSF", "HUP", "Stanford",
                             "Stanford", "UCSF", "HUP", 
                             "HUP", "Stanford", "UCSF"),
                Age = c(22, 34, 41, 19, 53, 21, 63, 22, 19),
                Sex = c(1, 1, 0, 1, 0, 0, 1, 0, 0))

b  <- data.frame(PID = c(6:12),
                 V1 = c(153, 89, 112, 228,  91, 190, 101),
                 Department = c("Neurology", "Radiology",
                                "Emergency", "Cardiology",
                                "Surgery", "Neurology", "Psychiatry"))
a
```

```
  PID Hospital Age Sex
1   1     UCSF  22   1
2   2      HUP  34   1
3   3 Stanford  41   0
4   4 Stanford  19   1
5   5     UCSF  53   0
6   6      HUP  21   0
7   7      HUP  63   1
8   8 Stanford  22   0
9   9     UCSF  19   0
```

```r
b
```

```
  PID  V1 Department
1   6 153  Neurology
2   7  89  Radiology
3   8 112  Emergency
4   9 228 Cardiology
5  10  91    Surgery
6  11 190  Neurology
7  12 101 Psychiatry
```

```r
dim(a)
```

```
[1] 9 4
```

```r
dim(b)
```

```
[1] 7 3
```

There are four main types of join operations:

<div class="figure" style="text-align: center">
<img src="R_joins.png" alt="Common Join Operations" width="100%" />
<p class="caption">(\#fig:unnamed-chunk-3)Common Join Operations</p>
</div>

### Inner join

The default arguments of `merge()` perform an **inner join**:


```r
(ab.inner <- merge(a, b))
```

```
  PID Hospital Age Sex  V1 Department
1   6      HUP  21   0 153  Neurology
2   7      HUP  63   1  89  Radiology
3   8 Stanford  22   0 112  Emergency
4   9     UCSF  19   0 228 Cardiology
```

```r
# same as
(ab.inner <- merge(a, b, by = "PID"))
```

```
  PID Hospital Age Sex  V1 Department
1   6      HUP  21   0 153  Neurology
2   7      HUP  63   1  89  Radiology
3   8 Stanford  22   0 112  Emergency
4   9     UCSF  19   0 228 Cardiology
```

```r
# same as
(ab.inner <- merge(a, b, all = FALSE))
```

```
  PID Hospital Age Sex  V1 Department
1   6      HUP  21   0 153  Neurology
2   7      HUP  63   1  89  Radiology
3   8 Stanford  22   0 112  Emergency
4   9     UCSF  19   0 228 Cardiology
```

Note that the resulting table only contains cases found in both data frames (i.e. IDs 6 through 9)

### Outer join

You can perform an **outer join** by specifying `all = TRUE`:


```r
(ab.outer <- merge(a, b, all = TRUE))
```

```
   PID Hospital Age Sex  V1 Department
1    1     UCSF  22   1  NA       <NA>
2    2      HUP  34   1  NA       <NA>
3    3 Stanford  41   0  NA       <NA>
4    4 Stanford  19   1  NA       <NA>
5    5     UCSF  53   0  NA       <NA>
6    6      HUP  21   0 153  Neurology
7    7      HUP  63   1  89  Radiology
8    8 Stanford  22   0 112  Emergency
9    9     UCSF  19   0 228 Cardiology
10  10     <NA>  NA  NA  91    Surgery
11  11     <NA>  NA  NA 190  Neurology
12  12     <NA>  NA  NA 101 Psychiatry
```

```r
(ab.outer <- merge(a, b, by = "PID", all = TRUE))
```

```
   PID Hospital Age Sex  V1 Department
1    1     UCSF  22   1  NA       <NA>
2    2      HUP  34   1  NA       <NA>
3    3 Stanford  41   0  NA       <NA>
4    4 Stanford  19   1  NA       <NA>
5    5     UCSF  53   0  NA       <NA>
6    6      HUP  21   0 153  Neurology
7    7      HUP  63   1  89  Radiology
8    8 Stanford  22   0 112  Emergency
9    9     UCSF  19   0 228 Cardiology
10  10     <NA>  NA  NA  91    Surgery
11  11     <NA>  NA  NA 190  Neurology
12  12     <NA>  NA  NA 101 Psychiatry
```

Note that the resulting data frame contains all IDs found in either input data frame and missing values are represented with `NA`

### Left outer join

You can perform a **left outer join** by specifying `all.x = TRUE`:


```r
(ab.leftOuter <- merge(a, b, all.x = TRUE))
```

```
  PID Hospital Age Sex  V1 Department
1   1     UCSF  22   1  NA       <NA>
2   2      HUP  34   1  NA       <NA>
3   3 Stanford  41   0  NA       <NA>
4   4 Stanford  19   1  NA       <NA>
5   5     UCSF  53   0  NA       <NA>
6   6      HUP  21   0 153  Neurology
7   7      HUP  63   1  89  Radiology
8   8 Stanford  22   0 112  Emergency
9   9     UCSF  19   0 228 Cardiology
```

Note how the resulting data frame contains all IDs present in the left input data frame only. 

### Right outer join

You can perform a **right outer join** by specifying `all.y = TRUE`:


```r
(ab.rightOuter <- merge(a, b, all.y = TRUE))
```

```
  PID Hospital Age Sex  V1 Department
1   6      HUP  21   0 153  Neurology
2   7      HUP  63   1  89  Radiology
3   8 Stanford  22   0 112  Emergency
4   9     UCSF  19   0 228 Cardiology
5  10     <NA>  NA  NA  91    Surgery
6  11     <NA>  NA  NA 190  Neurology
7  12     <NA>  NA  NA 101 Psychiatry
```

Note how the resulting data frame contains all IDs present in the right input data frame only.

## Wide to Long

<div class="figure" style="text-align: center">
<img src="wide_long.png" alt="Wide and Long data format example. Take a moment to notice how the wide table on the left with 3 cases (3 IDs) and 3 variables gets converted from a 3 x 4 table to a 9 x 3 long table on the right. The values (outlined in magenta) are present once in each table: on the wide table they form an **ID x Variable** matrix, while on the long they are stacked on a **single column**. The IDs have to be repeated on the long table, once for each variable and there is a new 'Variable' column to provide the information present in the wide table's column names." width="100%" />
<p class="caption">(\#fig:wideLong)Wide and Long data format example. Take a moment to notice how the wide table on the left with 3 cases (3 IDs) and 3 variables gets converted from a 3 x 4 table to a 9 x 3 long table on the right. The values (outlined in magenta) are present once in each table: on the wide table they form an **ID x Variable** matrix, while on the long they are stacked on a **single column**. The IDs have to be repeated on the long table, once for each variable and there is a new 'Variable' column to provide the information present in the wide table's column names.</p>
</div>


```r
library(tidyr)
library(data.table)
```

Let's create an example data frame:


```r
(dat_wide <- data.frame(ID = c(1, 2, 3),
                       mango = c(1.1, 2.1, 3.1),
                       banana = c(1.2, 2.2, 3.2),
                       tangerine = c(1.3, 2.3, 3.3)))
```

```
  ID mango banana tangerine
1  1   1.1    1.2       1.3
2  2   2.1    2.2       2.3
3  3   3.1    3.2       3.3
```

### base

The `reshape()` function is probably one of the most complicated because the documentation is not clear, specifically with regards to which arguments refer to the input vs. output data frame. Use the following figure as a guide to understand `reshape()`'s syntax. You can use it as a reference when building your own `reshape()` command by following steps 1 through 5:

<div class="figure" style="text-align: center">
<img src="R_reshape_wide2long.png" alt="`reshape()` syntax for Wide to Long transformation." width="100%" />
<p class="caption">(\#fig:wideLongSyntax)`reshape()` syntax for Wide to Long transformation.</p>
</div>


```r
dat_wide2long <- reshape(# Data in wide format
                         data = dat_wide,
                         # The column name that defines case ID
                         idvar = "ID",
                         # The columns whose values we want to keep
                         varying = list(2:4),
                         # The name of the new column which will contain all 
                         # the values from the columns above
                         v.names = "Score",
                         # The values/names, of length = (N columns in "varying"), 
                         #that will be recycled to indicate which column from the 
                         #wide dataset each row corresponds to
                         times = c(colnames(dat_wide)[2:4]),
                         # The name of the new column created to hold the values 
                         # defined by "times"
                         timevar = "Fruit",                  
                         direction = "long") 
```

You can also define 'varying' with a character vector:  
`varying = list(c("mango", "banana","tangerine")`  

Explore the resulting data frame's attributes:


```r
attributes(dat_wide2long)
```

```
$row.names
[1] "1.mango"     "2.mango"     "3.mango"     "1.banana"    "2.banana"   
[6] "3.banana"    "1.tangerine" "2.tangerine" "3.tangerine"

$names
[1] "ID"    "Fruit" "Score"

$class
[1] "data.frame"

$reshapeLong
$reshapeLong$varying
$reshapeLong$varying[[1]]
[1] "mango"     "banana"    "tangerine"


$reshapeLong$v.names
[1] "Score"

$reshapeLong$idvar
[1] "ID"

$reshapeLong$timevar
[1] "Fruit"
```

These attributes and present if and only if a long data set was created from a wide as above. In that case, reshaping back to a wide data frame is as easy as:


```r
reshape(dat_wide2long)
```

```
        ID mango banana tangerine
1.mango  1   1.1    1.2       1.3
2.mango  2   2.1    2.2       2.3
3.mango  3   3.1    3.2       3.3
```

### tidyr


```r
dat_wide2long_tv <- pivot_longer(dat_wide,
                           cols = 2:4,
                           names_to = "Fruit",
                           values_to = "Score")
dat_wide2long_tv
```

```
# A tibble: 9 x 3
     ID Fruit     Score
  <dbl> <chr>     <dbl>
1     1 mango       1.1
2     1 banana      1.2
3     1 tangerine   1.3
4     2 mango       2.1
5     2 banana      2.2
6     2 tangerine   2.3
7     3 mango       3.1
8     3 banana      3.2
9     3 tangerine   3.3
```

### data.table


```r
dat_wide_dt <- as.data.table(dat_wide)
dat_wide2long_dt <- melt(dat_wide_dt,
                         id.vars = 1,
                         measure.vars = 2:4,
                         variable.name = "Fruit",
                         value.name = "Score")
setorder(dat_wide2long_dt, "ID")
dat_wide2long_dt
```

```
   ID     Fruit Score
1:  1     mango   1.1
2:  1    banana   1.2
3:  1 tangerine   1.3
4:  2     mango   2.1
5:  2    banana   2.2
6:  2 tangerine   2.3
7:  3     mango   3.1
8:  3    banana   3.2
9:  3 tangerine   3.3
```

## Long to Wide

Let's create a long dataset:


```r
(dat_long <- data.frame(ID = c(1, 2, 3, 1, 2, 3, 1, 2, 3),
                       Fruit = c("mango", "mango", "mango", 
                                 "banana", "banana", "banana", 
                                 "tangerine", "tangerine", "tangerine"),
                       Score = c(1.1, 2.1, 3.1, 1.2, 2.2, 3.2, 1.3, 2.3, 3.3)))
```

```
  ID     Fruit Score
1  1     mango   1.1
2  2     mango   2.1
3  3     mango   3.1
4  1    banana   1.2
5  2    banana   2.2
6  3    banana   3.2
7  1 tangerine   1.3
8  2 tangerine   2.3
9  3 tangerine   3.3
```

### base

Using base `reshape()` for long-to-wide transformation is simpler than wide-to-long:

<div class="figure" style="text-align: center">
<img src="R_reshape_long2wide.png" alt="`reshape()` syntax for Long to Wide transformation." width="100%" />
<p class="caption">(\#fig:longWideSyntax)`reshape()` syntax for Long to Wide transformation.</p>
</div>


```r
dat_long2wide <- reshape(dat_long,
                         idvar = "ID",
                         timevar = "Fruit",
                         v.names = "Score",
                         direction = "wide")
# Optionally rename columns
colnames(dat_long2wide) <- gsub("Score.", "", colnames(dat_long2wide))
dat_long2wide
```

```
  ID mango banana tangerine
1  1   1.1    1.2       1.3
2  2   2.1    2.2       2.3
3  3   3.1    3.2       3.3
```

### tidyr


```r
dat_long2wide_tv <- pivot_wider(dat_long,
                                id_cols = "ID",
                                names_from = "Fruit",
                                values_from = "Score")
dat_long2wide_tv
```

```
# A tibble: 3 x 4
     ID mango banana tangerine
  <dbl> <dbl>  <dbl>     <dbl>
1     1   1.1    1.2       1.3
2     2   2.1    2.2       2.3
3     3   3.1    3.2       3.3
```

### data.table

`data.table`'s long to wide procedure is defined with a convenient formula notation:


```r
dat_long_dt <- as.data.table(dat_long)
dat_long2wide_dt <- dcast(dat_long_dt,
                          ID ~ Fruit,
                          value.var = "Score")
dat_long2wide_dt
```

```
   ID banana mango tangerine
1:  1    1.2   1.1       1.3
2:  2    2.2   2.1       2.3
3:  3    3.2   3.1       3.3
```

## Feature transformation with `transform()`

Make up some data:


```r
dat <- data.frame(Sex = c(0, 0, 1, 1, 0),
                  Height = c(1.5, 1.6, 1.55, 1.73, 1.8),
                  Weight = c(55, 70, 69, 76, 91))
```


```r
dat <- transform(dat, BMI = Weight/Height^2)
dat
```

```
  Sex Height Weight      BMI
1   0   1.50     55 24.44444
2   0   1.60     70 27.34375
3   1   1.55     69 28.72008
4   1   1.73     76 25.39343
5   0   1.80     91 28.08642
```

`transform()` is probably not used too often, because it is trivial to do the same with direct assignment:


```r
dat$BMI <- dat$Weight/dat$Height^2
```

but can be useful when adding multiple variables and/or used in a [pipe](#pipe):


```r
library(magrittr)
```

```

Attaching package: 'magrittr'
```

```
The following object is masked from 'package:tidyr':

    extract
```

```r
dat %>% 
  subset(Sex == 0) %>%
  transform(DeltaWeightFromMean = Weight - mean(Weight),
            BMI = Weight/Height^2,
            CI = Weight/Height^3)
```

```
  Sex Height Weight      BMI DeltaWeightFromMean       CI
1   0    1.5     55 24.44444                 -17 16.29630
2   0    1.6     70 27.34375                  -2 17.08984
5   0    1.8     91 28.08642                  19 15.60357
```
