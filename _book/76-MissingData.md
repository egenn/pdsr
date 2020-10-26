# Handling Missing data {#missingdata}



<STYLE type='text/css' scoped>
PRE.fansi SPAN {padding-top: .25em; padding-bottom: .25em};
</STYLE>


```r
library(rtemis)
```

```
  .:rtemis 0.8.0: Welcome, egenn
  [x86_64-apple-darwin17.0 (64-bit): Defaulting to 4/4 available cores]
  Documentation & vignettes: https://rtemis.lambdamd.org
```

Missing data is a very common problem in statistics and data science. Data may be missing for a variety of reasons. We often characterize the type of missingness using the following three types:  

* **Missing completely at random (MCAR)**
“The fact that the data are missing is independent of the observed and unobserved data”
* **Missing at random (MAR)**
"The fact that the data are missing is systematically related to the observed but not the unobserved data”
* **Missing not at random (MNAR)**
“The fact that the data are missing is systematically related to the unobserved data”

## Check for missing data

You can use your favorite base commands to check for missing data, by row, by column, total, etc.  
Let's add some NA values to our favorite dataset:


```r
dat <- iris
set.seed(2020)
dat[sample(1:150, 3), 1] <- dat[sample(1:150, 22), 2] <- dat[sample(1:150, 9), 4] <- NA
```

### Visualize

You can visualize missing data. A number of packages include functions to do this. I added a simple function in `rtemis`, `mplot.missing()`. In this examples, missing cases are represented in orange:


```r
library(rtemis)
mplot.missing(dat)
```

![](76-MissingData_files/figure-latex/unnamed-chunk-5-1.pdf)<!-- --> 

### Summarize

Get N of missing per column:


```r
sapply(dat, function(i) sum(is.na(i)))
```

```
Sepal.Length  Sepal.Width Petal.Length  Petal.Width      Species 
           3           22            0            9            0 
```

The `checkData()` function in `rtemis` includes information on missing data:


```r
checkData(dat)
```

<PRE class="fansi fansi-output"><CODE>  Dataset: <span style='color: #00BBBB;font-weight: bold;'>dat</span><span> 

  </span><span style='color: #555555;font-weight: bold;'>[[ </span><span style='font-weight: bold;'>Summary</span><span style='color: #555555;font-weight: bold;'> ]]
