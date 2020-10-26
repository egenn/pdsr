# String Operations {#stringops}



<STYLE type='text/css' scoped>
PRE.fansi SPAN {padding-top: .25em; padding-bottom: .25em};
</STYLE>

## Reminder: create - coerce - check
* `character()`: Initialize empty character vector
* `as.character()`: Coerce any vector to a character vector
* `is.character()`: Check object is character

```r
x <- character(10)
```


```r
v <- c(10, 20, 22, 43)
(x <- as.character(v))
```

```
[1] "10" "20" "22" "43"
```

```r
x <- c("PID", "Age", "Sex", "Handedness")
is.character(x)
```

```
[1] TRUE
```

## `nchar()`: Get number of characters in element
`nchar` counts the number of characters in each **element** of type character in a vector:

```r
x <- c("a", "bb", "ccc")
nchar(x)
```

```
[1] 1 2 3
```

## `substr()`: Get substring

```r
x <- c("001Emergency", "010Cardiology", "018Neurology", 
       "020Anesthesia", "021Surgery", "051Psychiatry")
substr(x, start = 1, stop = 3)
```

```
[1] "001" "010" "018" "020" "021" "051"
```
Neither `start` nor `stop` need to be valid character indices.  
For example, if you want to get all characters from the fourth one to the last one, you can specify a very large `stop`

```r
substr(x, 4, 99)
```

```
[1] "Emergency"  "Cardiology" "Neurology"  "Anesthesia" "Surgery"   
[6] "Psychiatry"
```

If you start with too high an index, you end up with empty strings:

```r
substr(x, 20, 24)
```

```
[1] "" "" "" "" "" ""
```

