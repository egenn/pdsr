# Supervised Learning {#supervised}



<STYLE type='text/css' scoped>
PRE.fansi SPAN {padding-top: .25em; padding-bottom: .25em};
</STYLE>

This is a very brief introduction to machine learning using the [**rtemis**](https://rtemis.lambdamd.org) package. **rtemis** includes a large number of functions for:

- Data preprocessing
- Unsupervised learning: clustering & dimensionality reduction
- Supervised learning: regression & classification
- Visualization: static & dynamic (interactive) plots

## Installation

If you do not have the **remotes** package, install it first:


```r
install.packages("remotes")
```

Install **rtemis**:


```r
remotes::install_github("egenn/rtemis")
```

**rtemis** uses multiple packages under the hood. Since you would not ever need to use all of the functions that rely on all of the packages, they are not installed by default as that would be very wasteful. Every time you call an **rtemis** function, it first checks if the required packages are present, and if not it identifies which one/s is/are needed by the specific function so that you can install them and procede.  

For this short tutorial, start by installing the following, if not already on your system:


```r
install.packages("ranger")
```

Load **rtemis**:


```r
library(rtemis)
```

```
  .:rtemis 0.8.0: Welcome, egenn
  [x86_64-apple-darwin17.0 (64-bit): Defaulting to 4/4 available cores]
  Documentation & vignettes: https://rtemis.lambdamd.org
```

## Data Input for Supervised Learning

All __rtemis__ supervised learning functions begin with `s.` ("supervised").  
They accept the same first four arguments:  
`x`, `y`, `x.test`, `y.test`  
but are flexible and allow you to also provide combined (x, y) and (x.test, y.test) data frames, as explained below.

### Scenario 1 (`x.train, y.train, x.test, y.test`)

In the most straightforward case, provide each featureset and outcome individually:  

* `x`: Training set features
* `y`: Training set outcome
* `x.test`: Testing set features (Optional)
* `y.test`: Testing set outcome (Optional)


```r
x <- rnormmat(200, 10, seed = 2019)
w <- rnorm(10)
y <- x %*% w + rnorm(200)
res <- resample(y, seed = 2020)
```

<PRE class="fansi fansi-output"><CODE><span style='color: #555555;font-weight: bold;'>[[ </span><span style='font-weight: bold;'>Resampling Parameters</span><span style='color: #555555;font-weight: bold;'> ]]
</span><span>    n.resamples: 10 
      resampler: strat.sub 
   stratify.var: y 
        train.p: 0.75 
   strat.n.bins: 4 

</span><span style='color: #555555;'>[2020-10-19 20:20:22</span><span style='color: #555555;font-weight: bold;'> resample</span><span style='color: #555555;'>] </span><span>Created 10 stratified subsamples 
</span></CODE></PRE>

```r
x.train <- x[res$Subsample_1, ]
x.test <- x[-res$Subsample_1, ]
y.train <- y[res$Subsample_1]
y.test <- y[-res$Subsample_1]
```


```r
mod.glm <- s.GLM(x.train, y.train, x.test, y.test)
```

<PRE class="fansi fansi-output"><CODE><span style='color: #555555;'>[2020-10-19 20:20:22</span><span style='color: #555555;font-weight: bold;'> s.GLM</span><span style='color: #555555;'>] Hello,</span><span> </span><span style='color: #555555;'>egenn</span><span> 

</span><span style='color: #555555;font-weight: bold;'>[[ </span><span style='font-weight: bold;'>Regression Input Summary</span><span style='color: #555555;font-weight: bold;'> ]]
</span><span>   Training features: </span><span style='font-weight: bold;'>147 x 10 
</span><span>    Training outcome: </span><span style='font-weight: bold;'>147 x 1 
</span><span>    Testing features: </span><span style='font-weight: bold;'>53 x 10 
</span><span>     Testing outcome: </span><span style='font-weight: bold;'>53 x 1 
</span><span>
</span><span style='color: #555555;'>[2020-10-19 20:20:25</span><span style='color: #555555;font-weight: bold;'> s.GLM</span><span style='color: #555555;'>] </span><span>Training GLM... 

</span><span style='color: #555555;font-weight: bold;'>[[ </span><span style='font-weight: bold;'>GLM Regression Training Summary</span><span style='color: #555555;font-weight: bold;'> ]]
</span><span>    MSE = 0.84 (91.88%)
   RMSE = 0.92 (71.51%)
    MAE = 0.75 (69.80%)
      r = 0.96 (p = 5.9e-81)
    rho = 0.95 (p = 0.00)
   R sq = </span><span style='color: #00BBBB;font-weight: bold;'>0.92</span><span>

</span><span style='color: #555555;font-weight: bold;'>[[ </span><span style='font-weight: bold;'>GLM Regression Testing Summary</span><span style='color: #555555;font-weight: bold;'> ]]
</span><span>    MSE = 1.22 (89.03%)
   RMSE = 1.10 (66.88%)
    MAE = 0.90 (66.66%)
      r = 0.94 (p = 2.5e-26)
    rho = 0.95 (p = 0.00)
   R sq = </span><span style='color: #00BBBB;font-weight: bold;'>0.89</span><span>
</span></CODE></PRE>![](87-Supervised_files/figure-latex/unnamed-chunk-7-1.pdf)<!-- --> <PRE class="fansi fansi-output"><CODE>
<span style='color: #555555;'>[2020-10-19 20:20:25</span><span style='color: #555555;font-weight: bold;'> s.GLM</span><span style='color: #555555;'>] Run completed in 0.06 minutes (Real: 3.34; User: 1.48; System: 0.10)</span><span> 
</span></CODE></PRE>

### Scenario 2: (`x.train, x.test`)

You can provide training and testing sets as a single data.frame each, where the last column is the outcome. Now `x` is the full training data and `y` the full testing data:  

* `x`: data.frame(x.train, y.train)
* `y`: data.frame(x.test, y.test)


```r
x <- rnormmat(200, 10, seed = 2019)
w <- rnorm(10)
y <- x %*% w + rnorm(200)
dat <- data.frame(x, y)
res <- resample(dat, seed = 2020)
```

<PRE class="fansi fansi-output"><CODE><span style='color: #555555;'>[2020-10-19 20:20:26</span><span style='color: #555555;font-weight: bold;'> resample</span><span style='color: #555555;'>] </span><span>Input contains more than one columns; will stratify on last 
</span><span style='color: #555555;font-weight: bold;'>[[ </span><span style='font-weight: bold;'>Resampling Parameters</span><span style='color: #555555;font-weight: bold;'> ]]
</span><span>    n.resamples: 10 
      resampler: strat.sub 
   stratify.var: y 
        train.p: 0.75 
   strat.n.bins: 4 

</span><span style='color: #555555;'>[2020-10-19 20:20:26</span><span style='color: #555555;font-weight: bold;'> resample</span><span style='color: #555555;'>] </span><span>Created 10 stratified subsamples 
</span></CODE></PRE>

```r
dat.train <- dat[res$Subsample_1, ]
dat.test <- dat[-res$Subsample_1, ]
```


```r
mod.glm <- s.GLM(dat.train, dat.test)
```

<PRE class="fansi fansi-output"><CODE><span style='color: #555555;'>[2020-10-19 20:20:26</span><span style='color: #555555;font-weight: bold;'> s.GLM</span><span style='color: #555555;'>] Hello,</span><span> </span><span style='color: #555555;'>egenn</span><span> 

</span><span style='color: #555555;font-weight: bold;'>[[ </span><span style='font-weight: bold;'>Regression Input Summary</span><span style='color: #555555;font-weight: bold;'> ]]
</span><span>   Training features: </span><span style='font-weight: bold;'>147 x 10 
</span><span>    Training outcome: </span><span style='font-weight: bold;'>147 x 1 
</span><span>    Testing features: </span><span style='font-weight: bold;'>53 x 10 
</span><span>     Testing outcome: </span><span style='font-weight: bold;'>53 x 1 
</span><span>
</span><span style='color: #555555;'>[2020-10-19 20:20:26</span><span style='color: #555555;font-weight: bold;'> s.GLM</span><span style='color: #555555;'>] </span><span>Training GLM... 

</span><span style='color: #555555;font-weight: bold;'>[[ </span><span style='font-weight: bold;'>GLM Regression Training Summary</span><span style='color: #555555;font-weight: bold;'> ]]
</span><span>    MSE = 0.84 (91.88%)
   RMSE = 0.92 (71.51%)
    MAE = 0.75 (69.80%)
      r = 0.96 (p = 5.9e-81)
    rho = 0.95 (p = 0.00)
   R sq = </span><span style='color: #00BBBB;font-weight: bold;'>0.92</span><span>

</span><span style='color: #555555;font-weight: bold;'>[[ </span><span style='font-weight: bold;'>GLM Regression Testing Summary</span><span style='color: #555555;font-weight: bold;'> ]]
</span><span>    MSE = 1.22 (89.03%)
   RMSE = 1.10 (66.88%)
    MAE = 0.90 (66.66%)
      r = 0.94 (p = 2.5e-26)
    rho = 0.95 (p = 0.00)
   R sq = </span><span style='color: #00BBBB;font-weight: bold;'>0.89</span><span>
</span></CODE></PRE>![](87-Supervised_files/figure-latex/unnamed-chunk-9-1.pdf)<!-- --> <PRE class="fansi fansi-output"><CODE>
<span style='color: #555555;'>[2020-10-19 20:20:26</span><span style='color: #555555;font-weight: bold;'> s.GLM</span><span style='color: #555555;'>] Run completed in 4.4e-03 minutes (Real: 0.26; User: 0.07; System: 0.01)</span><span> 
</span></CODE></PRE>

The `dataPrepare()` function will check data dimensions and determine whether data was input as separate feature and outcome sets or combined and ensure the correct number of cases and features was provided.  

In either scenario, Regression will be performed if the outcome is numeric and Classification if the outcome is a factor.


## Regression

### Check Data with `checkData()`


```r
x <- rnormmat(500, 50, seed = 2019)
w <- rnorm(50)
y <- x %*% w + rnorm(500)
dat <- data.frame(x, y)
res <- resample(dat)
```

<PRE class="fansi fansi-output"><CODE><span style='color: #555555;'>[2020-10-19 20:20:28</span><span style='color: #555555;font-weight: bold;'> resample</span><span style='color: #555555;'>] </span><span>Input contains more than one columns; will stratify on last 
</span><span style='color: #555555;font-weight: bold;'>[[ </span><span style='font-weight: bold;'>Resampling Parameters</span><span style='color: #555555;font-weight: bold;'> ]]
</span><span>    n.resamples: 10 
      resampler: strat.sub 
   stratify.var: y 
        train.p: 0.75 
   strat.n.bins: 4 

</span><span style='color: #555555;'>[2020-10-19 20:20:28</span><span style='color: #555555;font-weight: bold;'> resample</span><span style='color: #555555;'>] </span><span>Created 10 stratified subsamples 
</span></CODE></PRE>

```r
dat.train <- dat[res$Subsample_1, ]
dat.test <- dat[-res$Subsample_1, ]
```


```r
checkData(x)
```

<PRE class="fansi fansi-output"><CODE>  Dataset: <span style='color: #00BBBB;font-weight: bold;'>x</span><span> 

  </span><span style='color: #555555;font-weight: bold;'>[[ </span><span style='font-weight: bold;'>Summary</span><span style='color: #555555;font-weight: bold;'> ]]
</span><span>  </span><span style='font-weight: bold;'>500</span><span> cases with </span><span style='font-weight: bold;'>50</span><span> features: 
  * </span><span style='font-weight: bold;'>50</span><span> continuous features 
  * </span><span style='font-weight: bold;'>0</span><span> integer features 
  * </span><span style='font-weight: bold;'>0</span><span> categorical features
  * </span><span style='font-weight: bold;'>0</span><span> constant features 
  * </span><span style='font-weight: bold;'>0</span><span> duplicated cases 
  * </span><span style='font-weight: bold;'>0</span><span> features include 'NA' values

  </span><span style='color: #555555;font-weight: bold;'>[[ </span><span style='font-weight: bold;'>Recommendations</span><span style='color: #555555;font-weight: bold;'> ]]
</span><span style='color: #00BB00;font-weight: bold;'>  * Everything looks good
</span><span>
</span></CODE></PRE>


### Single Model


```r
mod <- s.GLM(dat.train, dat.test)
```

<PRE class="fansi fansi-output"><CODE><span style='color: #555555;'>[2020-10-19 20:20:28</span><span style='color: #555555;font-weight: bold;'> s.GLM</span><span style='color: #555555;'>] Hello,</span><span> </span><span style='color: #555555;'>egenn</span><span> 

</span><span style='color: #555555;font-weight: bold;'>[[ </span><span style='font-weight: bold;'>Regression Input Summary</span><span style='color: #555555;font-weight: bold;'> ]]
</span><span>   Training features: </span><span style='font-weight: bold;'>374 x 50 
</span><span>    Training outcome: </span><span style='font-weight: bold;'>374 x 1 
</span><span>    Testing features: </span><span style='font-weight: bold;'>126 x 50 
</span><span>     Testing outcome: </span><span style='font-weight: bold;'>126 x 1 
</span><span>
</span><span style='color: #555555;'>[2020-10-19 20:20:28</span><span style='color: #555555;font-weight: bold;'> s.GLM</span><span style='color: #555555;'>] </span><span>Training GLM... 

</span><span style='color: #555555;font-weight: bold;'>[[ </span><span style='font-weight: bold;'>GLM Regression Training Summary</span><span style='color: #555555;font-weight: bold;'> ]]
</span><span>    MSE = 1.02 (97.81%)
   RMSE = 1.01 (85.18%)
    MAE = 0.81 (84.62%)
      r = 0.99 (p = 1.3e-310)
    rho = 0.99 (p = 0.00)
   R sq = </span><span style='color: #00BBBB;font-weight: bold;'>0.98</span><span>

</span><span style='color: #555555;font-weight: bold;'>[[ </span><span style='font-weight: bold;'>GLM Regression Testing Summary</span><span style='color: #555555;font-weight: bold;'> ]]
</span><span>    MSE = 0.98 (97.85%)
   RMSE = 0.99 (85.35%)
    MAE = 0.76 (85.57%)
      r = 0.99 (p = 2.7e-105)
    rho = 0.98 (p = 0.00)
   R sq = </span><span style='color: #00BBBB;font-weight: bold;'>0.98</span><span>
</span></CODE></PRE>![](87-Supervised_files/figure-latex/unnamed-chunk-11-1.pdf)<!-- --> <PRE class="fansi fansi-output"><CODE>
<span style='color: #555555;'>[2020-10-19 20:20:28</span><span style='color: #555555;font-weight: bold;'> s.GLM</span><span style='color: #555555;'>] Run completed in 0.01 minutes (Real: 0.32; User: 0.10; System: 0.01)</span><span> 
</span></CODE></PRE>

### Crossvalidated Model


```r
mod <- elevate(dat, mod = "glm")
```

<PRE class="fansi fansi-output"><CODE><span style='color: #555555;'>[2020-10-19 20:20:30</span><span style='color: #555555;font-weight: bold;'> elevate</span><span style='color: #555555;'>] Hello,</span><span> </span><span style='color: #555555;'>egenn</span><span> 

</span><span style='color: #555555;font-weight: bold;'>[[ </span><span style='font-weight: bold;'>Regression Input Summary</span><span style='color: #555555;font-weight: bold;'> ]]
</span><span>   Training features: </span><span style='font-weight: bold;'>500 x 50 
</span><span>    Training outcome: </span><span style='font-weight: bold;'>500 x 1 
</span><span>
</span><span style='color: #555555;'>[2020-10-19 20:20:30</span><span style='color: #555555;font-weight: bold;'> resLearn</span><span style='color: #555555;'>] </span><span>Training Generalized Linear Model on 10 stratified subsamples... 

</span><span style='color: #555555;font-weight: bold;'>[[ </span><span style='font-weight: bold;'>elevate </span><span style='color: #00BBBB;font-weight: bold;'>GLM</span><span style='color: #555555;font-weight: bold;'> ]]
</span><span>   N repeats = </span><span style='color: #00BBBB;font-weight: bold;'>1</span><span> 
   N resamples = </span><span style='color: #00BBBB;font-weight: bold;'>10</span><span> 
   Resampler = </span><span style='color: #00BBBB;font-weight: bold;'>strat.sub</span><span> 
   Mean MSE of 10 resamples in each repeat = </span><span style='color: #00BBBB;font-weight: bold;'>1.22</span><span>
   Mean MSE reduction in each repeat =  </span><span style='color: #00BBBB;font-weight: bold;'>97.50%
</span><span>
</span></CODE></PRE>![](87-Supervised_files/figure-latex/unnamed-chunk-12-1.pdf)<!-- --> <PRE class="fansi fansi-output"><CODE>
<span style='color: #555555;'>[2020-10-19 20:20:32</span><span style='color: #555555;font-weight: bold;'> elevate</span><span style='color: #555555;'>] Run completed in 0.03 minutes (Real: 1.60; User: 0.78; System: 0.08)</span><span> 
</span></CODE></PRE>

Use the `describe()` function to get a summary in (plain) English:


```r
mod$describe()
```

```
Regression was performed using Generalized Linear Model. Model generalizability was assessed using 10 stratified subsamples. The mean R-squared across all resamples was 0.97.
```


```r
mod$plot()
```

![](87-Supervised_files/figure-latex/unnamed-chunk-14-1.pdf)<!-- --> 


## Classification

### Check Data


```r
data(Sonar, package = 'mlbench')
checkData(Sonar)
```

<PRE class="fansi fansi-output"><CODE>  Dataset: <span style='color: #00BBBB;font-weight: bold;'>Sonar</span><span> 

  </span><span style='color: #555555;font-weight: bold;'>[[ </span><span style='font-weight: bold;'>Summary</span><span style='color: #555555;font-weight: bold;'> ]]
</span><span>  </span><span style='font-weight: bold;'>208</span><span> cases with </span><span style='font-weight: bold;'>61</span><span> features: 
  * </span><span style='font-weight: bold;'>60</span><span> continuous features 
  * </span><span style='font-weight: bold;'>0</span><span> integer features 
  * </span><span style='font-weight: bold;'>1</span><span> categorical feature, which is not ordered
  * </span><span style='font-weight: bold;'>0</span><span> constant features 
  * </span><span style='font-weight: bold;'>0</span><span> duplicated cases 
  * </span><span style='font-weight: bold;'>0</span><span> features include 'NA' values

  </span><span style='color: #555555;font-weight: bold;'>[[ </span><span style='font-weight: bold;'>Recommendations</span><span style='color: #555555;font-weight: bold;'> ]]
</span><span style='color: #00BB00;font-weight: bold;'>  * Everything looks good
</span><span>
</span></CODE></PRE>

```r
res <- resample(Sonar)
```

<PRE class="fansi fansi-output"><CODE><span style='color: #555555;'>[2020-10-19 20:20:40</span><span style='color: #555555;font-weight: bold;'> resample</span><span style='color: #555555;'>] </span><span>Input contains more than one columns; will stratify on last 
</span><span style='color: #555555;font-weight: bold;'>[[ </span><span style='font-weight: bold;'>Resampling Parameters</span><span style='color: #555555;font-weight: bold;'> ]]
</span><span>    n.resamples: 10 
      resampler: strat.sub 
   stratify.var: y 
        train.p: 0.75 
   strat.n.bins: 4 
</span><span style='color: #555555;'>[2020-10-19 20:20:40</span><span style='color: #555555;font-weight: bold;'> strat.sub</span><span style='color: #555555;'>] </span><span>Using max n bins possible = 2 

</span><span style='color: #555555;'>[2020-10-19 20:20:40</span><span style='color: #555555;font-weight: bold;'> resample</span><span style='color: #555555;'>] </span><span>Created 10 stratified subsamples 
</span></CODE></PRE>

```r
sonar.train <- Sonar[res$Subsample_1, ]
sonar.test <- Sonar[-res$Subsample_1, ]
```

### Single model


```r
mod <- s.RANGER(sonar.train, sonar.test)
```

<PRE class="fansi fansi-output"><CODE><span style='color: #555555;'>[2020-10-19 20:20:40</span><span style='color: #555555;font-weight: bold;'> s.RANGER</span><span style='color: #555555;'>] Hello,</span><span> </span><span style='color: #555555;'>egenn</span><span> 

</span><span style='color: #555555;'>[2020-10-19 20:20:40</span><span style='color: #555555;font-weight: bold;'> dataPrepare</span><span style='color: #555555;'>] </span><span>Imbalanced classes: using Inverse Probability Weighting 

</span><span style='color: #555555;font-weight: bold;'>[[ </span><span style='font-weight: bold;'>Classification Input Summary</span><span style='color: #555555;font-weight: bold;'> ]]
</span><span>   Training features: </span><span style='font-weight: bold;'>155 x 60 
</span><span>    Training outcome: </span><span style='font-weight: bold;'>155 x 1 
</span><span>    Testing features: </span><span style='font-weight: bold;'>53 x 60 
</span><span>     Testing outcome: </span><span style='font-weight: bold;'>53 x 1 
</span><span>
</span><span style='color: #555555;font-weight: bold;'>[[ </span><span style='font-weight: bold;'>Parameters</span><span style='color: #555555;font-weight: bold;'> ]]
</span><span>   n.trees: 1000 
      mtry: NULL 

</span><span style='color: #555555;'>[2020-10-19 20:20:40</span><span style='color: #555555;font-weight: bold;'> s.RANGER</span><span style='color: #555555;'>] </span><span>Training Random Forest (ranger) Classification with 1000 trees... 

</span><span style='color: #555555;font-weight: bold;'>[[ </span><span style='font-weight: bold;'>RANGER Classification Training Summary</span><span style='color: #555555;font-weight: bold;'> ]]
</span><span style='font-weight: bold;'>                   Reference</span><span> 
</span><span style='font-weight: bold;'>        Estimated</span><span>  </span><span style='color: #00BBBB;font-weight: bold;'>M   R   </span><span>
</span><span style='color: #00BBBB;font-weight: bold;'>                M</span><span>  83   0
</span><span style='color: #00BBBB;font-weight: bold;'>                R</span><span>   0  72

                   </span><span style='color: #00BBBB;font-weight: bold;'>Overall  </span><span>
      Sensitivity  1      
      Specificity  1      
Balanced Accuracy  1      
              PPV  1      
              NPV  1      
               F1  1      
         Accuracy  1      
              AUC  1      

  Positive Class:  </span><span style='color: #00BBBB;font-weight: bold;'>M</span><span> 

</span><span style='color: #555555;font-weight: bold;'>[[ </span><span style='font-weight: bold;'>RANGER Classification Testing Summary</span><span style='color: #555555;font-weight: bold;'> ]]
</span><span style='font-weight: bold;'>                   Reference</span><span> 
</span><span style='font-weight: bold;'>        Estimated</span><span>  </span><span style='color: #00BBBB;font-weight: bold;'>M   R   </span><span>
</span><span style='color: #00BBBB;font-weight: bold;'>                M</span><span>  25  12
</span><span style='color: #00BBBB;font-weight: bold;'>                R</span><span>   3  13

                   </span><span style='color: #00BBBB;font-weight: bold;'>Overall  </span><span>
      Sensitivity  0.8929 
      Specificity  0.5200 
Balanced Accuracy  0.7064 
              PPV  0.6757 
              NPV  0.8125 
               F1  0.7692 
         Accuracy  0.7170 
              AUC  0.8479 

  Positive Class:  </span><span style='color: #00BBBB;font-weight: bold;'>M</span><span> 
</span></CODE></PRE>![](87-Supervised_files/figure-latex/unnamed-chunk-16-1.pdf)<!-- --> <PRE class="fansi fansi-output"><CODE>
<span style='color: #555555;'>[2020-10-19 20:20:40</span><span style='color: #555555;font-weight: bold;'> s.RANGER</span><span style='color: #555555;'>] Run completed in 0.01 minutes (Real: 0.56; User: 0.46; System: 0.02)</span><span> 
</span></CODE></PRE>


### Crossvalidated Model


```r
mod <- elevate(Sonar)
```

<PRE class="fansi fansi-output"><CODE><span style='color: #555555;'>[2020-10-19 20:20:42</span><span style='color: #555555;font-weight: bold;'> elevate</span><span style='color: #555555;'>] Hello,</span><span> </span><span style='color: #555555;'>egenn</span><span> 

</span><span style='color: #555555;font-weight: bold;'>[[ </span><span style='font-weight: bold;'>Classification Input Summary</span><span style='color: #555555;font-weight: bold;'> ]]
</span><span>   Training features: </span><span style='font-weight: bold;'>208 x 60 
</span><span>    Training outcome: </span><span style='font-weight: bold;'>208 x 1 
</span><span>
</span><span style='color: #555555;'>[2020-10-19 20:20:42</span><span style='color: #555555;font-weight: bold;'> resLearn</span><span style='color: #555555;'>] </span><span>Training Random Forest (ranger) on 10 stratified subsamples... 

</span><span style='color: #555555;font-weight: bold;'>[[ </span><span style='font-weight: bold;'>elevate </span><span style='color: #00BBBB;font-weight: bold;'>RANGER</span><span style='color: #555555;font-weight: bold;'> ]]
</span><span>   N repeats = </span><span style='color: #00BBBB;font-weight: bold;'>1</span><span> 
   N resamples = </span><span style='color: #00BBBB;font-weight: bold;'>10</span><span> 
   Resampler = </span><span style='color: #00BBBB;font-weight: bold;'>strat.sub</span><span> 
   Mean Balanced Accuracy of 10 test sets in each repeat = </span><span style='color: #00BBBB;font-weight: bold;'>0.83</span><span>
</span></CODE></PRE>![](87-Supervised_files/figure-latex/unnamed-chunk-17-1.pdf)<!-- --> <PRE class="fansi fansi-output"><CODE>
<span style='color: #555555;'>[2020-10-19 20:20:46</span><span style='color: #555555;font-weight: bold;'> elevate</span><span style='color: #555555;'>] Run completed in 0.06 minutes (Real: 3.87; User: 4.41; System: 0.16)</span><span> 
</span></CODE></PRE>


```r
mod$describe()
```

```
Classification was performed using Random Forest (ranger). Model generalizability was assessed using 10 stratified subsamples. The mean Balanced Accuracy across all resamples was 0.83.
```


```r
mod$plot()
```

![](87-Supervised_files/figure-latex/unnamed-chunk-19-1.pdf)<!-- --> 


```r
mod$plotROC()
```

![](87-Supervised_files/figure-latex/unnamed-chunk-20-1.pdf)<!-- --> 


```r
mod$plotPR()
```

![](87-Supervised_files/figure-latex/unnamed-chunk-21-1.pdf)<!-- --> 

## **rtemis** documentation

For more information on using **rtemis**, see the [rtemis online documentation and vignettes](https://rtemis.lambdamd.prg)