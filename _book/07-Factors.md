# Factors



Factors in R are used to store **categorical variables** and therefore have many important uses in statistics / data science / machine learning.  

<div class="figure" style="text-align: center">
<img src="./R_factors.png" alt="Factors in R - Best to read through this chapter first and then refer back to this figure" width="80%" />
<p class="caption">(\#fig:FigRFactors)Factors in R - Best to read through this chapter first and then refer back to this figure</p>
</div>

You can create a factor by passing a numeric or character vector to `factor()` or `as.factor()`.  
The difference is that `as.factor()` does not accept any arguments while `factor()` does - and they can be very important. More on this right below.


```r
x <- c("a", "c", "d", "b", "a", "a", "d", "c")
xf <- factor(x)
xf
```

```
[1] a c d b a a d c
Levels: a b c d
```

```r
class(xf)
```

```
[1] "factor"
```

```r
xftoo <- as.factor(x)
xftoo
```

```
[1] a c d b a a d c
Levels: a b c d
```

```r
class(xftoo)
```

```
[1] "factor"
```

<div class="rmdnote">
<p>A factor contains three crucial pieces of information:</p>
<ol style="list-style-type: decimal">
<li><p>The underlying <strong>integer vector</strong></p></li>
<li><p>The <strong>mapping of integers to labels</strong></p></li>
<li><p>Whether the factor is <strong>ordered</strong></p></li>
</ol>
</div>

Let's unpack these.  

Begin with a simple factor:


```r
x <- factor(c("female", "female", "female", "male", "male"))
x
```

```
[1] female female female male   male  
Levels: female male
```

Internally, the command sees there are two distinct labels, female and male, and defaults to assigning integer numbers alphabetically, in this case female has been mapped to '1' and male to '2'.

Printing a factor prints the vector of labels followed by the levels, i.e. the unique labels.  

## The underlying **integer vector**

Each level is assigned an integer. (Internally, this is the "data" that forms the elements of a factor vector). You don't see these integers unless you convert the factor to numeric (`as.numeric()`) or look at the (truncated) output of `str()`


```r
as.numeric(x)
```

```
[1] 1 1 1 2 2
```

## The **mapping of integers to labels**

This defines which integer is mapped to which label, i.e. whether 1 is mapped to male or female. You can store the same information regardless which one you choose to call 1 and 2. 

To get the mapping you can use `levels()`. It prints the labels in order:


```r
levels(x)
```

```
[1] "female" "male"  
```
Again, this means that female is mapped to 1 and male is mapped to 2.


```r
str(x)
```

```
 Factor w/ 2 levels "female","male": 1 1 1 2 2
```
The above tells you that x is a factor,  
it has two levels labeled as "female" and "male", in that order, i.e. female is level 1 and male is level 2.    
The last part shows that the first five elements (in this case the whole vector) consists of three elements of level 1 (female) followed by 2 elements of level 2 (male)

### Setting new level labels

You can use the `levels()` command with an assignment to assign new labels to a factor (same syntax to how you use `rownames()` or `colnames()` to assign new row or column names to a matrix or data frame)


```r
xf <- factor(sample(c("patient_status_positive", "patient_status_negative"), 10, T),
             levels = c("patient_status_positive", "patient_status_negative"))
xf
```

```
 [1] patient_status_negative patient_status_negative patient_status_negative
 [4] patient_status_negative patient_status_positive patient_status_negative
 [7] patient_status_negative patient_status_negative patient_status_positive
[10] patient_status_positive
Levels: patient_status_positive patient_status_negative
```


```r
levels(xf)
```

```
[1] "patient_status_positive" "patient_status_negative"
```

```r
levels(xf) <- c("positive", "negative")
xf
```

```
 [1] negative negative negative negative positive negative negative negative
 [9] positive positive
Levels: positive negative
```

### Defining the mapping of labels to integers

If you want to define the mapping of labels to their integer representation (and not default to them sorted alphabeticaly), you use the `levels` arguments of the `factor()` function.  

The vector passed to the `levels` arguments must include at least all unique values passed to `factor()`, otherwise you will get `NA` values

Without defining `levels` they are assigned alphabeticaly:


```r
x <- factor(c("alpha", "alpha", "gamma", "delta", "delta"))
x
```

```
[1] alpha alpha gamma delta delta
Levels: alpha delta gamma
```
Define `levels`:


```r
x <- factor(c("alpha", "alpha", "gamma", "delta", "delta"),
 levels = c("alpha", "gamma", "delta"))
x
```

```
[1] alpha alpha gamma delta delta
Levels: alpha gamma delta
```

The `table` command has a number of useful applications, in it simplest form, it tabulates number of elements with each unique value found in a vector:


```r
table(x)
```

```
x
alpha gamma delta 
    2     1     2 
```

If you forget (or choose to exclude) a level, all occurences are replaced by `NA`:


```r
x <- factor(c("alpha", "alpha", "gamma", "delta", "delta"),
 levels = c("alpha", "gamma"))
x
```

```
[1] alpha alpha gamma <NA>  <NA> 
Levels: alpha gamma
```

If you know that more levels exist, even if no examples are present in your sample, you can includes these extra levels:


```r
x <- factor(c("alpha", "alpha", "gamma", "delta", "delta"),
 levels = c("alpha", "beta", "gamma", "delta"))
x
```

```
[1] alpha alpha gamma delta delta
Levels: alpha beta gamma delta
```


```r
table(x)
```

```
x
alpha  beta gamma delta 
    2     0     1     2 
```

## Is the factor **ordered**

We looked at how you can define the order of levels using the `levels` argument in `factor()`, which affects the integer mapping to each label.

This can affect how some applications treat the different levels.

On top of the order of the mapping, you can further define if there is a *quantitative relationship* among levels of the form `level 1 < level 2 < ... < level n`. This, in turn, can affect how the factor is treated by some functions, like some functions that fit statistical models.

<div class="rmdnote">
<p>All factors’ levels appear in some order or other.</p>
<p>An <strong>ordered factor</strong> indicates that its levels have a quantitative relationship of the form <code>level 1 &lt; level 2 &lt; ... &lt; level n</code>.</p>
</div>

First an unordered factor:


```r
dat <- sample(c("small", "medium", "large"), 10, TRUE)
x <- factor(dat)
x
```

```
 [1] medium medium medium large  medium large  medium large  medium small 
Levels: large medium small
```

To make the above into an ordered factor, we need to define the order of the levels with the `levels` arguments and also specify that it is ordered with the `ordered` argument:


```r
x <- factor(dat,
            levels = c("small", "medium", "large"),
            ordered = TRUE)
x
```

```
 [1] medium medium medium large  medium large  medium large  medium small 
Levels: small < medium < large
```

Note how the levels now include the `<` sign between levels to indicate the ordering.

## Change (order of levels) or (labels)

We've seen how to create a factor with defined order of levels and how to change level labels already. Because these are prone to serious accidents, let's look at them again, together.

**To change the order of levels** of an existing factor use `factor()`:


```r
x <- factor(c("target", "target", "control", "control", "control"))
x
```

```
[1] target  target  control control control
Levels: control target
```

Change the order so that target is first (i.e. corresponds to 1:


```r
x <- factor(x, levels = c("target", "control"))
x
```

```
[1] target  target  control control control
Levels: target control
```
**To change the labels of the levels** use `levels()`:


```r
x
```

```
[1] target  target  control control control
Levels: target control
```

```r
levels(x) <- c("hit", "decoy")
x
```

```
[1] hit   hit   decoy decoy decoy
Levels: hit decoy
```

<div class="rmdcaution">
<p>Changing the levels of a factor with <code>levels()</code> does not change the internal integer representation but changes every element’s label.</p>
</div>

## Fatal error to avoid

Example scenario: You receive a dataset for classification where the outcome is a factor of 1s and 0s:


```r
outcome <- factor(c(1, 1, 0, 0, 0, 1, 0))
outcome
```

```
[1] 1 1 0 0 0 1 0
Levels: 0 1
```
Some classification procedures expect the first level to be the 'positive' outcome, so you decide to reorder the levels.

You mistakenly use `levels()` instead of `factor(x, levels=c(...))` hoping to achieve this.  

You end up flipping all the outcome values.


```r
levels(outcome) <- c("1", "0")
outcome
```

```
[1] 0 0 1 1 1 0 1
Levels: 1 0
```

All zeros became ones and ones became zeros.

You don't notice because how would you.

Your model does the exact opposite of what you intended.

-> Don't ever do this.

## Factor to numeric

While it often makes sense to have factors with words for labels, they can be any character and that includes numbers (i.e. numbers which are treated as labels)


```r
f <- factor(c(3, 7, 7, 9, 3, 3, 9))
f
```

```
[1] 3 7 7 9 3 3 9
Levels: 3 7 9
```

This behaves just like any other factor with all the rules we learned above.

There is a very easy trap to fall into, if you ever decide to convert such a factor to numeric.

The first thing that usually comes to mind is to use `as.numeric()`.


```r
# !don't do this!
as.numeric(f)
```

```
[1] 1 2 2 3 1 1 3
```
But! We already know this will return the integer index, it will not return the labels as numbers.  

By understanding the internal representation of the factor, i.e. that a factor is an integer vector indexing a set of labels, you can convert labels to numeric exactly by indexing the set of labels:


```r
levels(f)[f]
```

```
[1] "3" "7" "7" "9" "3" "3" "9"
```
The above suggests that used as an index within the brackets, `f` is coerced to integer, therefore to understand the above:


```r
levels(f)
```

```
[1] "3" "7" "9"
```

```r
levels(f)[as.integer(f)]
```

```
[1] "3" "7" "7" "9" "3" "3" "9"
```

```r
# same as
levels(f)[f]
```

```
[1] "3" "7" "7" "9" "3" "3" "9"
```

A different way around this that may be less confusing is to simply convert the factor to character and then to numeric:


```r
as.numeric(as.character(f))
```

```
[1] 3 7 7 9 3 3 9
```

## Summary

<div class="rmdnote">
<ul>
<li><p>Factors in R are <strong>integer vectors</strong> with labels.</p></li>
<li><p>A factor’s internal integer values range from 1 to the number of levels, i.e. categories.</p></li>
<li><p>Each integer corresponds to a label.</p></li>
<li><p>Use <code>factor(levels = c(...))</code> to order levels</p></li>
<li><p>Use <code>levels(x)</code> to change levels’ labels</p></li>
</ul>
</div>

<div class="rmdnote">
<p>To avoid confusion, do not use numbers as level labels, if possible.</p>
</div>
