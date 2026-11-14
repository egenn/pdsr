# spellcheck.R
# ::rtemis::
# 2026- EDG rtemis.org
#
# Spell-checks the book's prose with the spelling package (hunspell, en_US).
# spelling parses each file as Markdown and checks text nodes only, so YAML
# front matter, code chunks, and inline code are skipped. Quarto syntax that
# Markdown reads as text is blanked before the check: div fences (`:::`),
# attribute blocks (`{#sec-x}`, `{.class}`), and shortcodes (`{{< ... >}}`).
# Blanking keeps every line in place, so reported line numbers match the source.
#
# Usage:
#   Rscript scripts/spellcheck.R                  # every chapter in _quarto.yml
#   Rscript scripts/spellcheck.R DataTypes.qmd    # selected files
#   Rscript scripts/spellcheck.R --update         # write all findings to WORDLIST
#
# WORDLIST, at the project root, holds one accepted word per line. The script
# exits with status 1 when it finds a word outside the dictionary and WORDLIST.

args <- commandArgs(trailingOnly = TRUE)
update <- "--update" %in% args
files <- setdiff(args, "--update")
wordlist_path <- "WORDLIST"
lang <- "en_US"

# Collects every .qmd listed under book.chapters and book.appendices, including
# part pages and the chapters nested under them.
book_files <- function(config = "_quarto.yml") {
  book <- yaml::read_yaml(config)[["book"]]
  collect <- function(x) {
    if (is.character(x)) {
      return(x)
    }
    if (is.list(x)) {
      return(unlist(lapply(x, collect), use.names = FALSE))
    }
    character()
  }
  out <- collect(c(book[["chapters"]], book[["appendices"]]))
  unique(out[grepl("\\.qmd$", out)])
}

# Blanks Quarto-specific syntax and writes the result to a temporary .md file
# that spelling parses as plain Markdown.
prepare <- function(file, dir) {
  x <- readLines(file, warn = FALSE, encoding = "UTF-8")
  x[grepl("^\\s*:::", x)] <- ""
  x <- gsub("\\{\\{<.*?>\\}\\}", "", x, perl = TRUE)
  x <- gsub("\\{[#.][^}]*\\}", "", x, perl = TRUE)
  out <- file.path(dir, paste0(basename(file), ".md"))
  writeLines(x, out, useBytes = TRUE)
  out
}

if (length(files) == 0L) {
  files <- book_files()
}
missing <- files[!file.exists(files)]
if (length(missing) > 0L) {
  stop("File not found: ", paste(missing, collapse = ", "), call. = FALSE)
}

ignore <- if (file.exists(wordlist_path)) {
  words <- trimws(readLines(wordlist_path, warn = FALSE, encoding = "UTF-8"))
  words[nzchar(words)]
} else {
  character()
}

tmp <- tempfile("spellcheck-")
dir.create(tmp)
prepared <- vapply(files, prepare, character(1), dir = tmp)
result <- spelling::spell_check_files(prepared, ignore = ignore, lang = lang)

# Maps the temporary file names in the report back to the source file names.
lookup <- stats::setNames(files, basename(prepared))
result[["found"]] <- lapply(result[["found"]], function(loc) {
  for (name in names(lookup)) {
    loc <- sub(name, lookup[[name]], loc, fixed = TRUE)
  }
  loc
})
unlink(tmp, recursive = TRUE)

if (update) {
  words <- sort(unique(c(ignore, result[["word"]])))
  writeLines(words, wordlist_path, useBytes = TRUE)
  message(sprintf(
    "WORDLIST: %d words (%d added).",
    length(words),
    length(setdiff(words, ignore))
  ))
  quit(status = 0L)
}

if (nrow(result) == 0L) {
  message(sprintf("No spelling errors in %d files.", length(files)))
  quit(status = 0L)
}
print(result)
message(sprintf(
  "%d unknown words in %d files. Correct them, or add accepted words to WORDLIST.",
  nrow(result),
  length(files)
))
quit(status = 1L)
