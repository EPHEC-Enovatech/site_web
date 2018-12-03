let register = document.getElementById('connexion');

//Copie la hauteur de la barre de navigation et l'injecte dans #startPageHeader
function copyHeightNavBar(){
    var taille = $('#menu_left').css('height');
    $('#startPageHeader').css('height', taille);
    $('#presentation, #gridBox').css("min-height", "calc(100vh - " + taille + ")");
    //console.log("taille : " + taille);
    return taille;
}

//Scroll automatique
function goToByScroll(id){

    Waypoint.disableAll();

    var size_bar = $('#menu_left').css('height');
    var size_bar_split = size_bar.split("px");

    $('html,body').animate({scrollTop:$("#"+id).offset().top-size_bar_split[0]},'slow','easeInOutCubic', function () {
        Waypoint.enableAll();
    });
}

//Gère la surbrillance de la barre de navigation
function change($div){
    if($div === -1 && window.innerWidth >= 600){
        $('#document_Header').css("animation-name", "changeColorToWhite");
    } else if ($div === -2 && window.innerWidth >= 600){
        $('#document_Header').css("animation-name", "changeColorToTransparent");
    } else {
        $('#menu ul li a').removeClass('current');
        $('.target-div'+$div).addClass('current');
    }
}

//Toggle la class current
function deleteCurrent(){
    $('#menu ul li a').each(function(){
        $(this).removeClass("current");
    })
}

var scrollWaypoint = [];

//Création des waypoints de scroll pour animation
function createWaypointScroll(id, directionScroll, offsetScroll, changeCall){
    var waypoint = new Waypoint({
        element: document.getElementById(id),
        handler: function(direction) {
            if (direction === directionScroll) {
                change(changeCall)
            }
        },
        offset: offsetScroll
    });
    scrollWaypoint.push(waypoint);
}

//https://www.coordonnees-gps.fr/
//Initialise la carte
function initMap() {
    var ephec = {lat: 50.665859, lng: 4.61213900000007};
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 17,
        center: ephec,
        scrollwheel: false
    });
    new google.maps.Marker({
        position: ephec,
        map: map,
        title: "Haute École EPHEC"
    });
}

//True si la fenètre de connection est ouverte
let connexionOpen = false;

//Gère l'apparition/disparition de la fenètre de connection
function connexionPopUp() {

    let connexion = $('#connexion');

    if(connexionOpen) connexion.show();

    $('#subError').hide();
    connexion.fadeToggle();

    let page = $('#document_Header, #document_Main, #document_Footer');
    if(connexionOpen){
        page.css('filter', 'none');
        $('html, body').removeClass('disableScroll');
        connexionOpen = false;
    } else {
        page.css('filter', 'blur(3px)');
        $('html, body').addClass('disableScroll');
        connexionOpen = true;
        trapFocus(register);
    }
}

//Toggle le mode inscription et connexion
function toggleRegisterLogIn(mode) {
    $('#subError').hide();
    if(mode === "logIn"){
        $('#subName, #subSurname, #confirmPassword').prop('required',false).hide();
        $('#legalDiv').hide();
        $('#forgotMDP').show();
        $('#register').html("Pas encore inscrit ? <a href='#' onclick=toggleRegisterLogIn('register')>S'inscrire</a>");
        $('#buttonRegister').attr("value", "Se connecter");
        $('#formConnexion header h2').text("Connexion");
        $('#formConnexion').off('submit').submit(authenticate);
        trapFocus(register);
    } else if (mode === "register"){
        $('#subName, #subSurname, #confirmPassword').prop('required',true).show();
        $('#legalDiv').show();
        $('#forgotMDP').hide();
        $('#register').html("Déjà inscrit ? <a href='#' onclick=toggleRegisterLogIn('logIn')>Se connecter</a>");
        $('#buttonRegister').attr("value","S'inscrire");
        $('#formConnexion header h2').text("Inscription");
        $('#formConnexion').off('submit').submit(signin);
        trapFocus(register);
    }
}

//Gère l'envoi de mail de contact
function sendMailContact(evt){
    evt.preventDefault();
    $('#formContact').trigger("reset");

    let formData = new FormData();
    formData.append("nom", evt.target.formName.value);
    formData.append("email", evt.target.mail.value);
    formData.append("message", evt.target.message.value);

    if(evt.target.mail2.value === ""){
        callAPIMethod("POST", formData, "contact", function(data){
            let response = JSON.parse(data.responseText);
            if(response.status === "SUCCESS"){
                $('#errorContactForm').text("Le mail a bien été envoyé !").addClass("success").show();
            } else {
                $('#errorContactForm').text("Impossible d'envoyer le mail").addClass("error").show();
            }
        });
    }
}

//Gestion retour mot de passe oublié
function MDPoublie(response) {
    let data = JSON.parse(response.responseText);
    if(data.status === "ERROR"){
        $('#subErrorMDPoublie').removeClass().addClass("error").html(data.message).show();
    } else {
        $('#subErrorMDPoublie').removeClass().addClass("success").html(data.message).show();
        $('#submitMDPoublie').hide();
        $('#resetMDPoublie').val("Retour");
    }

}

//-----------------------------------------------------------------------------

