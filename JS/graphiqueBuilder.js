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
 * @param labelYData le label de l'axe Y
 */
function buildSimpleGraph(response, actionGraph, idCanvasDiv, idCanvas, titleGraph,
                          idError, label, errorLabel, labelYData, typeData){

    switch(response.status) {
        case 404:
            console.log("Pas de donnée disponible");
            if(charts[idCanvas] === undefined){
                buildEmptyGraph(idCanvas, "line");
            }
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
                borderColor: 'rgb(0, 0, 0)',
                borderWidth: 1,
                pointBackgroundColor: colorGraph(typeData, humidData),
                pointBorderColor: 'rgb(0, 0, 0)',
                pointRadius: 5,
                data: humidData,

            }];

            if(actionGraph === "draw"){
                buildGraph(idCanvas, "line", humidDate, datasets, titleGraph, labelYData);
            } else if(actionGraph === "upDate"){
                let labelData = label + " " + moment(response.responseJSON.data[0].timestamp).format('LL');
                updateGraph(idCanvas, humidDate, humidData, labelData, titleGraph, labelYData, typeData, "line");
            }
            buildFailBack(idCanvas, humidData, humidDate, errorLabel, titleGraph);
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
 * @param labelYData le label de l'axe Y
 * @param typeData le type de données (capteur)
 * @param startDate la date de début
 * @param endDate la date de fin
 */
function buildAverageGraphWeek(response, actionGraph, idCanvasDiv, idCanvas, titleGraph, idError, label, errorLabel, labelYData, typeData, startDate, endDate){
    
    switch (response.status) {
        case 404:
            console.log("Pas de donnée disponible");
            if(charts[idCanvas] === undefined){
                buildEmptyGraph(idCanvas, "line", changeGraphClick);
            }
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
                label: label + " " + moment(startDate).format("L") + " au " + moment(endDate).subtract(1, "d").format("L"),
                backgroundColor: colorGraph(typeData, dataWeekDay),
                borderColor: 'rgb(0, 0, 0)',
                borderWidth: 1,
                data: dataWeekDay
            }];

            if(actionGraph === "draw"){
                buildGraph(idCanvas, "bar", weekDay, datasets, titleGraph, labelYData, changeGraphClick);
            } else if (actionGraph === "upDate"){
                let labelData;
                if(moment(startDate).format("LL") === moment(endDate).subtract(1, "d").format("LL")){
                    labelData = label + " " + moment(startDate).format("LL");
                } else {
                    labelData = label + " " + moment(startDate).format("L") + " au " + moment(endDate).subtract(1, "d").format("L");
                }
                updateGraph(idCanvas, weekDay, dataWeekDay, labelData, titleGraph, labelYData, typeData, "bar");
            }
            buildFailBack(idCanvas, dataWeekDay, weekDay, errorLabel, "Valeurs moyennes récupérées sur la semaine");
            break;
        default:
            console.log("Erreur serveur")
    }
}

/**
 * Construis le graphique récapitulatif
 * @param response la réponse de l'API
 * @param actionGraph draw / upDate
 * @param idCanvasDiv l'id de la div contenant le canvas
 * @param idCanvas l'id du canvas
 * @param titleGraph le titre du graphique
 * @param idError l'id de l'erreur
 * @param label le label des données
 * @param errorLabel le label de l'erreur
 * @param labelYData le label de l'axe Y
 */
function buildRecap(response, actionGraph, idCanvasDiv, idCanvas, titleGraph,
    idError, label, errorLabel, labelYData, typeData){

    switch(response.status) {
        case 404:
            console.log("Pas de donnée disponible");
            if(charts[idCanvas] === undefined){
                buildEmptyGraph(idCanvas, "radar");
            }
            resetCanvas(idCanvasDiv, idCanvas, titleGraph);
            break;
        case 401:
            console.log("Vous n'êtes pas connecté");
            break;
        case 200:
            $('#' + idCanvasDiv).show();
            $('#' + idError).hide();

            /**
             * Ordre capteur : humidite, qualiteAir, temperature, humiditeSol, luminosite
             * @type {number[]}
             */
            let dataCaptor = [0, 0, 0, 0, 0];
            let countForAverage = [0, 0, 0, 0, 0];

            const data = response.responseJSON.data;
            data.forEach(function (item) {
                switch (item.sensor_id) {
                    case 2:
                        dataCaptor[0] += item.data;
                        countForAverage[0] ++;
                        break;
                    case 3:
                        dataCaptor[1] += item.data;
                        countForAverage[1] ++;
                        break;
                    case 4:
                        dataCaptor[2] += item.data;
                        countForAverage[2] ++;
                        break;
                    case 5:
                        dataCaptor[3] += item.data;
                        countForAverage[3] ++;
                        break;
                    case 6:
                        dataCaptor[4] += item.data;
                        countForAverage[4] ++;
                        break;
                }
            });

            let finalData = [];
            for(let i = 0; i < dataCaptor.length; i++){
                dataCaptor[i] = dataCaptor[i]/countForAverage[i];
                finalData.push(dataCaptor[i]);
            }

            let labelData = ["Humidité", "Qualité de l'air", "Tepérature", "Humidité du sol", "Luminosité"];
            let datasets = [{
                label: label + " " + moment(response.responseJSON.data[0].timestamp).format('LL'),
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: finalData,
            }];

            if(actionGraph === "draw"){
                buildGraph(idCanvas, "radar", labelData, datasets, titleGraph, labelYData);
            } else if(actionGraph === "upDate"){
                updateGraph(idCanvas, labelData, finalData, typeData, "radar");
            }
            buildFailBack(idCanvas, finalData, labelData, errorLabel, titleGraph);
            break;
        default:
            console.log("Erreur serveur");
    }
}