</span><span>  </span><span style='font-weight: bold;'>150</span><span> cases with </span><span style='font-weight: bold;'>5</span><span> features: 
  * </span><span style='font-weight: bold;'>4</span><span> continuous features 
  * </span><span style='font-weight: bold;'>0</span><span> integer features 
  * </span><span style='font-weight: bold;'>1</span><span> categorical feature, which is not ordered
    ** </span><span style='font-weight: bold;'>1</span><span> unordered categorical feature has more than 2 levels
  * </span><span style='font-weight: bold;'>0</span><span> constant features 
  * </span><span style='color: #BB0000;font-weight: bold;'>1</span><span> duplicated case 
  * </span><span style='color: #BBBB00;font-weight: bold;'>3</span><span> features include 'NA' values; </span><span style='color: #BBBB00;font-weight: bold;'>34</span><span> 'NA' values total
    ** Max percent missing in a feature is </span><span style='color: #BBBB00;font-weight: bold;'>14.67%</span><span> (</span><span style='font-weight: bold;'>Sepal.Width</span><span>)
    ** Max percent missing in a case is </span><span style='color: #BBBB00;font-weight: bold;'>20%</span><span> (case #</span><span style='font-weight: bold;'>7</span><span>)

  </span><span style='color: #555555;font-weight: bold;'>[[ </span><span style='font-weight: bold;'>Recommendations</span><span style='color: #555555;font-weight: bold;'> ]]
</span><span style='color: #BBBB00;font-weight: bold;'>  * Remove the duplicated case 
  * Consider imputing missing values or use complete cases only
</span><span style='color: #00BBBB;font-weight: bold;'>  * Check the unordered categorical feature with more than 2 levels and consider
    if ordering would make sense
</span><span>
</span></CODE></PRE>

## Handle missing data

Different approaches can be used to handle missing data:  

* Do nothing! - if your algorithm(s) can handle missing data (decision trees!)
* Exclude data: Use complete cases only
* Make up data: Replace or Impute
    * Replace with median/mean
    * Predict missing from present
        * Single imputation
        * Multiple imputation
        
### Do nothing (decision trees!)

Decision trees and ensemble methods that use decision trees like random forest and gradient boosting.


```r
dat.cart <- s.CART(dat)
```

<PRE class="fansi fansi-output"><CODE><span style='color: #555555;'>[2020-10-19 20:13:28</span><span style='color: #555555;font-weight: bold;'> s.CART</span><span style='color: #555555;'>] Hello,</span><span> </span><span style='color: #555555;'>egenn</span><span> 

</span><span style='color: #555555;font-weight: bold;'>[[ </span><span style='font-weight: bold;'>Classification Input Summary</span><span style='color: #555555;font-weight: bold;'> ]]
</span><span>   Training features: </span><span style='font-weight: bold;'>150 x 4 
</span><span>    Training outcome: </span><span style='font-weight: bold;'>150 x 1 
</span><span>    Testing features: Not available
     Testing outcome: Not available

</span><span style='color: #555555;'>[2020-10-19 20:13:31</span><span style='color: #555555;font-weight: bold;'> s.CART</span><span style='color: #555555;'>] </span><span>Training CART... 

</span><span style='color: #555555;font-weight: bold;'>[[ </span><span style='font-weight: bold;'>CART Classification Training Summary</span><span style='color: #555555;font-weight: bold;'> ]]
</span><span style='font-weight: bold;'>                   Reference</span><span> 
</span><span style='font-weight: bold;'>        Estimated</span><span>  </span><span style='color: #00BBBB;font-weight: bold;'>setosa  versicolor  virginica  </span><span>
</span><span style='color: #00BBBB;font-weight: bold;'>           setosa</span><span>      50           0          0
</span><span style='color: #00BBBB;font-weight: bold;'>       versicolor</span><span>       0          48          2
</span><span style='color: #00BBBB;font-weight: bold;'>        virginica</span><span>       0           2         48

                   </span><span style='color: #00BBBB;font-weight: bold;'>Overall  </span><span>
Balanced Accuracy  0.9733 
          F1 Mean  0.9733 
         Accuracy  0.9733 

                   </span><span style='color: #00BBBB;font-weight: bold;'>setosa  versicolor  virginica  </span><span>
      Sensitivity  1.0000  0.9600      0.9600   
      Specificity  1.0000  0.9800      0.9800   
Balanced Accuracy  1.0000  0.9700      0.9700   
              PPV  1.0000  0.9600      0.9600   
              NPV  1.0000  0.9800      0.9800   
               F1  1.0000  0.9600      0.9600   
</span></CODE></PRE>![](76-MissingData_files/figure-latex/unnamed-chunk-8-1.pdf)<!-- --> <PRE class="fansi fansi-output"><CODE>
<span style='color: #555555;'>[2020-10-19 20:13:32</span><span style='color: #555555;font-weight: bold;'> s.CART</span><span style='color: #555555;'>] Run completed in 0.05 minutes (Real: 3.26; User: 1.42; System: 0.08)</span><span> 
</span></CODE></PRE>

### Use complete cases only

R's builtin `complete.cases()` function returns a logical index of cases that have no missing values, i.e. are complete.


```r
dim(dat)
```

```
[1] 150   5
```

```r
(index_cc <- complete.cases(dat))
```

```
  [1]  TRUE  TRUE  TRUE  TRUE  TRUE  TRUE FALSE  TRUE  TRUE  TRUE  TRUE  TRUE
 [13]  TRUE  TRUE  TRUE  TRUE FALSE FALSE  TRUE  TRUE  TRUE FALSE  TRUE  TRUE
 [25]  TRUE  TRUE  TRUE  TRUE FALSE  TRUE  TRUE FALSE  TRUE  TRUE  TRUE  TRUE
 [37]  TRUE  TRUE  TRUE  TRUE  TRUE FALSE FALSE FALSE  TRUE  TRUE  TRUE  TRUE
 [49]  TRUE  TRUE  TRUE FALSE  TRUE  TRUE  TRUE FALSE  TRUE  TRUE  TRUE  TRUE
 [61]  TRUE  TRUE  TRUE  TRUE FALSE FALSE  TRUE  TRUE  TRUE FALSE  TRUE  TRUE
 [73]  TRUE  TRUE  TRUE FALSE  TRUE FALSE  TRUE FALSE  TRUE FALSE  TRUE  TRUE
 [85]  TRUE  TRUE FALSE FALSE  TRUE  TRUE  TRUE  TRUE FALSE  TRUE FALSE  TRUE
 [97]  TRUE FALSE  TRUE  TRUE  TRUE  TRUE  TRUE  TRUE  TRUE  TRUE  TRUE  TRUE
[109] FALSE  TRUE FALSE  TRUE  TRUE FALSE  TRUE  TRUE  TRUE  TRUE  TRUE FALSE
[121]  TRUE  TRUE FALSE FALSE  TRUE  TRUE  TRUE FALSE  TRUE  TRUE FALSE FALSE
[133]  TRUE  TRUE  TRUE  TRUE  TRUE  TRUE  TRUE  TRUE FALSE FALSE  TRUE  TRUE
[145]  TRUE  TRUE  TRUE  TRUE  TRUE  TRUE
```

```r
dat_cc <- dat[index_cc, ]
dim(dat_cc)
```

```
[1] 116   5
```

We lost 34 cases in the above example. Maybe that's a lot.

### Replace with a fixed value: mean, median vs. mode, "missing"

We can manually replace missing values with the mean or median for continuous variables, or with the mode for categorical features.  
For example to replace the first feature's missing values with the mean


```r
Sepal.Length_mean <- mean(dat$Sepal.Length, na.rm = TRUE)
dat_rm <- dat
dat_rm$Sepal.Length[is.na(dat_rm$Sepal.Length)] <- Sepal.Length_mean
```

The `preprocess()` function in `rtemis` can do this for you as well for all features:


```r
dat_pre <- preprocess(dat, impute = TRUE, impute.type = "meanMode")
```

<PRE class="fansi fansi-output"><CODE><span style='color: #555555;'>[2020-10-19 20:13:33</span><span style='color: #555555;font-weight: bold;'> preprocess</span><span style='color: #555555;'>] </span><span>Removing 1 duplicated case... 
</span><span style='color: #555555;'>[2020-10-19 20:13:33</span><span style='color: #555555;font-weight: bold;'> preprocess</span><span style='color: #555555;'>] </span><span>Imputing missing values using mean and getMode... 
</span><span style='color: #555555;'>[2020-10-19 20:13:33</span><span style='color: #555555;font-weight: bold;'> preprocess</span><span style='color: #555555;'>] </span><span>Done 
</span></CODE></PRE>

Verify there are no missing data by rerunning `checkData()`:


```r
checkData(dat_pre)
```

<PRE class="fansi fansi-output"><CODE>  Dataset: <span style='color: #00BBBB;font-weight: bold;'>dat_pre</span><span> 

  </span><span style='color: #555555;font-weight: bold;'>[[ </span><span style='font-weight: bold;'>Summary</span><span style='color: #555555;font-weight: bold;'> ]]
</span><span>  </span><span style='font-weight: bold;'>149</span><span> cases with </span><span style='font-weight: bold;'>5</span><span> features: 
  * </span><span style='font-weight: bold;'>4</span><span> continuous features 
  * </span><span style='font-weight: bold;'>0</span><span> integer features 
  * </span><span style='font-weight: bold;'>1</span><span> categorical feature, which is not ordered
    ** </span><span style='font-weight: bold;'>1</span><span> unordered categorical feature has more than 2 levels
  * </span><span style='font-weight: bold;'>0</span><span> constant features 
  * </span><span style='font-weight: bold;'>0</span><span> duplicated cases 
  * </span><span style='font-weight: bold;'>0</span><span> features include 'NA' values

  </span><span style='color: #555555;font-weight: bold;'>[[ </span><span style='font-weight: bold;'>Recommendations</span><span style='color: #555555;font-weight: bold;'> ]]
</span><span style='color: #00BBBB;font-weight: bold;'>  * Check the unordered categorical feature with more than 2 levels and consider
    if ordering would make sense
</span><span>
</span></CODE></PRE>

You may want to include a "missingness" column that indicates which cases were imputed to include in your model. You can create this simply by running:


```r
Sepal.Length_missing = factor(as.integer(is.na(dat$Sepal.Length)))
```

`preprocess()` includes the option `missingness` to add corresponding indicator columns after imputation:


```r
dat_pre <- preprocess(dat, impute = TRUE, impute.type = "meanMode",
                      missingness = TRUE)
```

<PRE class="fansi fansi-output"><CODE><span style='color: #555555;'>[2020-10-19 20:13:33</span><span style='color: #555555;font-weight: bold;'> preprocess</span><span style='color: #555555;'>] </span><span>Removing 1 duplicated case... 
</span><span style='color: #555555;'>[2020-10-19 20:13:33</span><span style='color: #555555;font-weight: bold;'> preprocess</span><span style='color: #555555;'>] </span><span>Created missingness indicator for Sepal.Length 
</span><span style='color: #555555;'>[2020-10-19 20:13:33</span><span style='color: #555555;font-weight: bold;'> preprocess</span><span style='color: #555555;'>] </span><span>Created missingness indicator for Sepal.Width 
</span><span style='color: #555555;'>[2020-10-19 20:13:33</span><span style='color: #555555;font-weight: bold;'> preprocess</span><span style='color: #555555;'>] </span><span>Created missingness indicator for Petal.Width 
</span><span style='color: #555555;'>[2020-10-19 20:13:33</span><span style='color: #555555;font-weight: bold;'> preprocess</span><span style='color: #555555;'>] </span><span>Imputing missing values using mean and getMode... 
</span><span style='color: #555555;'>[2020-10-19 20:13:33</span><span style='color: #555555;font-weight: bold;'> preprocess</span><span style='color: #555555;'>] </span><span>Done 
</span></CODE></PRE>

```r
head(dat_pre)
```

```
  Sepal.Length Sepal.Width Petal.Length Petal.Width Species
1          5.1         3.5          1.4         0.2  setosa
2          4.9         3.0          1.4         0.2  setosa
3          4.7         3.2          1.3         0.2  setosa
4          4.6         3.1          1.5         0.2  setosa
5          5.0         3.6          1.4         0.2  setosa
6          5.4         3.9          1.7         0.4  setosa
  Sepal.Length_missing Sepal.Width_missing Petal.Width_missing
1                    0                   0                   0
2                    0                   0                   0
3                    0                   0                   0
4                    0                   0                   0
5                    0                   0                   0
6                    0                   0                   0
```

With categorical variables, an alternative option would be to introduce a new level of "missing" to your data, instead of replacing with the mode, for example. If we bin a continuous variable to convert to categorical, the same can then also be applied.  

(-> I will add a function to `preprocess()` to do this.)

### Last observation carried forward

In longitudinal / timeseries data, we may want to replace missing values with the last observed value. This is called last observation carried forward (LOCF). As always, whether this procedure is appropriate depend the reasons for missingness. The `zoo` and `DescTool` packages provide commands to perform LOCF.  

Some simulated data. We are missing blood pressure measurements on Saturdays and Sundays:


```r
dat <- data.frame(Day = rep(c("Mon", "Tues", "Wed", "Thu", "Fri", "Sat", "Sun"), 3),
                  SBP = sample(105:125, 21, TRUE))
dat$SBP[dat$Day == "Sat" | dat$Day == "Sun"] <- NA
dat
```

```
    Day SBP
1   Mon 117
2  Tues 106
3   Wed 120
4   Thu 117
5   Fri 105
6   Sat  NA
7   Sun  NA
8   Mon 117
9  Tues 115
10  Wed 109
11  Thu 115
12  Fri 110
13  Sat  NA
14  Sun  NA
15  Mon 122
16 Tues 105
17  Wed 111
18  Thu 112
19  Fri 125
20  Sat  NA
21  Sun  NA
```

The `zoo` package includes the `na.locf()`. 


```r
dat$SBPlocf <- zoo::na.locf(dat$SBP)
dat
```

```
    Day SBP SBPlocf
1   Mon 117     117
2  Tues 106     106
3   Wed 120     120
4   Thu 117     117
5   Fri 105     105
6   Sat  NA     105
7   Sun  NA     105
8   Mon 117     117
9  Tues 115     115
10  Wed 109     109
11  Thu 115     115
12  Fri 110     110
13  Sat  NA     110
14  Sun  NA     110
15  Mon 122     122
16 Tues 105     105
17  Wed 111     111
18  Thu 112     112
19  Fri 125     125
20  Sat  NA     125
21  Sun  NA     125
```

Similar functionality is included in `DescTools`' `LOCF()` function:


```r
DescTools::LOCF(dat$SBP)
```

```
 [1] 117 106 120 117 105 105 105 117 115 109 115 110 110 110 122 105 111 112 125
[20] 125 125
```

### Replace missing values with estimated values

#### Single imputation

You can use non-missing data to predict missing data in an iterative procedure [@buuren2010mice][@stekhoven2012missforest].
The `missRanger` package uses the optimized (and parallel-capable) package `ranger` [@wright2015ranger] to iteratively train random forest models for imputation.


```r
library(missRanger)
dat <- iris
set.seed(2020)
dat[sample(1:150, 5), 1] <- dat[sample(1:150, 22), 4] <- dat[sample(1:150, 18), 4] <- NA
dat_rfimp <- missRanger(dat, num.trees = 100)
```

```

Missing value imputation by random forests

  Variables to impute:		Sepal.Length, Petal.Width
  Variables used to impute:	Sepal.Length, Sepal.Width, Petal.Length, Petal.Width, Species
iter 1:	..
iter 2:	..
iter 3:	..
iter 4:	..
```

```r
head(dat_rfimp)
```

```
  Sepal.Length Sepal.Width Petal.Length Petal.Width Species
1     5.100000         3.5          1.4         0.2  setosa
2     4.900000         3.0          1.4         0.2  setosa
3     4.732533         3.2          1.3         0.2  setosa
4     4.600000         3.1          1.5         0.2  setosa
5     5.000000         3.6          1.4         0.2  setosa
6     5.400000         3.9          1.7         0.4  setosa
```

```r
checkData(dat_rfimp)
```

<PRE class="fansi fansi-output"><CODE>  Dataset: <span style='color: #00BBBB;font-weight: bold;'>dat_rfimp</span><span> 

  </span><span style='color: #555555;font-weight: bold;'>[[ </span><span style='font-weight: bold;'>Summary</span><span style='color: #555555;font-weight: bold;'> ]]
</span><span>  </span><span style='font-weight: bold;'>150</span><span> cases with </span><span style='font-weight: bold;'>5</span><span> features: 
  * </span><span style='font-weight: bold;'>4</span><span> continuous features 
  * </span><span style='font-weight: bold;'>0</span><span> integer features 
  * </span><span style='font-weight: bold;'>1</span><span> categorical feature, which is not ordered
    ** </span><span style='font-weight: bold;'>1</span><span> unordered categorical feature has more than 2 levels
  * </span><span style='font-weight: bold;'>0</span><span> constant features 
  * </span><span style='color: #BB0000;font-weight: bold;'>1</span><span> duplicated case 
  * </span><span style='font-weight: bold;'>0</span><span> features include 'NA' values

  </span><span style='color: #555555;font-weight: bold;'>[[ </span><span style='font-weight: bold;'>Recommendations</span><span style='color: #555555;font-weight: bold;'> ]]
</span><span style='color: #BBBB00;font-weight: bold;'>  * Remove the duplicated case 
</span><span style='color: #00BBBB;font-weight: bold;'>  * Check the unordered categorical feature with more than 2 levels and consider
    if ordering would make sense
</span><span>
</span></CODE></PRE>

Note: The default method for `preprocess(impute = TRUE)` is to use `missRanger`.

#### Multiple imputation

Multiple imputation creates multiple estimates of the missing data. It is more statistically valid for small datasets, but may not be practical for larger datasets. The package `mice` is a popular choice for multiple imputation in R.


```r
library(mice)
dat_mice <- mice(dat)
```
