/**
 * Mets le main de façon à ce qu'il occupe toute la fenêtre
 */
function calculateSizeMain(){
    let tailleHeader = parseFloat((($('#document_Header').css('height')).split("px"))[0]);

    $('#document_Main').css('height', "calc(100vh - " + tailleHeader + "px - 2em)");
}

//Gère le controlleur en repsonsive
function responsiveMode(){
    if(window.innerWidth <= 600){
        $('#graphController').hide();
        $('#closeController').on("click", function(){
            $('#graphController').hide();
        }).show();
        $('#showSettings').on("click", function(){
            $('#graphController').show();
        }).show();
    } else {
        $('#graphController').show();
        $('#closeController, #showSettings').hide();
    }
}

$(function(){
    moment.locale("fr");
    calculateSizeMain();
    responsiveMode();

    $('#errorgraphCanvas, #errorgraphCanvasDetail').hide();

    $("#logout").click((e) => {
        e.preventDefault();
        deleteCookie('token');
        deleteCookie('user-id');
        window.location = e.target.href;
    });

    $('#dateDebut').datepicker({
        autoHide: true,
        autoPick: true,
        language: 'fr-FR',
        format: 'dd/mm/yyyy',
        weekday: 1
    });

    $('#dateFin').datepicker({
        autoHide: true,
        autoPick: true,
        date: new Date((new Date()).valueOf() + 1000*3600*24),
        language: 'fr-FR',
        format: 'dd/mm/yyyy',
        weekday: 1
    }).prop('disabled', true);

    $('#dateDebut, #dateFin').on("change", displayGraphDate);

    $('#selectBoxGraph, #selectCaptorGraph').on("change", displayGraphDate);

    $('input:radio[name=chooseTypeDate]').on("change", switchOptionDate);

    callAPIForGraph("devices/" + getCookie('user-id'), fillSelectData);
    callAPIForGraph("sensors", fillSelectCaptor);

    $(window).on("resize", function(){
        calculateSizeMain();
        responsiveMode();
    });
});

/**
 * Permet d'appeler l'API en GET pour les graphiques
 * @param arg la fin de l'endpoint
 * @param func la function à executer à la fin de la requète (pour traitement, premier argument = donnée reçues)
 * @param actionGraph draw / upDate
 * @param idCanvasDiv la div qui contient le canvas
 * @param idCanvas l'id du canvas
 * @param titleGraph le titre du grapique
 * @param idError l'id du conteneur de l'erreur
 * @param label le label des données
 * @param errorLabel le label de l'erreur
 * @param dateAPIDebut la date de début
 * @param endDate la date de fin
 */
function callAPIForGraph(arg, func, actionGraph, idCanvasDiv, idCanvas, titleGraph, idError, label, errorLabel, labelYData, dateAPIDebut, endDate){
    $.ajax({
        url: "https://api.sensorygarden.be/" + arg,
        type: "GET",
        beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + getCookie('token'));},
        complete: function(data){
            func(data, actionGraph, idCanvasDiv, idCanvas, titleGraph, idError, label, errorLabel, labelYData, dateAPIDebut, endDate);
        }
    });
}

/**
 * Actualise les graphiques selon les données du formulaire de controle
 */