$(function(){

    copyHeightNavBar();

    $('#document_Header').css("background-color", 'rgba(255, 255, 255, 0.7)');

    if(getCookie("token") !== ""){
        $('.target-div5').prop("onclick", null).attr("href", "userPage.html").text("Mon profil");
    }

    $('#errorContactForm').hide();
    $('#formContact').on("submit", sendMailContact);

    //Ajoute la fonction pour toggle la class "current"
    $("#menu ul li a:not(.target-div5)").on("click", function(e){
        e.preventDefault();
        deleteCurrent();

        $(this).addClass("current");

        if(window.innerWidth <= 600) {
            $('#menu').toggle()
        }
    });

    //Désactive le comportement standard du lien découvrir
    $('#intro a, #formConnexion #register a').on("click", function (e) {
        e.preventDefault();
    });

    //Gère l'animation du menu pour mobile
    $('#mobile_menu_button').on("click", function(){
        $('#menu').slideToggle()
    });

    $('#menu ul li .target-div5').on("click", function(){
        if(window.innerWidth <= 600){
            $('#menu').hide();
        }
    });

    //Permet de faire disparaitre le menu en cliquant en dehors
    $('#document_Main, #document_Footer').on("click", function() {
        if(window.innerWidth <= 600){
            if($('#menu:visible')){
                $('#menu').hide();
            }
        }
    });

    //Test si les cookies ont été accepté
    if(getCookie("cookies_enabled") === ""){
        $('#dialCookies button').on("click", function(){
            $('#dialCookies').hide();
            setCookie("cookies_enabled", "Les cookies ont été accepté", 30);
        });
        $('#dialCookies').show();
    }

    $('#closeConnexion').on("click", function() {
        $('#formConnexion').trigger("reset");
    });

    //Gère le formulaire de MDP oublié
    $('#formMDPoublie').on("submit", function(evt){
        evt.preventDefault();
        let mail = evt.target.email.value;
        let formData = new FormData();
        formData.append("email", mail);
        let endPoint = "reset/";
        callAPIMethod("POST", formData, endPoint, MDPoublie);
    }).on("reset", function(){
        $('#MDPoublie').hide();
        $('#connexion').show();
    });
    $('#subErrorMDPoublie').hide();

    $('#forgotMDP').on("click", function(){
        $('#MDPoublie').show();
        trapFocus(formMDPoublie);
        $('#connexion').hide();
    });

    //Si internet explorer
    // noinspection RegExpRedundantEscape
    if ((window.navigator.userAgent.indexOf("MSIE ")) > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
        $("mobile_menu_button").css('top', '1em');
    }

    createWaypointScroll('presentation', 'up', '-20%', 2);
    createWaypointScroll('presentation', 'down', '20%', 2);

    createWaypointScroll('intro', 'up', '-20%', 1);
    createWaypointScroll('intro', 'down', '20%', 1);

    createWaypointScroll('team', 'up', '-20%', 3);
    createWaypointScroll('team', 'down', '20%', 3);

    createWaypointScroll('contact', 'up', '-20%', 4);
    createWaypointScroll('contact', 'down', '20%', 4);

    createWaypointScroll('presentation', 'up', '96%', -2);
    createWaypointScroll('presentation', 'down', '96%', -1);

    copyHeightNavBar();

    /*$("#js-rotating").Morphext({
        // Animation de animate.css
        animation: "bounceIn",
        // Séparateur
        separator: ",",
        // Délais entre chaque mot
        speed: 2500,
        complete: function () {
            // CallBack
        }
    });*/

    //Chaque fois que la fenêtre est redimensionnée
    $(window).on("resize", function(){

        if(window.innerWidth > 600){
            $('#menu').show();
            $('#contact #contactTitle').text("Une question ou suggestion ? Envoyer nous une lettre !");
        } else {
            $('#menu').hide();
            $('#contact #contactTitle').text("Une question ou suggestion ? Contactez nous !");
        }
        copyHeightNavBar();
    });

    //#menu ul li a:not(.target-div5)
    $('#document_Main, #document_Footer, #document_Header #headers_menu #menu li a:not(.target-div5)').on("click", function() {
        if(connexionOpen){
            $('#MDPoublie').hide();
            connexionPopUp();
        }
    });

    //Anti robot
    $('#mail2').hide();

    //Prevent le default du lien "déjà inscrit ?"
    $('#register a').on("click", function(e){
        e.preventDefault()
    });

    //Easter Egg - private joke
    // noinspection JSUnusedLocalSymbols
    var egg = new Egg("c,o,o,k,i,e,s", function() {
        console.log("COOKIES !");
        $('#logo').attr("src", "IMG/icon/cookies.svg").css("background-color", "transparent");
        $('#logo_title').text("COOKIES HUB");
        $('#intro h1').html('CookiesHub, le cookie <span id=\"js-rotating\">connecté, accessible à tous, trop Cool</span>');
        $("#js-rotating").Morphext({
            animation: "bounceIn",
            separator: ",",
            speed: 2500
        });
    }).listen();

    //Cache l'erreur de la connection
    $('#subError').hide();

    // Authentication event handle
    $("#formConnexion").submit(authenticate);

});