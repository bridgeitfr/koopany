function getEmployeeRangeDescription(code) {
    const range = tranchesEffectifs.find(range => range.code === code);
    return range ? range.description : 'Tranche non trouvée';
}

function firstPage()
{
    $('#pageNum').val(1); 
    searchCompanies();
}
function lastPage()
{
    $('#pageNum').val($('#nbPagesTotal').val()); 
    searchCompanies();
}
function nextPage()
{
    $('#pageNum').val(eval($('#pageNum').val())+1); 
    searchCompanies();
}
function previousPage()
{
    $('#pageNum').val(eval($('#pageNum').val())-1); 
    searchCompanies();
}

function runPageScan()
{
    pageScanFrom=eval($('#pageScanFrom').val());
    currentPage=eval($('#pageNum').val());
    pageScanTo=eval($('#pageScanTo').val());
    currentPage=eval($('#pageNum').val());
    if (currentPage == pageScanFrom)
    {
        $('#resultsTable').empty();
    }
    searchCompanies(false);
    setTimeout(function() {
        
        if (currentPage < pageScanTo) {
            $('#pageNum').val(eval($('#pageNum').val())+1);
            runPageScan();
        }
    }, 1000);
}

function buildAjaxData(params) {
    let data = {
        q: params.recherche,
        page: currentPage,
        per_page: 25
    };

    // Ajouter dynamiquement des champs s'ils ne sont pas vides
    
    if (params.activity) {
        data.activite_principale = params.activity;
    }
    if (params.caMin) {
        data.ca_min = params.caMin;
    }
    if (params.caMax) {
        data.ca_max = params.caMax;
    }
    if (params.resMin) {
        data.resultat_net_min = params.resMin;
    }
    if (params.resMax) {
        data.resultat_net_max = params.resMax;
    }
    if (params.numEmployees) {
        data.tranche_effectif_salarie = params.numEmployees;
    }
    if (params.regions) {
        data.region = params.regions;
    }
    if (params.departements) {
        data.departement = params.departements;
    }

    return data;
}

$('#recherche').keypress(function(event) {
    if (event.which == 13) {  // 13 est le code clé pour la touche Entrée
        event.preventDefault();  // Empêche tout comportement par défaut (comme soumettre un formulaire)
        searchCompanies();  // Appelle la fonction que vous souhaitez exécuter
    }
});


