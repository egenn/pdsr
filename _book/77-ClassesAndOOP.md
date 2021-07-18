# Classes and Object-Oriented Programming {#classes}



Object-Oriented Programming (OOP) is a programming paradigm built around objects with associated data, known as attributes, and functions, known as methods.  

There are 4 main class systems in R:  

* S3: informally defined, minimal, lean, methods dispatch based on class; `base` and `stats` packages use S3 exclusively
* S4: formally defined, allows method dispatch on multiple arguments
* RC: Reference class: Reference semantics; similar to other programming languages; methods are part of the object
* R6: 3rd party class system similar to RC, more lightweight, faster

S3 and S4 methods are part of generic functions. RC and R6 methods are part of the object, but you can (and should) write generic functions for them as well.  

This chapter will focus on the ubiquitous S3 system. For more advanced (and real OOP) applications, we recommend looking into the [R6](https://r6.r-lib.org/index.html) system.

## S3

Most R objects we have been using so far are S3 objects. Data frames are some of the most common S3 objects.  

Generic functions are functions that act differently based on the class of the input object. We have already used many of them. For example, `summary()` works differently on a `data.frame`, on a `factor`, or a `glm` object, etc.

Generic functions in R are saved as `functionname.classname()` and called automatically, based on the class of the first argument. This allows the same function, e.g. `print()`, `summary()`, `c()`, to have a different effect on objects of different classes.
For example, the `print()` function applied on a data frame, will actually call `print.data.frame()`, while applied on a factor, it will call `print.factor()`.  
This means that when you type `print(iris)` this calls `print.data.frame(iris)`

Note how the R documentation lists usage information separately for each S3 method, e.g. `## S3 method for class 'factor'`

### `methods()` {#s3methods}

To get a list of all available methods defined for a specific class,  
i.e. ***"What different functions can I use on this object?"***


```r
methods(class = "data.frame")
```

```
 [1] [             [[            [[<-          [<-           $<-          
 [6] aggregate     anyDuplicated anyNA         as.data.frame as.list      
[11] as.matrix     by            cbind         coerce        dim          
[16] dimnames      dimnames<-    droplevels    duplicated    edit         
[21] format        formula       head          initialize    is.na        
[26] Math          merge         na.exclude    na.omit       Ops          
[31] plot          print         prompt        rbind         row.names    
[36] row.names<-   rowsum        show          slotsFromS3   split        
[41] split<-       stack         str           subset        summary      
[46] Summary       t             tail          transform     type.convert 
[51] unique        unstack       within       
see '?methods' for accessing help and source code
```

Conversely, to get a list of all available methods for a generic function (i.e. which classes have)  
(i.e. "What objects can I use this function on?")


```r
methods(generic.function = "plot")
```

```
 [1] plot.acf*           plot.data.frame*    plot.decomposed.ts*
 [4] plot.default        plot.dendrogram*    plot.density*      
 [7] plot.ecdf           plot.factor*        plot.formula*      
[10] plot.function       plot.hclust*        plot.histogram*    
[13] plot.HoltWinters*   plot.isoreg*        plot.lm*           
[16] plot.medpolish*     plot.mlm*           plot.ppr*          
[19] plot.prcomp*        plot.princomp*      plot.profile.nls*  
[22] plot.R6*            plot.raster*        plot.spec*         
[25] plot.stepfun        plot.stl*           plot.table*        
[28] plot.ts             plot.tskernel*      plot.TukeyHSD*     
see '?methods' for accessing help and source code
```

### Defining custom S3 classes

It very simple to assign an object to a new class.  
There is no formal class definition, an object is directly assigned to a class by name. An object can belong to multiple classes:


```r
x <- 1:10
class(x) <- c("specialvector", "numeric")
class(x)
```

```
[1] "specialvector" "numeric"      
```

The hierarchy of classes goes left to right, meaning that generic methods are searched for classes in the order they appear in the output of `class()`.

If we print `x`, since there is no print method for class `specialvector` or for `numeric`, the default `print.default()` command is automatically called:


```r
print(x)
```

```
 [1]  1  2  3  4  5  6  7  8  9 10
attr(,"class")
[1] "specialvector" "numeric"      
```

```r
print.default(x)
```

```
 [1]  1  2  3  4  5  6  7  8  9 10
attr(,"class")
[1] "specialvector" "numeric"      
```

To create a custom `print()` function for out new class `specialvector`, we define a function named `print.[classname]`:


```r
print.specialvector <- function(x, ...) {
  cat("This is a special vector of length", length(x), "\n")
  cat("Its mean value is", mean(x, na.rm = TRUE), "and its median is", median(x, na.rm = TRUE))
  cat("\nHere are the first few elements:\n", head(x), "\n")
}
```

Now, when you print an object of class `specialvector`, the custom `print()` command is invoked:


```r
x
```

```
This is a special vector of length 10 
Its mean value is 5.5 and its median is 5.5
Here are the first few elements:
 1 2 3 4 5 6 
```

If needed, you can call the default or another appropriate method directly:


```r
print.default(x)
```

```
 [1]  1  2  3  4  5  6  7  8  9 10
attr(,"class")
[1] "specialvector" "numeric"      
```

You can change the vector back to a regular numeric vector, or a different class, just as easily:


```r
class(x) <- "numeric"
x
```

```
 [1]  1  2  3  4  5  6  7  8  9 10
```
