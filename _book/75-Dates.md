# Dates {#dates}



<STYLE type='text/css' scoped>
PRE.fansi SPAN {padding-top: .25em; padding-bottom: .25em};
</STYLE>

R includes builtin support for working with dates and/or time data and a number of packages exist that extend this support.  
There are three builtin classes:  

* `Date`: Represents **dates** (not time)
* `POSIXct`: Represents **dates and time** as the signed number of seconds since January 1, 1970
* `POSIXlt`: Represents **dates and time** as a named list of vectors (See `base::DateTimeClasses`)

Background info: [Portable Operating System Interface (POSIX)](https://en.wikipedia.org/wiki/POSIX) is a set of standards for maintaining compatibility among operating systems.

## `as.Date()`: Character to Date
You can create a `Date` object from a string:

```r
(x <- as.Date("1981-02-12"))
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

The `tryFormats` argument defines which formats are recognized. The default is `tryFormats = c("%Y-%m-%d", "%Y/%m/%d")`.


## `sys.Date()`: Get today's date

```r
(today <- Sys.Date())
```

```
[1] "2020-10-19"
```

```r
class(today)
```

```
[1] "Date"
```

## Time intervals
The reason we care about Date objects in R is because we can do operations with them, i.e. we can substract date objects to get time intervals.  
For example to get someone's age in days:

```r
dob <- as.Date("1973-09-14")
Sys.Date() - dob
```

```
Time difference of 17202 days
```

Note: While you can use the subtraction operator `-`, it is advised you always use the `difftime()` function to perform subtraction on dates instead, because it allows you to specify units:

```r
timepoint1 <- as.Date("2020-01-07")
timepoint2 <- as.Date("2020-02-03")
(interval_in_weeks <- difftime(timepoint2, timepoint1, units = "weeks"))
```

```
Time difference of 3.857143 weeks
```

```r
(interval_in_days <- difftime(timepoint2, timepoint1, units = "days"))
```

```
Time difference of 27 days
```

```r
(interval_in_hours <- difftime(timepoint2, timepoint1, units = "hours"))
```

```
Time difference of 648 hours
```

```r
(interval_in_minutes <- difftime(timepoint2, timepoint1, units = "mins"))
```

```
Time difference of 38880 mins
```

```r
(interval_in_seconds <- difftime(timepoint2, timepoint1, units = "secs"))
```

```
Time difference of 2332800 secs
```

## `as.POSIXct`, `as.POSIXlt`, `strptime`: Character to Date-Time
As always, it can be very informative to look at the source code. For the common use case of converting a character to a Date-Time object, `as.POSIXct.default()` calls `as.POSIXlt.character()`, which calls `strptime()`.  
See `?strptime` for conversion specifications. These define how characters are read as year - month - day - hour - minute - second information.  
For example, the ISO 8601 internation standard is defined as:  
`"%Y-%m-%d %H:%M:%S"`  

* `%Y`: Year with century, (0-9999 accepted) e.g. `2020`
* `%m`: Month, 01-12, e.g. `03`
* `%d`: Day, 01-31, e.g. `04`
* `%H`: Hours, 00-23, e.g. `13`
* `%M`: Minutes, 00-59, e.g. `38`
* `%S`: Seconds, 00-61 (!) allowing for up to two leap seconds, e.g. `54`


```r
(dt <- c("2020-03-04 13:38:54"))
```

```
[1] "2020-03-04 13:38:54"
```

```r
dt_posix <- as.POSIXct(dt)
class(dt_posix)
```

```
[1] "POSIXct" "POSIXt" 
```

You can compose a really large number of combination formats to match your data.

```r
dt2 <- c("03.04.20 01:38.54 pm")
(dt2_posix <- as.POSIXct(dt2, format = "%m.%d.%y %I:%M.%S %p"))
```

```
[1] "2020-03-04 13:38:54 PST"
```

## Bring the guessing in with `lubridate`
Instead of defining Date and/or time formats, we can use the `lubridate` package to do some guesswork for us, which works very well most of the time.

```r
library(lubridate)
```

```

Attaching package: 'lubridate'
```

```
The following objects are masked from 'package:base':

    date, intersect, setdiff, union
```

```r
dt <- c("2020-03-04 13:38:54")
(dt_posix <- as_datetime(dt))
```

```
[1] "2020-03-04 13:38:54 UTC"
```
Note that timezone defaults to UTC ([Coordinated Universal Time](https://en.wikipedia.org/wiki/Coordinated_Universal_Time)) and must be set manually. PST is defined with "America/Los_Angeles" or the (officially deprecated) "US/Pacific" ([tz database](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones))

```r
dt_posix <- as_datetime(dt, tz = "America/Los_Angeles")
```


```r
dt2_posix <- as_datetime(dt2)
```
`dt2` got misinterpreted as year-month-day.  
For these cases, `lubridate` includes a number of convenient functions to narrow down the guessing. The functions are named using all permutations of `y`, `m`, and `d`. The letter order signifies the order the information appears in the character you are trying to import, i.e. `ymd`, `dmy`, `mdy`, `ydm`, `myd`

```r
dt2 <- c("03.04.20 01:38.54 pm")
(dt2_posix <- mdy_hms(dt2, tz = "America/Los_Angeles"))
```

```
[1] "2020-03-04 13:38:54 PST"
```

## `format()` Dates
`format()` operates on Date and POSIX objects to convert between representations

```r
(dt_us <- as.Date("07-04-2020", format = "%m-%d-%Y"))
```

```
[1] "2020-07-04"
```


```r
(dt_eu <- format(dt_us, "%d.%m.%y"))
```

```
[1] "04.07.20"
```
