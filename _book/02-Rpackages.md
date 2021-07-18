# R setup, Packages & Docs {#Rsetup}



## R

This book was compiled using R version 4.0.3 (2020-10-10).  
Make sure you have the latest version by visiting the [R project website](https://www.r-project.org)

It's a good idea to keep a log of the version of R and installed packages when beginning a new project. An easy way to do this is to save the output of `sessionInfo()`:


```r
sessionInfo()
```

```
R version 4.0.3 (2020-10-10)
Platform: x86_64-apple-darwin17.0 (64-bit)
Running under: macOS Catalina 10.15.7

Matrix products: default
BLAS:   /Library/Frameworks/R.framework/Versions/4.0/Resources/lib/libRblas.dylib
LAPACK: /Library/Frameworks/R.framework/Versions/4.0/Resources/lib/libRlapack.dylib

locale:
[1] en_US.UTF-8/en_US.UTF-8/en_US.UTF-8/C/en_US.UTF-8/en_US.UTF-8

attached base packages:
[1] stats     graphics  grDevices utils     datasets  methods   base     

loaded via a namespace (and not attached):
 [1] rstudioapi_0.11      knitr_1.30.2         xml2_1.3.2          
 [4] magrittr_1.5         rappdirs_0.3.1       downlit_0.2.1       
 [7] R6_2.5.0             rlang_0.4.8          stringr_1.4.0       
[10] tools_4.0.3          xfun_0.19            jquerylib_0.1.2     
[13] htmltools_0.5.0.9002 ellipsis_0.3.1       yaml_2.2.1          
[16] digest_0.6.27        tibble_3.0.4         lifecycle_0.2.0     
[19] crayon_1.3.4         bookdown_0.21.4      sass_0.2.0.9005     
[22] vctrs_0.3.4          fs_1.5.0             evaluate_0.14       
[25] rmarkdown_2.5.3      stringi_1.5.3        compiler_4.0.3      
[28] bslib_0.2.1.9000     pillar_1.4.6         jsonlite_1.7.1      
[31] pkgconfig_2.0.3     
```

## R packages

### CRAN

The Comprehensive R Archive Network (CRAN) is the official R package repository and currently hosts 16271 packages (as of 2020-09-13). To install a package from CRAN, use the builtin `install.packages` command:

```r
install.packages('glmnet')
```

#### Check for outdated packages


```r
old.packages()
```

#### Update installed packages

If you don't set `ask = FALSE`, you will have to accept each package update separately.


```r
update.packages(ask = FALSE)
```

### GitHub

GitHub contains a large number of R packages, some of which also exist in CRAN, but the GitHub version may be updated a lot more frequently. To install from GitHub, you need to have the `remotes` package from CRAN first:


```r
install.packages("remotes")
```


```r
remotes::install_github("username/reponame")
```

Note: Running `remotes::install_github("user/repo")` will not reinstall a previously installed package, unless it has been updated.

### Bioconductor

Bioconductor is a repository which includes tools for the analysis and comprehension of high-throughput genomic data, among others. To install package from Bioconductor, first install the `BiocManager` package from CRAN:


```r
install.packages(“BiocManager")
```

and then use that similar to the builtin `install.packages`:


```r
BiocManager::install("packageName")
```

### Installed packages

List all R packages installed on your system with `installed.packages()` (the following block has not been run to prevent a very long output)


```r
installed.packages()
```

List attached packages with `search()`:


```r
search()
```

```
[1] ".GlobalEnv"        "package:stats"     "package:graphics" 
[4] "package:grDevices" "package:utils"     "package:datasets" 
[7] "package:methods"   "Autoloads"         "package:base"     
```

List attached packages with their system path:


```r
searchpaths()
```

```
[1] ".GlobalEnv"                                                              
[2] "/Library/Frameworks/R.framework/Versions/4.0/Resources/library/stats"    
[3] "/Library/Frameworks/R.framework/Versions/4.0/Resources/library/graphics" 
[4] "/Library/Frameworks/R.framework/Versions/4.0/Resources/library/grDevices"
[5] "/Library/Frameworks/R.framework/Versions/4.0/Resources/library/utils"    
[6] "/Library/Frameworks/R.framework/Versions/4.0/Resources/library/datasets" 
[7] "/Library/Frameworks/R.framework/Versions/4.0/Resources/library/methods"  
[8] "Autoloads"                                                               
[9] "/Library/Frameworks/R.framework/Resources/library/base"                  
```

### Dependencies

Most R packages, whether in CRAN, Bioconductor, or GitHub, themselves rely on other packages to run. These are called **dependencies**. Many of these dependencies get installed automatically when you call `install.packages()` or `remotes::install_github()`, etc. This depends largely on whether they are essential for the new package to work. Some packages, especially if they provide a large number of functions that may not all be used by all users, may make some dependencies optional. In that cases, if you try to execute a specific function that depends on uninstalled packages you may get a warning or error or some type of message indicating that you need to install further packages.

## RStudio IDE

[RStudio](https://rstudio.com/) is an Integrated Development Environment ([IDE](https://en.wikipedia.org/wiki/Integrated_development_environment)) for R, which can make work in R easier, more productive, and more fun. Make sure to keep your installation up-to-date; new features are added often.  

It is recommended to set up a new RStudio project for each data project: Select File > New Project... from the main menu.


## Builtin Documentation

After you've successfully installed R and RStudio, one of the first things to know is how to access and search the builtin documentation.  

### Get help on a specific item

If you know the name of what you're looking for (an R function most commonly, but possibly also the name of a dataset, or a package itself), just type `?` followed by the name of said function, dataset, etc. in the R prompt:


```r
?sample
```

In RStudio, the above example will bring up the documentation for the `sample` function in the dedicated "Help" window, commonly situated at the bottom right (but can be moved by the user freely). If you are running R directly at the system shell, the same information is printed directly at the console.  
Try running the above example on your system.

### Search the docs

If you do not know the name of what you are looking for, you can use double question marks, `??`, followed by your query (this is short for the `help.search` command that provides a number of arguments you can look up using `?help.search`):


```r
??bootstrap
```
