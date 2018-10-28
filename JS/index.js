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
    $('#menu ul li a').removeClass('current');
    $('.target-div'+$div).addClass('current');
    //console.log("event + " + $div);
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
var connexionOpen = false;

//Gère l'apparition/disparition de la fenètre de connection
function connexionPopUp() {

    $('#connexion').fadeToggle();

    var page = $('#document_Header, #document_Main, #document_Footer');
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
    if(mode === "logIn"){
        $('#subName').hide();
        $('#subSurname').hide();
        $('#confirmPassword').hide();
        $('#register').html("Pas encore inscrit ? <a href='#' onclick=toggleRegisterLogIn('register')>S'inscrire</a>");
        $('#buttonRegister').attr("value", "Se connecter");
        $('#formConnexion header h2').text("Connexion");
        trapFocus(register);
    } else if (mode === "register"){
        $('#subName').show();
        $('#subSurname').show();
        $('#confirmPassword').show();
        $('#register').html("Déjà inscrit ? <a href='#' onclick=toggleRegisterLogIn('logIn')>Se connecter</a>");
        $('#buttonRegister').attr("value","S'inscrire");
        $('#formConnexion header h2').text("Inscription");
        trapFocus(register);
    }
}

//-----------------------------------------------------------------------------

$(function(){

    copyHeightNavBar();

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
    $('#intro a, #formConnexion a').on("click", function (e) {
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

    $('#closeConnexion').on("click", function() {
        $('#formConnexion').trigger("reset");
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

    copyHeightNavBar();

    $("#js-rotating").Morphext({
        // Animation de animate.css
        animation: "bounceIn",
        // Séparateur
        separator: ",",
        // Délais entre chaque mot
        speed: 2500,
        complete: function () {
            // CallBack
        }
    });

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
            connexionPopUp();
        }
    });

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

    // Authentication event handle
    $("#formConnexion").submit(evt => {
        evt.preventDefault();
        let form = $("#formConnexion")[0];
        let data = { "auth": { "email": form.subMail.value, "password": form.password.value }};
        $.post("https://api.sensorygarden.be/user_token", data).done(data => {
            document.cookie = "token=" + data.jwt + ";";
            document.cookie = "user_id=1;";
            location.href = "log_success.html";
        })
    });

});