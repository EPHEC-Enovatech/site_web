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
 * @param typeData le type de donnée (capteur)
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
 * Construis la table des dernières données
 * @param response la réponse de l'API
 * @param actionGraph draw / upDate
 * @param idCanvasDiv l'id de la div contenant le canvas
 * @param idCanvas l'id du canvas
 * @param titleGraph le titre du graphique
 * @param idError l'id de l'erreur
 */
function buildTableRecap(response, actionGraph, idCanvasDiv, idCanvas, titleGraph,
                    idError){

    switch(response.status) {
        case 404:
            console.log("Pas de donnée disponible");
            $('#' + idCanvasDiv).animate({ opacity: 0.0 }, 200, function(){
                $('#' + idCanvasDiv).hide().css('opacity', 1.0);
            });

            $('#' + idError + " .errorTitle").text(titleGraph);
            $('#' + idError).show();
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
            let dataCaptor = [undefined, undefined, undefined, undefined, undefined, undefined];
            const labelTable = ["Humidité", "Qualité de l'air", "Température", "Humidité du sol", "Luminosité", "Pression"];

            const data = response.responseJSON.data;
            data.forEach(function (item) {
                switch (item.sensor_id) {
                    case 2:
                        dataCaptor[0] = item.data;
                        break;
                    case 3:
                        dataCaptor[1] = item.data;
                        break;
                    case 4:
                        dataCaptor[2] = item.data;
                        break;
                    case 5:
                        dataCaptor[3] = item.data;
                        break;
                    case 6:
                        dataCaptor[4] = item.data;
                        break;
                    case 7:
                        dataCaptor[5] = item.data;
                        break;
                }
            });

            const listCapteur = ["humidite", "qualite_air", "temperature", "humidite_terre", "luminosite", "pression"];

            let table = "<caption>" + titleGraph + "</caption>";
            for(let i = 0; i < labelTable.length; i++){
                let img = "";
                table += "<tr><th class='data_" + i + "'>" + labelTable[i] + "</th>";
                if(dataCaptor[i] !== undefined){
                    let colorTable = colorGraph(listCapteur[i], [dataCaptor[i]]);
                    if(colorTable[0] === 'rgba(46, 204, 64, 0.5)'){ //OK
                        img = "./IMG/graph/success.svg";
                        //img = "greenBox";
                    } else {
                        img = "./IMG/graph/error.svg";
                        //img = "redBox"
                    }
                    table += "<td><div><span></span><p>" + dataCaptor[i] + "</p><img src=" + img + "></div></td></tr>";
                    //table += "<td><div><span></span><p>" + dataCaptor[i] + "</p><span class='check " + img + "'></span></div></td></tr>";
                } else {
                    table += "<td><div><span></span><p>Pas de données</p><img src='./IMG/graph/error.svg'></div></td></tr>";
                }
            }
            $("#" + idCanvas).html(table);
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
    buildGraph(id, type, ["a", "b", "c", "d", "e"], [{
        label: "Pas de donnée",
        borderColor: 'rgb(0, 0, 0)',
        borderWidth: 1,
        pointBorderColor: 'rgb(0, 0, 0)',
        pointRadius: 5,
        data: [0,0,0,0,0],

    }], "Pas de donnée", 'value', func);
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

    let selectedCaptor = $('#selectBoxGraph').val();
    let captor = ($('#selectCaptorGraph').val()).toLowerCase();
    let endpoint = "records/" + selectedCaptor + "/" + captor + "/" + dateGraph + "-2018";

    let typeData = captor.toLowerCase();
    let titleLabelData = titreGraphFr[typeData];
    let titleLabelDataAverage = titreGraphMoyenneFr[typeData];
    let labelYData = labelY[typeData];

    callAPIForGraph(endpoint, buildSimpleGraph, "upDate", "divCanvasDetail", "graphCanvasDetail", titleLabelData,
        "errorgraphCanvasDetail", titleLabelData + " le", ["Heure", titleLabelData], labelYData, typeData);

    callAPIForGraph("records/" + selectedCaptor + "/all/" + dateGraph + "-2018", buildTableRecap, "upDate", "divCanvasRecap", "tableRecap", "Les dernières données du " + dateGraph + "-2018",
        "errorgraphCanvasRecap");
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
        $('#' + idCanvasDiv).hide().css('opacity', 1.0);
    });

    $('#error' + idCanvas + " .errorTitle").text(title);
    $('#error' + idCanvas).show();
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
 * @param daltonien true pour activer le mode daltonien
 * @returns {Array} les couleurs
 */
function colorGraph(capteur, data, daltonien = false){
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

    if(daltonien){

        // Create a temporary canvas and fill it with a grid pattern
        let patternCanvas = document.createElement("canvas"), patternContext = patternCanvas.getContext("2d");
        patternCanvas.width = 10;
        patternCanvas.height = 10;
        patternContext.beginPath();
        patternContext.fillStyle = "red";
        patternContext.fillRect(0, 0, 10, 10);
        patternContext.strokeRect(0.5, 0.5, 10, 10);
        patternContext.stroke();
        let redPattern = patternContext.createPattern(patternCanvas, "repeat");

        for(let i = 0; i < data.length; i++){

            if(data[i] < interval[0] || data[i] > interval[1]) {
                color.push(redPattern);
            } else {
                color.push(green);
            }
        }
    } else {
        for(let i = 0; i < data.length; i++){
            if(data[i] < interval[0] || data[i] > interval[1]) {
                color.push(red);
            } else {
                color.push(green);
            }
        }
    }

    return color;
}