function displayGraphDate(){
    let endDate;
    let dateAPIFin;

    let checkedRadio = $('input:radio[name=chooseTypeDate]:checked').attr("id");
    if(checkedRadio === "singleDate"){
        endDate = moment(new Date());
        dateAPIFin = endDate.format("DD-MM-YYYY");
    } else if (checkedRadio === "multiDate") {
        endDate = moment($('#dateFin').datepicker('getDate'));
        dateAPIFin = endDate.format("DD-MM-YYYY");
    }

    let selectedCaptor = $('#selectBoxGraph').val();
    let dateAPIDebut = moment($('#dateDebut').datepicker('getDate'));
    let dateAPI = dateAPIDebut.format("DD-MM-YYYY");
    let captor = ($('#selectCaptorGraph').val()).toLowerCase();

    let titleLabelData = titreGraphFr[captor.toLowerCase()];
    let titleLabelDataAverage = titreGraphMoyenneFr[captor.toLowerCase()];
    let labelYData = labelY[captor.toLowerCase()];

    callAPIForGraph("records/" + selectedCaptor + "/" + captor + "/" + dateAPI, buildSimpleGraph, "upDate", "divCanvasDetail", "graphCanvasDetail", titleLabelData,
        "errorgraphCanvasDetail", titleLabelData + " le", ["Heure", titleLabelData], labelYData);

    callAPIForGraph("records/" + selectedCaptor + "/" + captor + "/" + dateAPI + "/" + dateAPIFin, buildAverageGraphWeek, "upDate", "divCanvas", "graphCanvas", titleLabelDataAverage,
        "errorgraphCanvas", titleLabelDataAverage + " du", ["Heure", titleLabelDataAverage], labelYData, dateAPIDebut, moment(endDate).add(1, "d"));
}

/**
 * Rempli le select de box dans showData
 * @param response la réponse de l'API (Sensory Captor)
 */
function fillSelectData(response){

    let select = "";

    if (response.responseJSON.status === "SUCCESS") {

        let boxs = response.responseJSON.data;
        select = "";

        for(let item in boxs){
            select += "<option value=" + boxs[item].device_id + ">";
            select += boxs[item].deviceName + "</option>";
        }
    } else {
        select += "<option value=''>Aucun Sensory Captor</option>";
    }
    $('#selectBoxGraph').html(select);

    initGraph();
}

/**
 * Initialise les graphiques
 */
function initGraph() {
    let today = moment(new Date());
    let beforeToday = moment(today).subtract(6, "d");
    let captor = $('#selectBoxGraph').val();

    let titleLabelDataAvergae = titreGraphMoyenneFr["humidite"];
    let titleLabelData = titreGraphFr["humidite"];
    let labelYData = labelY["humidite"];

    callAPIForGraph("records/" + captor + "/Humidite/" + moment(today).format("DD-MM-YYYY"), buildSimpleGraph, "draw", "divCanvasDetail", "graphCanvasDetail", titleLabelData,
        "errorgraphCanvasDetail", titleLabelData + " le", ["Heure", titleLabelData], labelYData);

    /*callAPIForGraph("records/" + captor + "/all/" + moment(today).subtract(1, "d").format("DD-MM-YYYY"), buildRecap, "draw", "divCanvas", "graphCanvas", titleLabelData,
        "errorgraphCanvas", titleLabelData + " du", ["Heure", titleLabelData], beforeToday, moment(today).add(1, "d"));*/

    callAPIForGraph("records/" + captor + "/Humidite/" + moment(beforeToday).format("DD-MM-YYYY") + "/" + moment(today).format("DD-MM-YYYY"), buildAverageGraphWeek, "draw", "divCanvas", "graphCanvas", titleLabelDataAvergae,
        "errorgraphCanvas", titleLabelDataAvergae + " du", ["Heure", titleLabelDataAvergae], labelYData, beforeToday, moment(today).add(1, "d"));
}

/**
 * Liste des capteurs en français
 * @type {{Humidite: string, Qualite_air: string, Temperature: string, Humidite_terre: string, Luminosite: string, Pression: string}}
 */
const capteurFr = {
    "Humidite": "Humidité",
    "Qualite_air": "Qualité de l'air",
    "Temperature": "Température",
    "Humidite_terre": "Humidité du sol",
    "Luminosite": "Luminosité",
    "Pression": "Pression"
};

/**
 * Liste titre pour les graphiques
 * @type {{Humidite: string, Qualite_air: string, Temperature: string, Humidite_terre: string, Luminosite: string, Pression: string}}
 */
const titreGraphFr = {
    "humidite": "Taux d'humidité dans l'air",
    "qualite_air": "Qualité de l'air",
    "temperature": "Température",
    "humidite_terre": "Taux d'humidité du sol",
    "luminosite": "Luminosité",
    "pression": "Pression"
};

