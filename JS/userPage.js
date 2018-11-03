function calculateSizeMain(){
    let tailleHeader = parseFloat((($('#document_Header').css('height')).split("px"))[0]);

    $('#document_Main').css('height', "calc(100vh - " + tailleHeader + "px)");
    $('#menuUser').css('max-height', "calc(100vh - " + tailleHeader + "px)");
    $('#contentZone').css('max-height', "calc(100vh - " + tailleHeader + "px)");
    $('#sideNav').css('max-height', "calc(100vh - " + tailleHeader + "px)");
}

function loadHTML(page){

    var contentZone = $('#contentZone');

    if(page === undefined){
        contentZone.html("<p>Vous allez être redirigé sur notre site</p>");
    } else {
        contentZone.load("userHTML/" + page + ".html", function( response, status, xhr ) {
            if (status === "error") {
                contentZone.html("<p>Impossible de charger le contenu, vérifier votre connexion internet</p>");
            }
        });
    }
}

$(function(){

    moment.locale("fr");

    $('.sousMenu').on("click", function(){
        loadHTML($(this).attr('id'));
    });

    $('#contentZone').load('userHTML/userInfo.html');

    $(window).on("resize", function(){
        calculateSizeMain();
    });

    callAPI("users/1", showUserInfo);

    calculateSizeMain();
});

function callAPI(arg, func){
    $.ajax({
        url: "https://api.sensorygarden.be/" + arg,
        type: "GET",
        beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + getCookie('token'));},
        success: func,
        error: func
    });
}

//Affiche les données personnelles de l'utilisateur
function showUserInfo(response) {
    $('#userWelcome').html(response.data.prenom + " " + response.data.nom);
    $('#userName').val(response.data.nom);
    $('#userSurname').val(response.data.prenom);
    $('#userMail').val(response.data.email);
}

//Affiche les box de l'utilisateur dans showBox
function showBox(response){
    let table = "<td>";
    table += response.data.deviceName + "</td><td>";
    table += response.data.device_id + "</td>";

    $('#insertBox').html(table);
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}