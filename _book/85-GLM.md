# Introduction to the GLM {#glm}



## Generalized Linear Model (GLM)

The Generalized Linear Model is one of the most common and important models in statistics.  
Let's look at an example using the GLM for regression. We will use the `mtcars` builtin dataset to predict horsepower (`hp`) of 32 cars from 10 other features:


```r
str(mtcars)
```

```
'data.frame':	32 obs. of  11 variables:
 $ mpg : num  21 21 22.8 21.4 18.7 18.1 14.3 24.4 22.8 19.2 ...
 $ cyl : num  6 6 4 6 8 6 8 4 4 6 ...
 $ disp: num  160 160 108 258 360 ...
 $ hp  : num  110 110 93 110 175 105 245 62 95 123 ...
 $ drat: num  3.9 3.9 3.85 3.08 3.15 2.76 3.21 3.69 3.92 3.92 ...
 $ wt  : num  2.62 2.88 2.32 3.21 3.44 ...
 $ qsec: num  16.5 17 18.6 19.4 17 ...
 $ vs  : num  0 0 1 1 0 1 0 1 1 1 ...
 $ am  : num  1 1 1 0 0 0 0 0 0 0 ...
 $ gear: num  4 4 4 3 3 3 3 4 4 4 ...
 $ carb: num  4 4 1 1 2 1 4 2 2 4 ...
```


```r
mod <- glm(hp ~ ., family = "gaussian", data = mtcars)
mod
```

```

Call:  glm(formula = hp ~ ., family = "gaussian", data = mtcars)

Coefficients:
(Intercept)          mpg          cyl         disp         drat           wt  
     79.048       -2.063        8.204        0.439       -4.619      -27.660  
       qsec           vs           am         gear         carb  
     -1.784       25.813        9.486        7.216       18.749  

Degrees of Freedom: 31 Total (i.e. Null);  21 Residual
Null Deviance:	    145700 
Residual Deviance: 14160 	AIC: 309.8
```
The `glm()` function accepts a formula that defines the model.  
The formula `hp ~ .` means "regress hp on all other variables". The `family` argument defines we are performing regression and the `data` argument points to the data frame where the covariates used in the formula are found.

For a gaussian output, we can also use the `lm()` function. There are minor differences in the output created, but the model is the same:


```r
mod <- lm(hp ~ ., data = mtcars)
mod
```

```

Call:
lm(formula = hp ~ ., data = mtcars)

Coefficients:
(Intercept)          mpg          cyl         disp         drat           wt  
     79.048       -2.063        8.204        0.439       -4.619      -27.660  
       qsec           vs           am         gear         carb  
     -1.784       25.813        9.486        7.216       18.749  
```

Get summary of the model using `summary()`:


```r
summary(mod)
```

```

Call:
lm(formula = hp ~ ., data = mtcars)

Residuals:
    Min      1Q  Median      3Q     Max 
-38.681 -15.558   0.799  18.106  34.718 

Coefficients:
            Estimate Std. Error t value Pr(>|t|)   
(Intercept)  79.0484   184.5041   0.428  0.67270   
mpg          -2.0631     2.0906  -0.987  0.33496   
cyl           8.2037    10.0861   0.813  0.42513   
disp          0.4390     0.1492   2.942  0.00778 **
drat         -4.6185    16.0829  -0.287  0.77680   
wt          -27.6600    19.2704  -1.435  0.16591   
qsec         -1.7844     7.3639  -0.242  0.81089   
vs           25.8129    19.8512   1.300  0.20758   
am            9.4863    20.7599   0.457  0.65240   
gear          7.2164    14.6160   0.494  0.62662   
carb         18.7487     7.0288   2.667  0.01441 * 
---
Signif. codes:  0 '***' 0.001 '**' 0.01 '*' 0.05 '.' 0.1 ' ' 1

Residual standard error: 25.97 on 21 degrees of freedom
Multiple R-squared:  0.9028,	Adjusted R-squared:  0.8565 
F-statistic:  19.5 on 10 and 21 DF,  p-value: 1.898e-08
```

Note how R prints stars next to covariates whose p-values falls within certain limits, described right below the table of estimates.  
Above, for example, the p-value for `disp` falls between 0.001 and 0.01 and therefore gets highlighted with 2 stars.  

To extract the p-values of the intercept and each coefficient, we use `coef()` on `summary()`. The final (4th) column lists the p-values:


```r
coef(summary(mod))
```