/**
 * Liste titre pour les graphiques
 * @type {{Humidite: string, Qualite_air: string, Temperature: string, Humidite_terre: string, Luminosite: string, Pression: string}}
 */
const titreGraphMoyenneFr = {
    "humidite": "Taux d'humidité moyen dans l'air",
    "qualite_air": "Qualité de l'air moyenne",
    "temperature": "Température moyenne",
    "humidite_terre": "Taux d'humidité moyen du sol",
    "luminosite": "Luminosité moyenne",
    "pression": "Pression moyenne"
};

/**
 * Liste des labels pour l'axes Y
 * @type {{humidite: string, qualite_air: string, temperature: string, humidite_terre: string, luminosite: string, pression: string}}
 */
const labelY = {
    "humidite": "Humidité de l'air (%)",
    "qualite_air": "Qualité de l'air (AQI)",
    "temperature": "Température (°C)",
    "humidite_terre": "Humidité du sol (um)",
    "luminosite": "Luminosité (Lux)",
    "pression": "Pression (Pa)"
};

/**
 * Interval de valeurs OK
 * @type {{humidite: string, qualite_air: string, temperature: string, humidite_terre: string, luminosite: string, pression: string}}
 */
const minMaxData = {
    "humidite": [40, 60],
    "qualite_air": [0, 400],
    "temperature": [15, 25],
    "humidite_terre": [700, 900],
    "luminosite": [0, 1000],
    "pression": [1012, 1014]
};

/**
 * rempli le select des capteurs
 * @param response la réponse de l'API (capteurs)
 */
function fillSelectCaptor(response){

    let select = "";

    if (response.responseJSON.status === "SUCCESS") {
        let captors = response.responseJSON.data;

        for(let item in captors){
            select += "<option value=" + captors[item].sensorName + ">";
            select += capteurFr[captors[item].sensorName] + "</option>";
        }
    } else {
        select += "<option value=''>Aucun Capteur disponible</option>";
    }
    $('#selectCaptorGraph').html(select);
}

/**
 * Selectionne l'affichage si pick une ou plusieurs dates
 * @param sender le sender de l'event
 */
function switchOptionDate(sender) {
    if(sender.target.id === "singleDate"){
        $("#dateFin").prop('disabled', true);

        let today = moment(new Date());
        let beforeToday = moment(today).subtract(6, "d");
        let captorBox = $('#selectBoxGraph').val();
        let dateDebut = moment($('#dateDebut').datepicker('getDate'));
        let captor = ($('#selectCaptorGraph').val()).toLowerCase();
        let titleLabelData = titreGraphFr[captor.toLowerCase()];
        let titleLabelDataAverage = titreGraphMoyenneFr[captor.toLowerCase()];
        let labelYData = labelY[captor.toLowerCase()];

        if(dateDebut > beforeToday){
            callAPIForGraph("records/" + captorBox + "/" + captor + "/" + moment(beforeToday).format("DD-MM-YYYY") + "/" + moment(today).format("DD-MM-YYYY"), buildAverageGraphWeek, "upDate", "divCanvas", "graphCanvas", titleLabelData,
                "errorgraphCanvas", titleLabelData + " du", ["Heure", titleLabelData], labelYData, beforeToday, moment(today).add(1, "d"));
        } else {
            callAPIForGraph("records/" + captorBox + "/" + captor + "/" + moment(dateDebut).format("DD-MM-YYYY") + "/" + moment(today).format("DD-MM-YYYY"), buildAverageGraphWeek, "upDate", "divCanvas", "graphCanvas", titleLabelDataAverage,
                "errorgraphCanvas", titleLabelDataAverage + " le", ["Heure", titleLabelDataAverage], labelYData, dateDebut, moment(today).add(1, "d"));
        }


        $("#multiDateLabel").css("backgroundColor", "darkgrey");
    } else if(sender.target.id === "multiDate") {
        $("#dateFin").prop('disabled', false);
        $("#multiDateLabel").css("backgroundColor", "#4CAF50");
        displayGraphDate();
    }
}