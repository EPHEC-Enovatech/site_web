function calculateSizeMain(){
    let tailleHeader = parseFloat((($('#document_Header').css('height')).split("px"))[0]);
    let tailleFooter = parseFloat((($('#document_Footer').css('height')).split("px"))[0]);
    let tailleHeaderFooter = tailleHeader + tailleFooter;

    $('#document_Main').css('height', "calc(100vh - " + tailleHeaderFooter + "px)");
    $('#menuUser').css('max-height', "calc(100vh - " + tailleHeaderFooter + "px)");
    $('#contentZone').css('max-height', "calc(100vh - " + tailleHeaderFooter + "px)");
    $('#sideNav').css('max-height', "calc(100vh - " + tailleHeaderFooter + "px)");
}

function loadHTML(page){

    var contentZone = $('#contentZone');

    if(page === undefined){
        contentZone.html("<p>Vous allez être redirigé sur notre site</p>");
    } else {
        contentZone.load("userHTML/" + page + ".html", function( response, status, xhr ) {
            if (status === "error") {
                contentZone.html("<p>Erreur, vérifier votre connexion internet</p>");
            }
        });
    }
}

$(function(){

    $('.sousMenu').on("click", function(){
        loadHTML($(this).attr('id'));
    });

    $('#contentZone').load('userHTML/userInfo.html');

    $(window).on("resize", function(){
        calculateSizeMain();
    });

    $.ajax({
        url: "https://api.sensorygarden.be/users/1",
        type: "GET",
        beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + getCookie('token'));},
        success: showUserInfo
    });

    calculateSizeMain();
});

function showUserInfo(response) {
    $('#userWelcome').html(response.data.prenom + " " + response.data.nom);

    $('#userName').html(response.data.nom);
    $('#userSurname').html(response.data.prenom);
    $('#userMail').html(response.data.email);

    /*$('#name').html(response.data.prenom);
    $.ajax({
        url: "https://api.sensorygarden.be/records/1C8779C000000274/",
        type: "GET",
        beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + getCookie('token'));},
        success: showDataTable
    });*/
}

function showDataTable(response) {
    $('#table').html(createTable(response.data))
}

function createTable(data) {
    var html = "";
    console.log(data);
    data.forEach(element => {
        html += "<tr>";
        html += "<td>" + element.id + "</td>";
        html += "<td>" + element.device_id + "</td>";
        html += "<td>" + element.timestamp + "</td>";
        html += "<td>" + element.sensor_id + "</td>";
        html += "<td>" + element.data + "</td>";
        html +=  "</tr>";
    });
    return html;
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