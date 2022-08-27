# PDSR testing

aenv <- new.env()
benv <- new.env()

alist <- list(alpha = 21:23, beta = 31:33)

wdf <- data.frame(id = 1:3, envs = c(aenv, benv))
wdf <- data.frame(id = 1:3, al = alist)
wdf

vc <- c("alpha", "beta", "gamma")
vi <- 1:3
vd <- c(1.1, 1.2, 1.3)
ls <- list(vc, vi, vd)
df <- data.frame(vc, vi, vd)

typeof(vi)
mode(vi)
class(vi)
str(vi)

class(vd)
mode(vd)
typeof(vd)
str(vd)

typeof(ls)
mode(ls)
class(ls)
str(ls)

typeof(df)
mode(df)
class(df)
str(df)


wls <- list(vi = 1:3, vd = rnorm(10), vf = c(mean, median))
str(wls)

## `typeof()` vs `mode()` vs `str()`


x <- array(1:12, dim = c(2, 3, 2))
dim(x)
length(x)
names(x)
dimnames(x) <- list(one = "one", two = "two", three = "three")
provideDimnames(1)


v <- 1:3
w <- c(1.2, 2.7, 3.4)
x <- c("a", "b", "c")

mat <- matrix(1:10, 5)
df <- data.frame(a = 1:4, b = letters[11:14])

ls <- list(a = 1:4, b = letters[11:14])

class(v)
class(w)
class(x)
mode(v)
mode(w)
mode(x)
storage.mode(v)
storage.mode(w)
storage.mode(x)
typeof(v)
typeof(w)
typeof(x)


xm <- matrix(1:20, nrow = 5)
colnames(xm) <- paste0("Feat_", 1:4)
xm
xm[, "Feat_1"]
names(xm)
