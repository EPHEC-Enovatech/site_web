var charts = {};

/**
 * Construit le graphique pour 1 jour
 * @param response la réponse de la requète
 * @param actionGraph draw / update
 * @param idCanvasDiv l'id de la div contenant le canvas
 * @param idCanvas l'id du canvas
 * @param titleGraph le titre du graphe
 * @param idError l'id de l'endroit au afficher l'erreur
 * @param label le label de la légende du graph
 * @param errorLabel les labels pour l'accessibilité
 */
function buildSimpleGraph(response, actionGraph, idCanvasDiv, idCanvas, titleGraph,
                          idError, label, errorLabel){

    switch(response.status) {
        case 404:
            console.log("Pas de donnée disponible");
            //resetCanvas("canvasHumiditeDemo", "humiditeDemo", "Taux d'humidité dans le sol");
            resetCanvas(idCanvasDiv, idCanvas, titleGraph);
            break;
        case 401:
            console.log("Vous n'êtes pas connecté");
            break;
        case 200:
            $('#' + idCanvasDiv).show();
            $('#' + idError).hide();

            let humidData = [];
            let humidDate = [];

            let data = response.responseJSON.data;
            data.forEach(function (item) {
                let date = moment(new Date(item.timestamp)).format('LT');
                humidDate.push(date);
                humidData.push(item.data);
            });

            let datasets = [{
                label: label + " " + moment(response.responseJSON.data[0].timestamp).format('LL'),
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: humidData,
            }];

            if(actionGraph === "draw"){
                buildGraph(idCanvas, "line", humidDate, datasets, titleGraph);
                buildFailBack(idCanvas, humidData, humidDate, errorLabel, titleGraph);
            } else if(actionGraph === "upDate"){
                updateGraph(idCanvas, humidDate, humidData);
            }
            break;
        default:
            console.log("Erreur serveur");
    }

}

/**
 * Construit un graphique de la moyenne
 * @param response la réponse de l'API
 * @param actionGraph draw / update
 * @param idCanvasDiv l'id de la div contenant le canvas
 * @param idCanvas l'id du canvas
 * @param titleGraph le titre du graphique
 * @param idError l'id de la zone pour les erreurs
 * @param label le label des données
 * @param errorLabel le label pour la table accessibilité
 * @param startDate la date de début
 * @param endDate la date de fin
 */
function buildAverageGraphWeek(response, actionGraph, idCanvasDiv, idCanvas, titleGraph, idError, label, errorLabel, startDate, endDate){
    
    switch (response.status) {
        case 404:
            console.log("Pas de donnée disponible");
            resetCanvas(idCanvasDiv, idCanvas, titleGraph);
            break;
        case 401:
            console.log("Vous n'êtes pas connecté");
            break;
        case 200:
            $('#' + idCanvasDiv).show();
            $('#' + idError).hide();

            let weekDay = []; //Liste des jours
            let dataWeekDay = []; //Moyenne pour chaque jour
            let averageData = 0; //Addition de toutes les valeurs
            let countAverage = 0; //Le nombre de valeurs aditionnée
            let testDate = moment(startDate); //La date a tester
            let data = response.responseJSON.data;

            let dateFirstElem = moment(data[0].timestamp);

            while (moment(testDate).format("LL") !== moment(dateFirstElem).format("LL")){
                weekDay.push(moment(testDate).format("DD/MM"));
                dataWeekDay.push(0);
                testDate = moment(testDate).add(1, "d");
            }

            data.forEach(function(item){

                if(moment(item.timestamp).format("LL") === moment(testDate).format("LL")){
                    averageData += item.data;
                    countAverage += 1;
                } else {
                    dataWeekDay.push((averageData/countAverage).toFixed(2));
                    averageData = 0; countAverage = 0;
                    weekDay.push(moment(testDate).format("DD/MM"));
                    testDate = moment(testDate).add(1, "d");

                    while (moment(item.timestamp).format("LL") !== moment(testDate).format("LL")){
                        weekDay.push(moment(testDate).format("DD/MM"));
                        dataWeekDay.push(0);
                        testDate = moment(testDate).add(1, "d");
                    }

                    averageData += item.data;
                    countAverage += 1;
                }

                if(item === data[data.length-1]){
                    dataWeekDay.push((averageData/countAverage).toFixed(2));
                }
            });

            while(moment(testDate).format("LL") !== moment(endDate).format("LL")){
                weekDay.push(moment(testDate).format("DD/MM"));
                dataWeekDay.push(0);
                testDate = moment(testDate).add(1, "d");
            }

            let datasets = [{
                label: label,
                backgroundColor: 'rgba(20, 50, 199, 0.5)',
                borderColor: 'rgb(20, 50, 199)',
                data: dataWeekDay
            }];

            if(actionGraph === "draw"){
                buildGraph(idCanvas, "bar", weekDay, datasets, titleGraph, changeGraphClick);
                buildFailBack(idCanvas, dataWeekDay, weekDay, errorLabel, "Valeurs moyennes récupérées sur la semaine");
            } else if (actionGraph === "upDate"){
                updateGraph(idCanvas, weekDay, dataWeekDay);
            }
            break;
        default:
            console.log("Erreur serveur")
    }
}

