# Date and Time {#datetime}



R includes builtin support for working with date +/- time data. A number of external packages further extend this support.

There are three builtin classes:  

* `Date`: Represents **date** information (not time)
* `POSIXct`: Represents **date and time** information as the signed number of seconds since January 1, 1970 ([Unix Time a.k.a. POSIX time a.k.a. Epoch time](https://en.wikipedia.org/wiki/Unix_time))
* `POSIXlt`: Represents **date and time** information as a named list (See `base::DateTimeClasses`)

Background info: [Portable Operating System Interface (POSIX)](https://en.wikipedia.org/wiki/POSIX) is a set of standards for maintaining compatibility among operating systems.

## Date objects

### Character to Date: `as.Date()`

You can create a `Date` object from a string:


```r
x <- as.Date("1981-02-12")
x
```

```
[1] "1981-02-12"
```

```r
class(x)
```

```
[1] "Date"
```

The `tryFormats` argument defines which formats are recognized.

The default is `tryFormats = c("%Y-%m-%d", "%Y/%m/%d")`, i.e. a date of the form "2020-11-16" or "2020/11/16"

###  Get current date & time

Get current data:


```r
today <- Sys.Date()
today
```

```
[1] "2020-11-30"
```

```r
class(today)
```

```
[1] "Date"
```
Get current date and time:


```r
now <- Sys.time()
now
```

```
[1] "2020-11-30 02:21:09 PST"
```

```r
class(now)
```

```
[1] "POSIXct" "POSIXt" 
```
Get local timezone:


```r
Sys.timezone()
```

```
[1] "America/Los_Angeles"
```

### Math on Dates

The reason we care about Date objects in R is because we can apply useful mathematical operations on them.

For example, we can substract date objects to get time intervals:


```r
start_date <- as.Date("2020-09-15")
time_diff <- Sys.Date() - start_date
time_diff
```

```
Time difference of 76 days
```

```r
class(time_diff)
```

```
[1] "difftime"
```

Note: While you can use the subtraction operator `-`, it is advised you use the `difftime()` function to perform subtraction on dates instead, because it allows you to specify units:


```r
timepoint1 <- as.Date("2020-01-07")
timepoint2 <- as.Date("2020-02-03")
difftime(timepoint2, timepoint1, units = "weeks")
```

```
Time difference of 3.857143 weeks
```

```r
difftime(timepoint2, timepoint1, units = "days")
```

```
Time difference of 27 days
```

```r
difftime(timepoint2, timepoint1, units = "hours")
```

```
Time difference of 648 hours
```

```r
difftime(timepoint2, timepoint1, units = "mins")
```

```
Time difference of 38880 mins
```

```r
difftime(timepoint2, timepoint1, units = "secs")
```

```
Time difference of 2332800 secs
```
<div class="warning">
<p>Why is there no option for “months” or “years” in units?</p>
<p>Think about it.</p>
<p>Because, unlike seconds, minutes, hours, days, and weeks, months and years do not have fixed length, i.e. literally a month or a year are not “units” of time.</p>
<p>You can always get a difference in days and divide by 365 (or <a href="https://www.nist.gov/pml/time-and-frequency-division/popular-links/time-frequency-z/time-and-frequency-z-l">365.242</a>.</p>
</div>


```r
DOB <- as.Date("1969-08-04")
Age <- Sys.Date() - DOB
Age
```

```
Time difference of 18746 days
```

```r
cat("Age today is", round(Age/365), "years")
```

```
Age today is 51 years
```

### mean/median Date


```r
x <- as.Date(c(5480, 5723, 5987, 6992), origin = "1970-01-01")
x
```

```
[1] "1985-01-02" "1985-09-02" "1986-05-24" "1989-02-22"
```

```r
mean(x)
```

```
[1] "1986-07-21"
```

```r
median(x)
```

```
[1] "1986-01-12"
```

To check the median, we can do a mathematical operation using mmultiplication subtraction and addition, and the result is still a Date(!):


```r
x[2] + .5 * (x[3] - x[2])
```

```
[1] "1986-01-12"
```

### Sequence of dates

You can create a sequence of dates using `seq()`.  
If an integer is passed to `by`, the unit is assumed to be days:


```r
start_date <- as.Date("2020-09-14")
end_date <- as.Date("2020-12-07")
seq(from = start_date, to = end_date, by = 7)
```

```
 [1] "2020-09-14" "2020-09-21" "2020-09-28" "2020-10-05" "2020-10-12"
 [6] "2020-10-19" "2020-10-26" "2020-11-02" "2020-11-09" "2020-11-16"
[11] "2020-11-23" "2020-11-30" "2020-12-07"
```

Unlike mathematical operations like `difftime()` which require strict units of time, `seq()` can work with months and years.

`by` can be one of:

"day", "week", "month", "quarter", "year".

The above is therefore equivalent to:


```r
seq(from = start_date, to = end_date, by = "week")
```

```
 [1] "2020-09-14" "2020-09-21" "2020-09-28" "2020-10-05" "2020-10-12"
 [6] "2020-10-19" "2020-10-26" "2020-11-02" "2020-11-09" "2020-11-16"
[11] "2020-11-23" "2020-11-30" "2020-12-07"
```

As with numeric sequences, you can also define the `length.out` argument:


```r
start_date <- as.Date("2020-01-20")
seq(from = start_date, by = "year", length.out = 4)
```

```
[1] "2020-01-20" "2021-01-20" "2022-01-20" "2023-01-20"
```
An integer can be provided as part of character input to `by`:


```r
start_date <- as.Date("2020-01-20")
end_date <- as.Date("2021-01-20")
seq(start_date, end_date, by = "2 months")
```

```
[1] "2020-01-20" "2020-03-20" "2020-05-20" "2020-07-20" "2020-09-20"
[6] "2020-11-20" "2021-01-20"
```

## Date-Time objects

### Character to Date-Time: `as.POSIXct()`, `as.POSIXlt()`, `strptime()`: 

(As always, it can be very informative to look at the source code. Many of these functions call eachother internally)

Read `strptime()`'s documentation for conversion specifications. These define the order and format of characters to be read as year, month, day, hour, minute, and second information.

For example, the ISO 8601 international standard is defined as:  
`"%Y-%m-%d %H:%M:%S"`  

- **`%Y`**: Year with century, (0-9999 accepted) e.g. `2020`
- **`%m`**: Month, 01-12, e.g. `03`
- **`%d`**: Day, 01-31, e.g. `04`
- **`%H`**: Hours, 00-23, e.g. `13`
- **`%M`**: Minutes, 00-59, e.g. `38`
- **`%S`**: Seconds, 00-61 (!) allowing for up to two leap seconds, e.g. `54`




```r
dt <- "2020-03-04 13:38:54"
dt
```

```
[1] "2020-03-04 13:38:54"
```

```r
class(dt)
```

```
[1] "character"
```

Use `attributres()` to see the difference between the `POSIXct` and `POSIXlt` classes:


```r
dt_posixct <- as.POSIXct(dt)
dt_posixct
```

```
[1] "2020-03-04 13:38:54 PST"
```

```r
class(dt_posixct)
```

```
[1] "POSIXct" "POSIXt" 
```

```r
str(dt_posixct)
```

```
 POSIXct[1:1], format: "2020-03-04 13:38:54"
```

```r
attributes(dt_posixct)
```

```
$class
[1] "POSIXct" "POSIXt" 

$tzone
[1] ""
```


```r
dt_posixlt <- as.POSIXlt(dt)
dt_posixlt
```

```
[1] "2020-03-04 13:38:54 PST"
```

```r
class(dt_posixlt)
```

```
[1] "POSIXlt" "POSIXt" 
```

```r
str(dt_posixlt)
```

```
 POSIXlt[1:1], format: "2020-03-04 13:38:54"
```

```r
dt_posixlt$year
```

```
[1] 120
```

```r
attributes(dt_posixlt)
```

```
$names
 [1] "sec"    "min"    "hour"   "mday"   "mon"    "year"   "wday"   "yday"  
 [9] "isdst"  "zone"   "gmtoff"

$class
[1] "POSIXlt" "POSIXt" 
```

You can compose a really large number of combination formats to match your data.


```r
dt2 <- c("03.04.20 01:38.54 pm")
dt2_posix <- as.POSIXct(dt2, format = "%m.%d.%y %I:%M.%S %p")
dt2_posix
```

```
[1] "2020-03-04 13:38:54 PST"
```

## `format()` Dates

`format()` operates on Date and POSIX objects to convert between representations

Define Date in US format:


```r
dt_us <- as.Date("07-04-2020", format = "%m-%d-%Y")
dt_us
```

```
[1] "2020-07-04"
```

Convert to European format:


```r
dt_eu <- format(dt_us, "%d.%m.%y")
dt_eu
```

```
[1] "04.07.20"
```

## Extract partial date information

- **weekdays()**: Get name of day of the week
- **months()**: Get name of month
- **quarters()**: Get quarter
- **julia()**: Get number of days since a specific origin


```r
x <- as.Date(c(18266, 18299, 18359, 18465), origin = "1970-01-01")
x
```

```
[1] "2020-01-05" "2020-02-07" "2020-04-07" "2020-07-22"
```

```r
weekdays(x)
```

```
[1] "Sunday"    "Friday"    "Tuesday"   "Wednesday"
```

```r
months(x)
```

```
[1] "January"  "February" "April"    "July"    
```

```r
quarters(x)
```

```
[1] "Q1" "Q1" "Q2" "Q3"
```

```r
julian(x)
```

```
[1] 18266 18299 18359 18465
attr(,"origin")
[1] "1970-01-01"
```

```r
julian(x, origin = as.Date("2020-01-01"))
```

```
[1]   4  37  97 203
attr(,"origin")
[1] "2020-01-01"
```

## Handling dates with **lubridate**

Instead of defining Date and/or time formats using POSIX standard abbreviations, we can let the [**lubridate**](https://lubridate.tidyverse.org/) package do some guesswork for us, which works well most of the time.


```r
library(lubridate)
dt <- c("2020-03-04 13:38:54")
dt_posix <- as_datetime(dt)
dt_posix
```

```
[1] "2020-03-04 13:38:54 UTC"
```

Note that timezone defaults to UTC ([Coordinated Universal Time](https://en.wikipedia.org/wiki/Coordinated_Universal_Time)) and must be set manually. PST is defined with "America/Los_Angeles" or the (officially deprecated) "US/Pacific" ([tz database](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones))


```r
dt_posix <- as_datetime(dt, tz = "America/Los_Angeles")
dt_posix
```

```
[1] "2020-03-04 13:38:54 PST"
```


```r
dt2_posix <- as_datetime(dt2)
dt2_posix
```

```
[1] "2003-04-20 13:38:54 UTC"
```

`dt2` got misinterpreted as year-month-day.  
For these cases, **lubridate** includes a number of convenient functions to narrow down the guessing. The functions are named using all permutations of `y`, `m`, and `d`. The letter order signifies the order the information appears in the character you are trying to import, i.e. `ymd`, `dmy`, `mdy`, `ydm`, `myd`


```r
dt2 <- c("03.04.20 01:38.54 pm")
dt2_posix <- mdy_hms(dt2, tz = "America/Los_Angeles")
dt2_posix
```

```
[1] "2020-03-04 13:38:54 PST"
```
