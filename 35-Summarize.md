# Summarizing Data {#summarize}



Let's read in a dataset from OpenML:


```r
heart <- read.csv("https://www.openml.org/data/get_csv/51/dataset_51_heart-h.arff",
                  na.strings = "?")
```

## Get summary of an R object with `summary()`

R includes `summary()` [methods](#s3methods) for a number of different objects. 


```r
summary(heart)
```

```
      age            sex             chest_pain           trestbps    
 Min.   :28.00   Length:294         Length:294         Min.   : 92.0  
 1st Qu.:42.00   Class :character   Class :character   1st Qu.:120.0  
 Median :49.00   Mode  :character   Mode  :character   Median :130.0  
 Mean   :47.83                                         Mean   :132.6  
 3rd Qu.:54.00                                         3rd Qu.:140.0  
 Max.   :66.00                                         Max.   :200.0  
                                                       NA's   :1      
      chol           fbs              restecg             thalach     
 Min.   : 85.0   Length:294         Length:294         Min.   : 82.0  
 1st Qu.:209.0   Class :character   Class :character   1st Qu.:122.0  
 Median :243.0   Mode  :character   Mode  :character   Median :140.0  
 Mean   :250.8                                         Mean   :139.1  
 3rd Qu.:282.5                                         3rd Qu.:155.0  
 Max.   :603.0                                         Max.   :190.0  
 NA's   :23                                            NA's   :1      
    exang              oldpeak          slope                 ca     
 Length:294         Min.   :0.0000   Length:294         Min.   :0    
 Class :character   1st Qu.:0.0000   Class :character   1st Qu.:0    
 Mode  :character   Median :0.0000   Mode  :character   Median :0    
                    Mean   :0.5861                      Mean   :0    
                    3rd Qu.:1.0000                      3rd Qu.:0    
                    Max.   :5.0000                      Max.   :0    
                                                        NA's   :291  
     thal               num           
 Length:294         Length:294        
 Class :character   Class :character  
 Mode  :character   Mode  :character  
                                      
                                      
                                      
                                      
```

## Fast builtin column and row operations

We saw in [Loop Functions](#loopfns) how we can apply functions on rows, columns, or other subsets of our data. R has optimized builtin functions for some very common operations, with self-explanatory names:

* `colSums()`: column sums
* `rowSums()`: row sums
* `colMeans()`: column means
* `rowMeans()`: row means


```r
a <- matrix(1:20, 5)
a
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
colSums(a)
```

```
[1] 15 40 65 90
```

```r
# same as
apply(a, 2, sum)
```

```
[1] 15 40 65 90
```


```r
rowSums(a)
```

```
[1] 34 38 42 46 50
```

```r
# same as
apply(a, 1, sum)
```

```
[1] 34 38 42 46 50
```


```r
colMeans(a)
```

```
[1]  3  8 13 18
```

```r
# same as
apply(a, 2, mean)
```

```
[1]  3  8 13 18
```


```r
rowMeans(a)
```

```
[1]  8.5  9.5 10.5 11.5 12.5
```

```r
# same as
apply(a, 1, mean)
```

```
[1]  8.5  9.5 10.5 11.5 12.5
```

## Optimized matrix operations with **matrixStats**

While the builtin operations above are already optimized and faster than the equivalent calls, the **matrixStats** package [@matrixStats2019] offers a number of futher optimized matrix operations, including drop-in replacements of the above. These should be prefered when dealing with bigger data:


```r
library(matrixStats)
colSums2(a)
```

```
[1] 15 40 65 90
```

```r
rowSums2(a)
```

```
[1] 34 38 42 46 50
```

```r
colMeans2(a)
```

```
[1]  3  8 13 18
```

```r
rowMeans2(a)
```

```
[1]  8.5  9.5 10.5 11.5 12.5
```

Note: **matrixStats** provides replacement functions named almost identically to their base counterpart - so they are easy to find - but are different - so they don't mask the base functions (this is important and good software design).

## Grouped summary statistics with `aggregate()`

`aggregate()` is a powerful way to apply functions on splits of your data. It can replicate functionality of the `*apply()` family, but can be more flexible/powerful and supports a formula input.


```r
aggregate(iris[, -5], by = list(iris$Species), mean)
```

```
     Group.1 Sepal.Length Sepal.Width Petal.Length Petal.Width
1     setosa        5.006       3.428        1.462       0.246
2 versicolor        5.936       2.770        4.260       1.326
3  virginica        6.588       2.974        5.552       2.026
```

Alternatively, the more compact **formula notation** can be used here to get the same result.  
The `.` on the left hand side represents all features, excluding those on the right hand side:


```r
aggregate(. ~ Species, iris, mean)
```

```
     Species Sepal.Length Sepal.Width Petal.Length Petal.Width
1     setosa        5.006       3.428        1.462       0.246
2 versicolor        5.936       2.770        4.260       1.326
3  virginica        6.588       2.974        5.552       2.026
```

To define multiple specific variables on the left hand side of the formula within `aggregate()`, use `cbind()`:


```r
aggregate(cbind(Sepal.Length, Sepal.Width) ~ Species, iris, mean)
```

```
     Species Sepal.Length Sepal.Width
1     setosa        5.006       3.428
2 versicolor        5.936       2.770
3  virginica        6.588       2.974
```


Let's make up a second grouping:


```r
irisd <- iris
irisd$Group2 <- rep(1:2, 3, each = 25)
irisd$Group2
```

```
  [1] 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 2 2 2 2 2 2 2 2 2 2 2 2
 [38] 2 2 2 2 2 2 2 2 2 2 2 2 2 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
 [75] 1 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 1 1 1 1 1 1 1 1 1 1 1
[112] 1 1 1 1 1 1 1 1 1 1 1 1 1 1 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
[149] 2 2
```

This "Group2" divides each iris Species in the first and last 25 cases.  
Let's aggregate by both Species and Group2:


```r
aggregate(irisd[, -c(5, 6)],
          by = list(Species = irisd$Species, Group2 = irisd$Group2),
          mean)
```

```
     Species Group2 Sepal.Length Sepal.Width Petal.Length Petal.Width
1     setosa      1        5.028       3.480        1.460       0.248
2 versicolor      1        6.012       2.776        4.312       1.344
3  virginica      1        6.576       2.928        5.640       2.044
4     setosa      2        4.984       3.376        1.464       0.244
5 versicolor      2        5.860       2.764        4.208       1.308
6  virginica      2        6.600       3.020        5.464       2.008
```

The compact formula notation can be very convenient here:


```r
aggregate(. ~ Species + Group2, irisd, mean)
```

```
     Species Group2 Sepal.Length Sepal.Width Petal.Length Petal.Width
1     setosa      1        5.028       3.480        1.460       0.248
2 versicolor      1        6.012       2.776        4.312       1.344
3  virginica      1        6.576       2.928        5.640       2.044
4     setosa      2        4.984       3.376        1.464       0.244
5 versicolor      2        5.860       2.764        4.208       1.308
6  virginica      2        6.600       3.020        5.464       2.008
```

Note: Using aggregate with the `by = list()` argument is easier to code with. The formula notation might be easier to work with in real time on the console. You *can* code with the formula notation, but if there is an alternative it's unlikely to be worth the extra steps.
