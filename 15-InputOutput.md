# Data Input/Output {#dataio}



## R datasets

### Datasets included with R (in package 'datasets')

List builtin datasets with `data` and no arguments:


```r
data()
```

These builtin datasets are normally readily available in the R console (because the `datasets` package is automatically loaded)  
You can check if this is the case using `search()`


```r
search()
```

```
[1] ".GlobalEnv"        "package:stats"     "package:graphics" 
[4] "package:grDevices" "package:utils"     "package:datasets" 
[7] "package:methods"   "Autoloads"         "package:base"     
```

### Datasets included with other packages

List a dataset included with some R package:


```r
data(package = "glmnet")
data(package = "MASS")
data(package = "mlbench")
```

Load a dataset from some R package:


```r
data(Sonar, package = "mlbench")
```

Note: quotes around "Sonar" in the `data()` command above are optional.

## System commands

Get working directory with `getwd()`


```r
getwd()
```

You can set a different working directory with `setwd()`  

List files in current directory:


```r
dir()
```

You can execute a command of you operating system (OS) -i.e. MacOS, Linux, Windows- from within R using the `system()` function:


```r
system("uname -a")
```

Note: See issue [here](https://stackoverflow.com/questions/27388964/rmarkdown-not-outputting-results-of-system-command-to-html-file)

## Data I/O

### Read local CSV

`read.table()` is the core function that reads data from formatted text files in R, where cases correspond to lines and variables to columns. Its many arguments allow to read different formats.  
`read.csv()` is an alias for `read.table()` that defaults to commas as separators and dots for decimal points. (Run `read.csv` in the console to print its source and see for yourself and read the documentation with `?read.table`). 

Some important arguments for `read.table()` listed here with their default values for `read.csv()`:

* `sep = ","`: Character that separate entries. Default is a comma; use "\t" for tab-separated files (default setting in `read.delim()`)
* `dec = "."`: Character for the decimal point. Defaultis a dot; in some cases where a comma is used as the decimal point, the entry separator `sep` may be a semicolon (default setting in `read.csv2()`)
* `na.strings = "NA"`: Character vector of strings to be coded as "NA"


```r
men <-  read.csv("../Data/pone.0204161.s001.csv")
```

### Read data from the web

`read.csv()` can directly read an online file. In the second example below, we also define that missing data is coded with `?`  using the `na.strings` argument:


```r
parkinsons <- read.csv("https://archive.ics.uci.edu/ml/machine-learning-databases/parkinsons/parkinsons.data")

sleep <- read.csv("https://www.openml.org/data/get_csv/53273/sleep.arff",
                  na.strings = "?")
```

The above files are read from two very popular online [data repositories](https://rtemis.lambdamd.org/resources.html#datasets). Confusingly, neither file ends in `.csv`, but they both work with `read.csv()`. Always look at the plain text file first to determine if it can work with `read.table()` /`read.csv()` and what settings to use.

### Read zipped data from the web 

#### using base gzcon and csv.read

`read.table()` /`read.csv()` also accepts a "connection" as input.  
Here we define a connection to a zipped file by nesting `gzcon()` and `url()`:


```r
con <- gzcon(url("https://github.com/EpistasisLab/pmlb/raw/master/datasets/breast_cancer_wisconsin/breast_cancer_wisconsin.tsv.gz"),
             text = TRUE)
```

We read the connection and specify the file is tab-separated, or call `read.delim()`:


```r
bcw <- read.csv(con, header = TRUE, sep = "\t")

#same as
bcw <- read.delim(con, header = TRUE)
```

#### using **data.table**'s `fread()`

You can also use __data.table__'s `fread()`, which will directly handle zipped files:


```r
library(data.table)
bcw2 <- fread("https://github.com/EpistasisLab/penn-ml-benchmarks/raw/master/datasets/classification/breast-cancer-wisconsin/breast-cancer-wisconsin.tsv.gz")
```

If you want to stick to using data frames, set the argument `data.table` to `FALSE`:


```r
bcw2 <- fread("https://github.com/EpistasisLab/penn-ml-benchmarks/raw/master/datasets/classification/breast-cancer-wisconsin/breast-cancer-wisconsin.tsv.gz",
              data.table = FALSE)
```

### Write to CSV

Use the `write.csv()` function to write an R object (usually data frame or matrix) to a CSV file. Setting `row.names = FALSE` is usually a good idea. (Instead of storing data in rownames, it's usually best to create a new column.)


```r
write.csv(iris, "../Data/iris.csv", row.names = FALSE)
```

Note that in this case we did not need to save row names (which are just integers 1 to  150 and would add a useless extra column in the output)

### Read .xslx using `openxlsx::read.xlsx()`

As an example, we can read the csv we saved earlier into Excel and then save it as a .xlsx file.  


```r
iris.path <- normalizePath("../Data/iris.xlsx")
iris2 <- openxlsx::read.xlsx(iris.path)
```

Note: `openxlsx::read.xlsx()` does not work with a relative path like `"./Data/iris.xlsc"`. Therefore we used the `normalizePath()` function to give us the full path of the file without having to type it out.

Check that the data is still identical:


```r
all(iris == iris2)
```

### Write an R object to RDS

You can write any R object directly to file so that you can recover it at any time, share it, etc. Remember that since a list can contain any number of objects of any type, you can save any collection of objects as an RDS file. For multiple objects, see also the `save.image` command below.


```r
saveRDS(iris, "iris.rds")
```

To load an object saved in an rds file, assign it to an object  usig `readRDS`:


```r
iris_fromFile <- readRDS("iris.rds")
all(iris == iris_fromFile)
```

### Write multiple R objects to RData file using `save`


```r
mat1 <- sapply(seq_len(10), function(i) rnorm(500))
mat2 <- sapply(seq_len(10), function(i) rnorm(500))
save(mat1, mat2, file = "./mat.RData")
```

Note: we will learn how to use `sapply` later under "Loop functions"

To load the variables in the `.RData` file you saved, use the `load` command:


```r
load("./Rmd/mat.RData")
```

Note that `load` adds the objects to your workspace using with their original names. You do not assign them to a new object, unlike with the `readRDS` call above.

### Write your entire workspace to a RData image using `save.image`

You can save your entire workspace to a RData file using the `save.image` function.  


```r
save.image("workspace_10_05_2020.RData")
```

Same as above, to re-load the workspace saved in the `.RData` file, use the `load` command:


```r
load("workspace_10_05_2020.RData")
```