# Introduction to the GLM {#glm}


```
##   .:rtemis 0.8.1: Welcome, egenn
##   [x86_64-apple-darwin17.0 (64-bit): Defaulting to 4/4 available cores]
##   Documentation & vignettes: https://rtemis.lambdamd.org
##   Learn R: https://class.lambdamd.org/pdsr
```

<STYLE type='text/css' scoped>
PRE.fansi SPAN {padding-top: .25em; padding-bottom: .25em};
</STYLE>

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

```r
class(mod)
```

```
[1] "glm" "lm" 
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

```r
class(mod)
```

```
[1] "lm"
```
### Summary

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

### Coefficients


```r
coefficients(mod)
```

```
(Intercept)         mpg         cyl        disp        drat          wt 
 79.0483879  -2.0630545   8.2037204   0.4390024  -4.6185488 -27.6600472 
       qsec          vs          am        gear        carb 
 -1.7843654  25.8128774   9.4862914   7.2164047  18.7486691 
```

```r
# or
mod$coefficients
```

```
(Intercept)         mpg         cyl        disp        drat          wt 
 79.0483879  -2.0630545   8.2037204   0.4390024  -4.6185488 -27.6600472 
       qsec          vs          am        gear        carb 
 -1.7843654  25.8128774   9.4862914   7.2164047  18.7486691 
```

### Fitted values


```r
fitted(mod)
```

```
          Mazda RX4       Mazda RX4 Wag          Datsun 710      Hornet 4 Drive 
          148.68122           140.62866            79.99158           125.75448 
  Hornet Sportabout             Valiant          Duster 360           Merc 240D 
          183.21756           111.38490           228.02497            77.13692 
           Merc 230            Merc 280           Merc 280C          Merc 450SE 
           72.71717           146.00088           147.81854           152.01285 
         Merc 450SL         Merc 450SLC  Cadillac Fleetwood Lincoln Continental 
          159.20364           161.43931           236.24493           226.12625 
  Chrysler Imperial            Fiat 128         Honda Civic      Toyota Corolla 
          210.31169            48.04587            83.55415            50.29692 
      Toyota Corona    Dodge Challenger         AMC Javelin          Camaro Z28 
           65.46675           171.23732           165.49280           216.59542 
   Pontiac Firebird           Fiat X1-9       Porsche 914-2        Lotus Europa 
          188.81358            67.04615            84.64992           110.35672 
     Ford Pantera L        Ferrari Dino       Maserati Bora          Volvo 142E 
          253.68881           188.34908           300.28196            93.42896 
```

```r
# or
mod$fitted.values
```

```
          Mazda RX4       Mazda RX4 Wag          Datsun 710      Hornet 4 Drive 
          148.68122           140.62866            79.99158           125.75448 
  Hornet Sportabout             Valiant          Duster 360           Merc 240D 
          183.21756           111.38490           228.02497            77.13692 
           Merc 230            Merc 280           Merc 280C          Merc 450SE 
           72.71717           146.00088           147.81854           152.01285 
         Merc 450SL         Merc 450SLC  Cadillac Fleetwood Lincoln Continental 
          159.20364           161.43931           236.24493           226.12625 
  Chrysler Imperial            Fiat 128         Honda Civic      Toyota Corolla 
          210.31169            48.04587            83.55415            50.29692 
      Toyota Corona    Dodge Challenger         AMC Javelin          Camaro Z28 
           65.46675           171.23732           165.49280           216.59542 
   Pontiac Firebird           Fiat X1-9       Porsche 914-2        Lotus Europa 
          188.81358            67.04615            84.64992           110.35672 
     Ford Pantera L        Ferrari Dino       Maserati Bora          Volvo 142E 
          253.68881           188.34908           300.28196            93.42896 
```

### Residuals


```r
residuals(mod)
```

```
          Mazda RX4       Mazda RX4 Wag          Datsun 710      Hornet 4 Drive 
         -38.681220          -30.628664           13.008418          -15.754483 
  Hornet Sportabout             Valiant          Duster 360           Merc 240D 
          -8.217565           -6.384902           16.975025          -15.136925 
           Merc 230            Merc 280           Merc 280C          Merc 450SE 
          22.282827          -23.000881          -24.818538           27.987149 
         Merc 450SL         Merc 450SLC  Cadillac Fleetwood Lincoln Continental 
          20.796356           18.560690          -31.244931          -11.126253 
  Chrysler Imperial            Fiat 128         Honda Civic      Toyota Corolla 
          19.688306           17.954127          -31.554152           14.703084 
      Toyota Corona    Dodge Challenger         AMC Javelin          Camaro Z28 
          31.533250          -21.237322          -15.492798           28.404576 
   Pontiac Firebird           Fiat X1-9       Porsche 914-2        Lotus Europa 
         -13.813582           -1.046152            6.350078            2.643283 
     Ford Pantera L        Ferrari Dino       Maserati Bora          Volvo 142E 
          10.311194          -13.349075           34.718037           15.571042 