function searchCompanies(emptyTable=true)
{
    var selectedValuesRegions = $('#regionSelect').val();
    var regionSelect = selectedValuesRegions.join(',');

    var selectedValuesDepartements = $('#departementSelect').val();
    var departementSelect = selectedValuesDepartements.join(',');

    var params = {
            departement: $('#departement').val(),
            numEmployees: $('#numEmployees').val(),
            activity: $('#activity').val(),
            caMin: $('#minRevenue').val(),
            caMax: $('#maxRevenue').val(),
            resMin: $('#minResultat').val(),
            resMax: $('#maxResultat').val(),
            recherche: $('#recherche').val(),
            regions: regionSelect,
            departements: departementSelect,
            etat_administratif: "A"
        };
    currentPage=eval($('#pageNum').val());
    $.ajax({
        url: 'https://recherche-entreprises.api.gouv.fr/search',
        data: buildAjaxData(params),
        success: function(data) {
            $('#currentPage').html($('#pageNum').val());
            $('#nbResults').html(data.results.length+' résultats');
            if (emptyTable) { $('#resultsTable').empty(); }
            $('#nbResultsTotal').html(data.total_results);
            $('#nbPages').html(data.total_pages);
            $('#nbPagesTotal').val(data.total_pages);

            
            if (currentPage == 1) {
                $('#btnPreviousPage').hide();
                $('#btnFirstPage').hide();
            } else {
                $('#btnPreviousPage').show();
                $('#btnFirstPage').show();
            }
            if (currentPage < data.total_pages)
            {
                $('#btnNextPage').show();
                $('#btnLastPage').show();
            } else {
                $('#btnNextPage').hide();
                $('#btnLastPage').hide();
            }
            data.results.forEach(function(item) {
                infosBureaux_commune='';
                infosBureaux_adresse='';
                siege='oui';
                dptStrict=$('#dptStrict').val();
                regionStrict=$('#regionStrict').val();
                

                // if (item.matching_etablissements.length > 0)
                // {
                //     item.matching_etablissements.forEach(function(etablissement) {
                //     console.log(etablissement.date_fermeture);
                //     if (etablissement.date_fermeture != 'null') {
                //         infosBureaux_commune=etablissement.libelle_commune;
                //         infosBureaux_adresse=etablissement.adresse;
                //         infosBureaux_departement
                //         siege='non';
                //     }
                //     });
                // } else {
                //     infosBureaux_commune=item.siege.libelle_commune;
                //     infosBureaux_adresse=item.siege.adresse;
                //     infosBureaux_departement=item.siege.department;
                // }
                
                infosBureaux_commune=item.siege.libelle_commune;
                infosBureaux_adresse=item.siege.adresse;
                infosBureaux_departement=item.siege.departement;
                infoBureaux_region=item.siege.region;
                addData=true;
                var selectedDepartments = $('#departementSelect').val();
                var selectedRegions = $('#regionSelect').val();
                if ((dptStrict == 'yes') && (! selectedDepartments.includes(String(infosBureaux_departement))))
                {
                    addData=false;
                }

                if ((regionStrict == 'yes') && (! selectedRegions.includes(String(infoBureaux_region))))
                {
                    addData=false;
                }

                if (addData == true)
                {
                    finances='';
                    let nombreAnneesFinances = Object.keys(item.finances).length;
                    caAnnee='';
                    caMontant='';
                    caResultat='';
                    caColor='success';
                    resColor='success';
                    if (nombreAnneesFinances > 0)
                    {
                        finances = '';
                        let first = true; // Flag pour vérifier si c'est la première itération
                        
                        caCibleMin = $('#caCibleMin').val();
                        resCibleMin = $('#resCibleMin').val();
                        for (let annee in item.finances) {
                            if (first) { // Vérifie si c'est la première itération
                                let finance = item.finances[annee];
                                
                                caColor = (finance.ca < caCibleMin) ? 'danger' : 'success';
                                resColor = (finance.resultat_net <= resCibleMin) ? 'danger' : 'success';
                                caAnnee=annee;
                                caMontant=finance.ca;
                                caResultat=finance.resultat_net;
                                first = false; // Mettre le flag à false après la première itération
                                break; // Arrête la boucle après la première itération
                            }
                        }
                    }
                    nbSalaries=getEmployeeRangeDescription(item.tranche_effectif_salarie)
                    $('#resultsTable').append(
                        `<tr>
                            <td>${item.siren}</td>
                            <td>${item.activite_principale}</td>
                            <td>${item.nom_complet}</td>
                            <td>${nbSalaries}</td>
                            <td>${infosBureaux_commune}</td>
                            <td>${item.dirigeants[0].prenoms}</td>
                            <td>${item.dirigeants[0].nom}</td>
                            <td>${caAnnee}</td>
                            <td><span class="badge bg-${caColor}">${caMontant} €</span></td>
                            <td><span class="badge bg-${resColor}">${caResultat} €</span></td>
                        </tr>`
                    );
                }
                
            });
        },
        error: function() {
            alert('Error fetching data.');
        }
    });
}
companySearch='';
function analyzeCompanies() {
    companySearch = $('#companySearch').val();
    
    companySearch = companySearch.split('\n'); // Divise le contenu du textarea en lignes
    if (companySearch.length > 0) { fillCompaniesInfo(); }

}
function fillCompaniesInfo(companyName,emptyTable=false)
{
    if (companySearch.length > 0) 
    {
        element= companySearch.shift();
        parts = element.split(',');
        companyName = parts[0];
        region = parts[1];

        if (companyName != '')
        {
            var params = {
                recherche: companyName,
            };
            currentPage=eval($('#pageNum').val());
            $.ajax({
                url: 'https://recherche-entreprises.api.gouv.fr/search',
                data: buildAjaxData(params),
                success: function(data) {
                    $('#currentPage').html($('#pageNum').val());
                    $('#nbResults').html(data.results.length+' résultats');
                    if (emptyTable) { $('#resultsTable').empty(); }
                    $('#nbResultsTotal').html(data.total_results);
                    $('#nbPages').html(data.total_pages);
                    $('#nbPagesTotal').val(data.total_pages);
                    
                    $('#btnPreviousPage').hide();
                    $('#btnFirstPage').hide();
                    $('#btnNextPage').hide();
                    $('#btnLastPage').hide();
                    counter=0;
                    data.results.forEach(function(item) {

                        infosBureaux_commune='';
                        infosBureaux_adresse='';
                        siege='oui';

                        infosBureaux_commune=item.siege.libelle_commune;
                        infosBureaux_adresse=item.siege.adresse;
                        infosBureaux_departement=item.siege.departement;
                        infoBureaux_region=item.siege.region;
                        addData=true;
                        var selectedDepartments = $('#departementSelect').val();
                        var selectedRegions = $('#regionSelect').val();

                        if (addData == true)
                        {
                            finances='';
                            let nombreAnneesFinances = Object.keys(item.finances).length;
                            caAnnee='';
                            caMontant='';
                            caResultat='';
                            caColor='success';
                            resColor='success';
                            if (nombreAnneesFinances > 0)
                            {
                                finances = '';
                                let first = true; // Flag pour vérifier si c'est la première itération
                                
                                caCibleMin = $('#caCibleMin').val();
                                resCibleMin = $('#resCibleMin').val();
                                for (let annee in item.finances) {
                                    if (first) { // Vérifie si c'est la première itération
                                        let finance = item.finances[annee];
                                        
                                        caColor = (finance.ca < caCibleMin) ? 'danger' : 'success';
                                        resColor = (finance.resultat_net <= resCibleMin) ? 'danger' : 'success';
                                        caAnnee=annee;
                                        caMontant=finance.ca;
                                        caResultat=finance.resultat_net;
                                        first = false; // Mettre le flag à false après la première itération
                                        break; // Arrête la boucle après la première itération
                                    }
                                }
                            }
                            nbSalaries=getEmployeeRangeDescription(item.tranche_effectif_salarie);
                            if (item.dirigeants.length > 0)
                            {
                                prenoms=item.dirigeants[0].prenoms;
                                nom=item.dirigeants[0].nom;
                            } else {
                                prenoms='';
                                nom='';
                            }
                            $('#resultsTable').append(
                                `<tr id="company-${counter}">
                                    <td>${item.siren}</td>
                                    <td>${item.activite_principale}</td>
                                    <td>${item.nom_complet}</td>
                                    <td>${nbSalaries}</td>
                                    <td>${infosBureaux_commune}</td>
                                    <td>${prenoms}</td>
                                    <td>${nom}</td>
                                    <td>${caAnnee}</td>
                                    <td><span class="badge bg-${caColor}">${caMontant} €</span></td>
                                    <td><span class="badge bg-${resColor}">${caResultat} €</span></td>
                                    <td><a href="#" onclick="removeLine(${counter});return false;">X</a></td>
                                </tr>`
                            );
                            counter++;
                        }
                        setTimeout(function() {
                            
                            if (companySearch.length > 0) { fillCompaniesInfo(); }
                        }, 2000);
                        
                    });
                },
                error: function() {
                    alert('Error fetching data.');
                }
            });
        }
    }
    

    
}

function removeLine(line){
    //if (window.confirm("Are you sure ?")) {
        $('#company-'+line).remove();
    //}
}

function clearTable()
{
    if (window.confirm("Are you sure ?")) {
        $('#resultsTable').empty();
    }
}