/**
 * Construis le graphique démo récapitulatif
 */
function buildRecap(){

    $('#canvasRecapDemo').show();
    $('#errorrecapDemo').hide();

    let datasets = [{
        label: "Toutes les données au moment X",
        backgroundColor: 'rgba(100, 199, 32, 0.5)',
        borderColor: 'rgb(100, 199, 32)',
        data: [14, 10, 8, 6, 1]
    }];

    let labels = ['Humidité du sol', 'Température', 'Luminosité', 'Qualité de l\'air', 'Pression'];

    buildGraph("recapDemo", "radar", labels, datasets, "Récapitulatif");
}

/**
 * Construis les graphiques
 * @param id l'id du canvas
 * @param type le type de graphique (line, bar, radar)
 * @param labels les labels des données []
 * @param datasets les données []
 * @param title le titre du graphique
 * @param func la function a appelé lors d'un onClick
 */
function buildGraph(id, type, labels, datasets, title, func){
    let ctx = document.getElementById(id).getContext('2d');
    charts[id] = (new Chart(ctx, {
        type: type,
        data : {
            labels: labels,
            datasets: datasets
        },
        options: {
            title: {
                display: true,
                text: title
            },
            responsive: true,
            maintainAspectRatio: false,
            onClick: func,
        }
    }));
}

/**
 * Permet de changer graphique detail quand click sur graph global
 * @param evt le sender de l'event
 */
function changeGraphClick(evt){
    let bar = this.getElementAtEvent(event);
    if (!bar.length) return; //return if not clicked on bar
    let dateBar = bar[0]._model.label;
    let dateGraph = dateBar.replace(/\//g, "-");
    let endpoint = "records/" + $('#selectBoxGraph').val() + "/" + ($('#selectCaptorGraph').val()).toLowerCase() + "/" + dateGraph + "-2018";

    callAPIForGraph(endpoint, buildSimpleGraph, "upDate", "divCanvasDetail", "graphCanvasDetail", "Taux d'humidité dans le sol",
        "errorgraphCanvasDetail", "Humidité du sol le ", ["Heure", "Taux d'humidité"]);
}

/**
 * Construis les failback des canvas (accessibilité)
 * @param id l'id du canvas
 * @param data les données
 * @param titreData le titre de la colonne des données
 * @param titreCol le titre de la colonne des labels
 * @param legende la légende de la table
 */
function buildFailBack(id, data, titreData, titreCol, legende){
    let failBack = "<table><caption>" + legende + "</caption><tr>";

    titreCol.forEach(function(item){
        failBack += "<th>" + item + "</th>";
    });

    failBack += "</tr>";

    for(item in titreData){
        failBack += "<tr><td>" + titreData[item] + "</td><td>" + data[item] + "</td></tr>";
    }
    failBack += "</table>";

    $('#' + id).html(failBack);
}

/**
 * Remets le canvas à zéros
 * @param idCanvasDiv l'id de la div qui contient le canvas
 * @param idCanvas l'id du canvas à reset
 * @param title le titre du popUp à afficher à la place du graphique
 */
function resetCanvas(idCanvasDiv, idCanvas, title){
    $('#' + idCanvasDiv).animate({ opacity: 0.0 }, 200, function(){
        new Chart(document.getElementById(idCanvas).getContext('2d'), 0);
        $('#' + idCanvasDiv).hide().css('opacity', 1.0);
    });

    $('#error' + idCanvas + " .errorTitle").text(title);
    $('#error' + idCanvas).show()
}

/**
 * Détruis tous les canvas
 */
function destroyAllCanvas(){
    for(let i = 0; i < charts.length; i++){
        charts[i].destroy();
    }
    charts = [];
}

/**
 * Mets à jour les données d'un graph
 * @param id l'id du canvas du graphiques
 * @param label les nouveaux labels
 * @param data les nouvelles données
 */
function updateGraph(id, label, data) {

    let chart = charts[id];

    chart.config.data.labels = label;
    chart.data.datasets[0].data = data;

    chart.update();
}