```

```r
# or
mod$residuals
```

```
          Mazda RX4       Mazda RX4 Wag          Datsun 710      Hornet 4 Drive 
         -38.681220          -30.628664           13.008418          -15.754483 
  Hornet Sportabout             Valiant          Duster 360           Merc 240D 
          -8.217565           -6.384902           16.975025          -15.136925 
           Merc 230            Merc 280           Merc 280C          Merc 450SE 
          22.282827          -23.000881          -24.818538           27.987149 
         Merc 450SL         Merc 450SLC  Cadillac Fleetwood Lincoln Continental 
          20.796356           18.560690          -31.244931          -11.126253 
  Chrysler Imperial            Fiat 128         Honda Civic      Toyota Corolla 
          19.688306           17.954127          -31.554152           14.703084 
      Toyota Corona    Dodge Challenger         AMC Javelin          Camaro Z28 
          31.533250          -21.237322          -15.492798           28.404576 
   Pontiac Firebird           Fiat X1-9       Porsche 914-2        Lotus Europa 
         -13.813582           -1.046152            6.350078            2.643283 
     Ford Pantera L        Ferrari Dino       Maserati Bora          Volvo 142E 
          10.311194          -13.349075           34.718037           15.571042 
```


### p-values

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

### Plot linear fit

You use `lines()` to add a line on top of a scatterplot drawn with `plot()`.  
`lines()` accepts `x` and `y` vectors of coordinates:


```r
set.seed(2020)
x <- rnorm(500)
y <- .73 * x + .5 * rnorm(500)
xy.fit <- lm(y~x)$fitted
plot(x, y, pch = 16, col = "#18A3AC99")
lines(x, xy.fit, col = "#178CCB", lwd = 2)
```

<img src="85-GLM_files/figure-html/unnamed-chunk-11-1.png" width="432" />

In **rtemis**, you can use argument `fit` to use any supported algorithm (see `modSelect()`) to estimate the fit:


```r
mplot3.xy(x, y, fit = "glm")
```

<img src="85-GLM_files/figure-html/unnamed-chunk-12-1.png" width="432" />

### Classification

For classification, you use `glm()` with `family = binomial`


```r
data(PimaIndiansDiabetes2, package = 'mlbench')
str(PimaIndiansDiabetes2)
```

```
'data.frame':	768 obs. of  9 variables:
 $ pregnant: num  6 1 8 1 0 5 3 10 2 8 ...
 $ glucose : num  148 85 183 89 137 116 78 115 197 125 ...
 $ pressure: num  72 66 64 66 40 74 50 NA 70 96 ...
 $ triceps : num  35 29 NA 23 35 NA 32 NA 45 NA ...
 $ insulin : num  NA NA NA 94 168 NA 88 NA 543 NA ...
 $ mass    : num  33.6 26.6 23.3 28.1 43.1 25.6 31 35.3 30.5 NA ...
 $ pedigree: num  0.627 0.351 0.672 0.167 2.288 ...
 $ age     : num  50 31 32 21 33 30 26 29 53 54 ...
 $ diabetes: Factor w/ 2 levels "neg","pos": 2 1 2 1 2 1 2 1 2 2 ...
```

```r
diabetes_mod <- glm(diabetes ~ ., PimaIndiansDiabetes2, family = "binomial")
diabetes_mod
```

```

Call:  glm(formula = diabetes ~ ., family = "binomial", data = PimaIndiansDiabetes2)

Coefficients:
(Intercept)     pregnant      glucose     pressure      triceps      insulin  
 -1.004e+01    8.216e-02    3.827e-02   -1.420e-03    1.122e-02   -8.253e-04  
       mass     pedigree          age  
  7.054e-02    1.141e+00    3.395e-02  

Degrees of Freedom: 391 Total (i.e. Null);  383 Residual
  (376 observations deleted due to missingness)
Null Deviance:	    498.1 
Residual Deviance: 344 	AIC: 362
```


```r
summary(diabetes_mod)
```

```

Call:
glm(formula = diabetes ~ ., family = "binomial", data = PimaIndiansDiabetes2)

Deviance Residuals: 
    Min       1Q   Median       3Q      Max  
-2.7823  -0.6603  -0.3642   0.6409   2.5612  

Coefficients:
              Estimate Std. Error z value Pr(>|z|)    
(Intercept) -1.004e+01  1.218e+00  -8.246  < 2e-16 ***
pregnant     8.216e-02  5.543e-02   1.482  0.13825    
glucose      3.827e-02  5.768e-03   6.635 3.24e-11 ***
pressure    -1.420e-03  1.183e-02  -0.120  0.90446    
triceps      1.122e-02  1.708e-02   0.657  0.51128    
insulin     -8.253e-04  1.306e-03  -0.632  0.52757    
mass         7.054e-02  2.734e-02   2.580  0.00989 ** 
pedigree     1.141e+00  4.274e-01   2.669  0.00760 ** 
age          3.395e-02  1.838e-02   1.847  0.06474 .  
---
Signif. codes:  0 '***' 0.001 '**' 0.01 '*' 0.05 '.' 0.1 ' ' 1

(Dispersion parameter for binomial family taken to be 1)

    Null deviance: 498.10  on 391  degrees of freedom
Residual deviance: 344.02  on 383  degrees of freedom
  (376 observations deleted due to missingness)
AIC: 362.02

Number of Fisher Scoring iterations: 5
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
