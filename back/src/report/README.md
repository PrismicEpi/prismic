## Installation de R et des dépendances

R : version recommandée → 4.4.2
Pandoc : installer depuis pandoc.org
TinyTeX (inclut pdfTeX) :

    install.packages("tinytex")
    tinytex::install_tinytex()

Pour vérifier l'installation :

    tinytex::tinytex_root()

Packages R requis

    install.packages("jsonlite", repos = "https://cloud.r-project.org")
    install.packages("rmarkdown", repos = "https://cloud.r-project.org")