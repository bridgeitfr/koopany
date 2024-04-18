# Description
Cet outil très simple permet de voir ce qu'on peut faire simplement pour rechercher des entreprises qui correspondent à des critères.
Il est mis à disposition de manière simple, sans documentation précise, mais n'hésitez pas à me solliciter sur linkedin: https://www.linkedin.com/in/aymeric-m-00a03747/

Enjoy and Have Fun !

PS: ne jugez pas le code, non structuré au niveau JS avec l'ensemble des fonctions et scripts groupés sur la page web. 

Credits: Bridge IT

Doc API: https://recherche-entreprises.api.gouv.fr/docs/
Sources régions: https://www.insee.fr/fr/information/6051727

# Recherche
## Panneau de gauche
Utilisez le panneau de gauche pour faire des recherches:
- Recherche: nom d'une entreprise
- Département: un ou plusieurs
- Régions: une ou plusieurs
- Code APE
- Tranche d'effectif
- CA minimum
- CA Maximum
- Résultat net Minimum
- Résultat net Maximum

## Panneau de droite
Utilisez le panneau de droit pour:
- CA Cible Min: met en couleur rouge le montant si le CA Cible Min n'est pas respecté
- CA Cible Max
- Résultat Net min: met en couleur rouge le montant si le Résultat Net Min n'est pas respecté
- Strict departement: filtre les résultats en n'ajoutant dans la table que les éléments dont le siège a le département qui correspond aux départements sélectionnés
- Strict region: filtre les résultats en n'ajoutant dans la table que les éléments dont le siège est dans la région qui correspond aux régions sélectionnées
- Start page: 1 par défaut (voir page scan ci-dessous)
- End page: 10 par défaut (voir page scan ci-dessous)

## Page Scan
Par défaut, vous allez devoir naviguer de page en page pour voir les résultats. Pour tous les avoir sur une seule page faites ceci:
- Faites une première recherche pour voir le total de page
- Modifier Start Page et End page (attention limite de 400 requêtes par minute sur l'API utilisée pour les recherches)
- Clickez sur PAGE SCAN => chaque page va être analysée et chaque critère qui correspond à votre recherche sera ajouté au tableau

Ensuite, il ne vous restera plus qu'à copier/coller votre liste !