```
               Estimate  Std. Error    t value    Pr(>|t|)
(Intercept)  79.0483879 184.5040756  0.4284371 0.672695339
mpg          -2.0630545   2.0905650 -0.9868407 0.334955314
cyl           8.2037204  10.0861425  0.8133655 0.425134929
disp          0.4390024   0.1492007  2.9423609 0.007779725
drat         -4.6185488  16.0829171 -0.2871711 0.776795845
wt          -27.6600472  19.2703681 -1.4353668 0.165910518
qsec         -1.7843654   7.3639133 -0.2423121 0.810889101
vs           25.8128774  19.8512410  1.3003156 0.207583411
am            9.4862914  20.7599371  0.4569518 0.652397317
gear          7.2164047  14.6160152  0.4937327 0.626619355
carb         18.7486691   7.0287674  2.6674192 0.014412403
```

## Mass-univariate analysis

There are many cases where we have a large number of predictors and, along with any other number of tests or models, we may want to regress our outcome of interest on each covariate, one at a time.  

Let's create some synthetic data with 1000 cases and 100 covariates  
The outcome is generated using just 4 of those 100 covariates and has added noise.


```r
set.seed(2020)
n_col <- 100
n_row <- 1000
x <- as.data.frame(lapply(seq(n_col), function(i) rnorm(n_row)),
                   col.names = paste0("Feature_", seq(n_col)))
dim(x)
```

```
[1] 1000  100
```

```r
y <- .7 + x[, 10] + .3 * x[, 20] + 1.3 * x[, 30] + x[, 50] + rnorm(500)
```

Let's fit a linear model regressing y on each column of x using `lm`:


```r
mod.xy.massuni <- lapply(seq(x), function(i) lm(y ~ x[, i]))
length(mod.xy.massuni)
```

```
[1] 100
```

```r
names(mod.xy.massuni) <- paste0("mod", seq(x))
```

To extract p-values for each model, we must find where exactly to look.  
Let's look into the first model:

```r
(ms1 <- summary(mod.xy.massuni$mod1))
```

```

Call:
lm(formula = y ~ x[, i])

Residuals:
    Min      1Q  Median      3Q     Max 
-8.5402 -1.4881 -0.0618  1.4968  5.8152 

Coefficients:
            Estimate Std. Error t value Pr(>|t|)    
(Intercept)  0.61800    0.06878   8.985   <2e-16 ***
x[, i]       0.08346    0.06634   1.258    0.209    
---
Signif. codes:  0 '***' 0.001 '**' 0.01 '*' 0.05 '.' 0.1 ' ' 1

Residual standard error: 2.174 on 998 degrees of freedom
Multiple R-squared:  0.001584,	Adjusted R-squared:  0.0005831 
F-statistic: 1.583 on 1 and 998 DF,  p-value: 0.2086
```

```r
ms1$coefficients
```

```
              Estimate Std. Error  t value     Pr(>|t|)
(Intercept) 0.61800326 0.06878142 8.985032 1.266204e-18
x[, i]      0.08346393 0.06634074 1.258110 2.086464e-01
```

The p-values for each feature is stored in row 1, column 4 fo the coefficients matrix. Let's extract all of them:

```r
mod.xy.massuni.pvals <- sapply(mod.xy.massuni, function(i) summary(i)$coefficients[2, 4])
```
Let's see which variable are significant at the 0.05:

```r
which(mod.xy.massuni.pvals < .05)
```

```
 mod5 mod10 mod12 mod20 mod28 mod30 mod42 mod50 mod61 mod65 mod72 mod82 mod85 
    5    10    12    20    28    30    42    50    61    65    72    82    85 
mod91 mod94 mod99 
   91    94    99 
```
...and which are significant at the 0.01 level:

```r
which(mod.xy.massuni.pvals < .01)
```

```
mod10 mod20 mod28 mod30 mod50 
   10    20    28    30    50 
```

## Multiple comparison correction

We've performed a large number of tests and before reporting the results, we need to control for [multiple comparisons](https://en.wikipedia.org/wiki/Multiple_comparisons_problem).  
To do that, we use R's `p.adjust()` function. It adjusts a vector of p-values to account for multiple comparisons using one of multiple methods. The default, and recommended, is the [Holm method](https://en.wikipedia.org/wiki/Holm%E2%80%93Bonferroni_method). It ensures that `FWER < α`, i.e. controls the [family-wise error rate](https://en.wikipedia.org/wiki/Family-wise_error_rate), a.k.a. the probability of making one or more false discoveries (Type I errors) 


```r
mod.xy.massuni.pvals.holm_adjusted <- p.adjust(mod.xy.massuni.pvals)
```

Now, let's see which features' p-values survive the magical .05 threshold:


```r
which(mod.xy.massuni.pvals.holm_adjusted < .05)
```

```
mod10 mod20 mod30 mod50 
   10    20    30    50 
```

These are indeed the correct features (not surprisingly, still reassuringly).
