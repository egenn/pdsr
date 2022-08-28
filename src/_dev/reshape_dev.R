set.seed(2022)
dat_wide <- data.frame(Account_ID = c(8001, 8002, 8003, 8004),
                       Age = rnorm(4, 57, 12),
                       RBC = rnorm(4, 4.8, .5),
                       WBC = rnorm(4, 7250, 1500),
                       Hematocrit = rnorm(4, 40.2, 4),
                       Hemoglobin = rnorm(4, 13.6, 1.5),
                       Admission = sample(c("ED", "Planned"), 4, T))
dat_wide