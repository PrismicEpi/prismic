Sys.setenv(RSTUDIO_PANDOC = "C:/Program Files/Pandoc")

# generate_report.R
library(jsonlite)
library(rmarkdown)

# Lire les données JSON
args <- commandArgs(trailingOnly = TRUE)
data <- fromJSON(args[1])

# Sauvegarder les données dans un fichier RDS pour les passer au Rmd
saveRDS(data, file = "data.rds")

# Générer le rapport PDF à partir du Rmd
rmarkdown::render("src/report/report_template.Rmd", output_format = "pdf_document")