/**
 * Construis les graphiques
 * @param id l'id du canvas
 * @param type le type de graphique (line, bar, radar)
 * @param labels les labels des données []
 * @param datasets les données []
 * @param title le titre du graphique
 * @param labelYData le label de l'axxe Y
 * @param func la function a appelé lors d'un onClick
 */
function buildGraph(id, type, labels, datasets, title, labelYData, func){
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
            scales: {
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: labelYData
                    }
                }]
            }
        }
    }));
}

/**
 * Construis les graphiques
 * @param id l'id du canvas
 * @param type le type de graphique (line, bar, radar)
 * @param func la function a appelé lors d'un onClick
 */
function buildEmptyGraph(id, type, func){
    let ctx = document.getElementById(id).getContext('2d');
    charts[id] = (new Chart(ctx, {
        type: type,
        data : {
            labels: [0, 0, 0, 0, 0],
            datasets: [{
                label: "Pas de donnée",
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: [0,0,0,0,0],
            }]
        },
        options: {
            title: {
                display: true,
                text: "Pas de donnée"
            },
            responsive: true,
            maintainAspectRatio: false,
            onClick: func,
            scales: {
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'value'
                    }
                }]
            }
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
    let captor = ($('#selectCaptorGraph').val()).toLowerCase();
    let endpoint = "records/" + $('#selectBoxGraph').val() + "/" + captor + "/" + dateGraph + "-2018";

    let typeData = captor.toLowerCase();
    let titleLabelData = titreGraphFr[typeData];
    let titleLabelDataAverage = titreGraphMoyenneFr[typeData];
    let labelYData = labelY[typeData];

    callAPIForGraph(endpoint, buildSimpleGraph, "upDate", "divCanvasDetail", "graphCanvasDetail", titleLabelData,
        "errorgraphCanvasDetail", titleLabelData + " le", ["Heure", titleLabelData], labelYData, typeData);
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
 * @param labelData le nouveau label pour les données
 * @param titreGraph le titre du graphique
 * @param labelYData le label de l'axe Y
 * @param typeData le type de données (capteur)
 * @param typeGraph le type de graphique
 */
function updateGraph(id, label, data, labelData, titreGraph, labelYData, typeData, typeGraph) {

    let chart = charts[id];

    chart.config.data.labels = label;
    chart.data.datasets[0].data = data;

    if(labelData !== undefined){
        chart.data.datasets[0].label = labelData;
    }
    if(titreGraph !== undefined){
        chart.options.title.text = titreGraph;
    }
    if(labelYData !== undefined){
        chart.options.scales.yAxes[0].scaleLabel.labelString = labelYData;
    }

    if(typeData !== undefined && data !== undefined) {
        if (typeGraph === "line") {
            console.log("hello");
            chart.data.datasets[0].pointBackgroundColor = colorGraph(typeData, data);
        } else if (typeGraph === "bar") {
            chart.data.datasets[0].backgroundColor = colorGraph(typeData, data);
        } else if (typeGraph === "radar") {

        }
    }

    chart.update();
}

/**
 * Renvoie les couleurs du graphique en fonction des valeurs
 * @param capteur le nom du capteur
 * @param data les données
 * @returns {Array} les couleurs
 */
function colorGraph(capteur, data){
    let green = 'rgba(46, 204, 64, 0.5)';
    let red = 'rgba(255, 65, 54, 0.5)';

    const minMaxData = {
        "humidite": [40, 60],
        "qualite_air": [0, 400],
        "temperature": [15, 25],
        "humidite_terre": [700, 900],
        "luminosite": [0, 1000],
        "pression": [1012, 1014]
    };

    let interval = minMaxData[capteur];
    let color = [];

    for(let i = 0; i < data.length; i++){
        if(data[i] < interval[0] || data[i] > interval[1]) {
            color.push(red);
        } else {
            color.push(green);
        }
    }

    return color;
}