**Note:** `substring()` is also available, with similar syntax to `substr()`: (first, last) instead of (start, stop). It is available for compatibility with S (check its source code to see how it's an alias for `substr()`)


## `strsplit()`: Split strings

```r
x <- "This is one sentence"
strsplit(x, " ")
```

```
[[1]]
[1] "This"     "is"       "one"      "sentence"
```

```r
x <- "In the beginning, there was the command line"
strsplit(x, ",")
```

```
[[1]]
[1] "In the beginning"            " there was the command line"
```


## `paste()`: Concatenate strings
`paste()` and `paste0()` are particularly useful commands.  
In it simplest form, it acts like `as.character()`:

```r
v <- c(10, 20, 22, 43)
paste(v)
```

```
[1] "10" "20" "22" "43"
```

Combine strings from multiple vectors, elementwise:

```r
id = c("001", "010", "018", "020", "021", "051")
dept = c("Emergency", "Cardiology", "Neurology",
         "Anesthesia", "Surgery", "Psychiatry")
paste(id, dept)
```

```
[1] "001 Emergency"  "010 Cardiology" "018 Neurology"  "020 Anesthesia"
[5] "021 Surgery"    "051 Psychiatry"
```

Use `sep` to define separator:

```r
paste(id, dept, sep = "+++")
```

```
[1] "001+++Emergency"  "010+++Cardiology" "018+++Neurology"  "020+++Anesthesia"
[5] "021+++Surgery"    "051+++Psychiatry"
```

`paste0()` is an alias for the commonly used `paste(..., sep = "")`:

```r
paste0(id, dept)
```

```
[1] "001Emergency"  "010Cardiology" "018Neurology"  "020Anesthesia"
[5] "021Surgery"    "051Psychiatry"
```

As with other vectorized operations, value recycling can be very convenient:

```r
paste0("Feature_", 1:10)
```

```
 [1] "Feature_1"  "Feature_2"  "Feature_3"  "Feature_4"  "Feature_5" 
 [6] "Feature_6"  "Feature_7"  "Feature_8"  "Feature_9"  "Feature_10"
```

The argument `collapse` helps output a *single* character element after collapsing with some string:

```r
paste0("Feature_", 1:10, collapse = ", ")
```

```
[1] "Feature_1, Feature_2, Feature_3, Feature_4, Feature_5, Feature_6, Feature_7, Feature_8, Feature_9, Feature_10"
```

## `cat()`: Concatenate and **print**
`cat()` concatenates strings in order to print to screen (console) or to file. It does not return any value. It is therefore useful to produce informative messages in your programs.

```r
sbp <- 130
temp <- 98.4
cat("The blood pressure was", sbp, "and the temperature was", temp, "\n")
```

```
The blood pressure was 130 and the temperature was 98.4 
```

## String formatting

### Change case with `toupper` and `tolower`

```r
features <- c("id", "age", "sex", "sbp", "dbp", "hct", "urea", "creatinine")
(features <- toupper(features))
```

```
[1] "ID"         "AGE"        "SEX"        "SBP"        "DBP"       
[6] "HCT"        "UREA"       "CREATININE"
```

```r
(features <- tolower(features))
```

```
[1] "id"         "age"        "sex"        "sbp"        "dbp"       
[6] "hct"        "urea"       "creatinine"
```

### `abbreviate()`

```r
x <- c("Emergency", "Cardiology", "Surgery", "Anesthesia", "Neurology", "Psychiatry", "Clinical Psychology")
# x <- c("University of California San Francisco")
abbreviate(x)
```

```
          Emergency          Cardiology             Surgery          Anesthesia 
             "Emrg"              "Crdl"              "Srgr"              "Anst" 
          Neurology          Psychiatry Clinical Psychology 
             "Nrlg"              "Psyc"              "ClnP" 
```

```r
abbreviate(x, minlength = 3)
```

```
          Emergency          Cardiology             Surgery          Anesthesia 
              "Emr"               "Crd"               "Srg"               "Ans" 
          Neurology          Psychiatry Clinical Psychology 
              "Nrl"               "Psy"               "ClP" 
```


## Pattern matching
A very common task in programming is to find +/- replace string patterns in a vector of strings.  
`grep` and `grepl` help find strings that contain a given pattern.  
`sub` and `gsub` help find and replace strings.

### `grep`: Get an integer index of elements that include a pattern

```r
x <- c("001Age", "002Sex", "010Temp", "014SBP", "018Hct", "022PFratio", "030GCS", "112SBP-DBP")
grep(pattern = "SBP", x = x)
```

```
[1] 4 8
```

`grep()`'s `value` arguments which defaults to `FALSE`, allows returning the matched string itself (the value of the element) instead of its integer index:

```r
grep("SBP", x, value = TRUE)
```

```
[1] "014SBP"     "112SBP-DBP"
```

### `grepl`: Get a logical index of elements that include a pattern
`grepl` is similar to `grep`, but reuturns a logical index instead:

```r
grepl("SBP", x)
```

```
[1] FALSE FALSE FALSE  TRUE FALSE FALSE FALSE  TRUE
```

### `sub`: Find replace **first** match of a pattern

```r
x <- c("The most important variable was PF ratio. Other significant variables are listed in the supplementary information.")
sub(pattern = "variable", replacement = "feature", x = x)
```

```
[1] "The most important feature was PF ratio. Other significant variables are listed in the supplementary information."
```
"First match" refers to each element of a character vector:

```r
x <- c("var 1, var 2", "var 3, var 4")
sub("var", "feat", x)
```

```
[1] "feat 1, var 2" "feat 3, var 4"
```

### `gsub`: Find and replace **all** matches of a pattern

```r
x <- c("The most important variable was PF ratio. Other significant variables are listed in the supplementary information.")
gsub(pattern = "variable", replacement = "feature", x = x)
```

```
[1] "The most important feature was PF ratio. Other significant features are listed in the supplementary information."
```
"All matches" means all matches across all elements:

```r
x <- c("var 1, var 2", "var 3, var 4")
gsub("var", "feat", x)
```

```
[1] "feat 1, feat 2" "feat 3, feat 4"
```

## Regular expressions
Regular expressions allow you to perform flexible pattern matching. For example, you can look for a pattern specifically at the beginning or the end of a word, or for a variable pattern with certain characteristics.  
Regular expressions are very powerful and heavily used. They exist in multiple programming languages - with many similarities and a few differences.  
There are many rules in defining regular expression. You can read the R manual by typing `?base::regex`.  
Here are some of the most important rules:

### Match a pattern at the beginning of a line/string with `^`/`\\<`:
Use the caret sign `^` in the **beginning** of a pattern to only match strings that begin with this pattern.  
pattern `012` matches both 2nd and 3rd elements:

```r
(x <- c("001xyz993", "012qwe764", "029aqw012"))
```

```
[1] "001xyz993" "012qwe764" "029aqw012"
```

```r
grep("012", x)
```

```
[1] 2 3
```
By adding `^` or `\\<`, only the 2nd element matches:

```r
grep("^012", x)
```

```
[1] 2
```

```r
grep("\\<012", x)
```

```
[1] 2
```

### Match a pattern at the end of a line/string with `$`/`\\>`
The dollar sign `$` is used at the **end** of a pattern to only match strings which end with this pattern:

```r
x
```

```
[1] "001xyz993" "012qwe764" "029aqw012"
```

```r
grep("012$", x)
```

```
[1] 3
```

```r
grep("012\\>", x)
```

```
[1] 3
```


```r
x <- c("1one", "2one", "3two", "3three")
grep("one$", x)
```

```
[1] 1 2
```

```r
grep("one\\>", x)
```

```
[1] 1 2
```

### `.`: Match any character

```r
grep("e.X", c("eX", "enX", "ennX", "ennnX", "ennnnX"))
```

```
[1] 2
```

### `+`: Match preceding character one or more times:

```r
grep("en+X", c("eX", "enX", "ennX", "ennnX", "ennnnX"))
```

```
[1] 2 3 4 5
```


### `{n}`: Match preceding character `n` times:

```r
grep("en{2}X", c("eX", "enX", "ennX", "ennnX", "ennnnX"))
```

```
[1] 3
```

### `{n,}`: Match preceding character `n` or more times:

```r
grep("en{2,}X", c("eX", "enX", "ennX", "ennnX", "ennnnX"))
```

```
[1] 3 4 5
```

### `{n,m}`: Match preceding character at least `n` times and no more than `m` times:

```r
grep("en{2,3}X", c("eX", "enX", "ennX", "ennnX", "ennnnX"))
```

```
[1] 3 4
```

### Escaping metacharacters
The following are defined as metacharacters, because they have special meaning within a regular expression: `. \ | ( ) [ { ^ $ * + ?`.  
If you want to match one of these characters itself, you must "escape" it using a double backslash:

```r
x <- c("dn3ONE", "d.3TWO", "dx3FIVE")
grep("d\\.3", x)
```

```
[1] 2
```

### Match a character class
You can use brackets, `[ ]` to define sets of characters to match in any order, if present.  
Here we want to replace `$` and `@` with an underscore:

```r
x <- c("Feat1$alpha", "Feat2$gamma", "Feat9@field2")
gsub("[$@]", "_", x)
```

```
[1] "Feat1_alpha"  "Feat2_gamma"  "Feat9_field2"
```

A number of character classes are predefined. They are themselves surrounded by brackets - to use them as a character class, you need a seconds set of brackets around them. Some of the most common ones include:  

* `[:alnum:]`: alphanumeric, i.e. all letters and numbers
* `[:alpha:]`: all letters
* `[:digit:]`: all numbers
* `[:lower:]`: all lowercase letters
* `[:upper:]`: all uppercase letters
* `[:punct:]`: all punctuation characters (! " # $ % & ' ( ) * + , - . / : ; < = > ? @ [ \ ] ^ _ ` { | } ~.)
* `[:blank:]`: all spaces and tabs
* `[:space:]`: all spaces, tabs, newline characters, and some more

Let's look at some examples.  
Here we us `[:digit:]` to remove all numbers:

```r
x <- c("001Emergency", "010Cardiology", "018Neurology", "020Anesthesia", 
       "021Surgery", "051Psychiatry")
gsub("[[:digit:]]", "", x)
```

```
[1] "Emergency"  "Cardiology" "Neurology"  "Anesthesia" "Surgery"   
[6] "Psychiatry"
```

We can use `[:alpha:]` to remove all letters:

```r
gsub("[[:alpha:]]", "", x)
```

```
[1] "001" "010" "018" "020" "021" "051"
```

We can use a caret `^` in the beginning of a character class to match any character *not* in the character set:

```r
x <- c("001$Emergency", "010@Cardiology", "018*Neurology", "020!Anesthesia", 
       "021!Surgery", "051*Psychiatry")
gsub("[^[:alnum:]]", "_", x)
```

```
[1] "001_Emergency"  "010_Cardiology" "018_Neurology"  "020_Anesthesia"
[5] "021_Surgery"    "051_Psychiatry"
```

### Combine character classes
Use `|` to match from multiple character classes:

```r
x <- c("123#$%alphaBeta")
gsub("[[:digit:]|[:punct:]]", "", x)
```

```
[1] "alphaBeta"
```


For more information on regular expressions, start by reading the builtin documentation: `?regex`
