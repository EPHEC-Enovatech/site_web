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

function toggleHoverMenu(li){
    $('.sousMenu').removeClass('currentUserMenu');
    $('.' + li.classList[1]).addClass('currentUserMenu');
}

//Gère le menu latéral en repsonsive
function toggleSlideMenu(){
    if(window.innerWidth <= 600){
        $('#menuUser').show().css("max-height", "100vh").css("height", "100vh");
        $('#sideNav').css("height", window.innerHeight).css("max-height", window.innerHeight);
        $('.menu-link').show().bigSlide({
            menu: '#menuUser',
            easyClose: true,
        });
    } else {
        $('#sideNav').css("height", "auto");
        $('#menuUser').css("position", "initial").css("left", 0).css("width", "auto").css("height", "auto");
        $('.menu-link').hide();
        calculateSizeMain();
    }
}

$(function(){

    moment.locale("fr");
    $('.sousMenu').on("click", function(e){

        if(e.target.hasAttribute("href")){
            loadHTML(e.target.parentNode.id);
            toggleHoverMenu(e.target.parentElement);
        } else {
            loadHTML($(this).attr('id'));
            toggleHoverMenu(e.target);
        }
    });

    $('#contentZone').load('userHTML/userInfo.html');

    $(window).on("resize", function(){
        toggleSlideMenu();
    });

    $("#logout").click((e) => {
        e.preventDefault();
        deleteCookie('token');
        deleteCookie('user-id');
        window.location = e.target.href;
    });

    callAPI("users/" + getCookie('user-id'), showUserInfo);

    calculateSizeMain();
    toggleSlideMenu();
});

//Affiche les données personnelles de l'utilisateur
function showUserInfo(response, textStatus) {
    let nomUser =  response.responseJSON.data.prenom + " " + response.responseJSON.data.nom;
    $('title').html("Profil " + nomUser);
    $('#userWelcome').html(nomUser);
    $('#userName').val(response.responseJSON.data.nom);
    $('#userSurname').val(response.responseJSON.data.prenom);
    $('#userMail').val(response.responseJSON.data.email);
}

//Affiche les box de l'utilisateur dans showBox
function showBox(response){

    let table = "";

    if (response.responseJSON.status === "SUCCESS") {

        let boxs = response.responseJSON.data;
        for(item in boxs){
            console.log(item);
            table += "<tr><td>";
            table += boxs[item].deviceName + "</td><td>";
            table += boxs[item].device_id + "</td></tr>";
        }
    } else {
        table += "<tr><td colspan='2'>Vous n'avez pas ajouté de Sensory Captor</td></tr>"
    }
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

//Quand le cookies expire
function cookiesExpireTime() {
    $('#disconnectBox').show();
    $('#document_Main, #document_Header').css('filter', 'blur(3px');
}