//Copie la hauteur de la barre de navigation et l'injecte dans #startPageHeader
function copyHeightNavBar(){
    var taille = $('#menu_left').css('height');
    $('#startPageHeader').css('height', taille);
    $('#presentation, #gridBox').css("min-height", "calc(100vh - " + taille + ")");
    console.log("taille : " + taille);
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
    console.log("event + " + $div);
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

var connexionOpen = false;

function connexionPopUp() {

    $('#connexion').fadeToggle();

    var page = $('header, main, footer');
    if(connexionOpen){
        page.css('filter', 'none');
        connexionOpen = false;
    } else {
        page.css('filter', 'blur(2px)');
        connexionOpen = true;
    }

}

$(function(){

    copyHeightNavBar();

    //Ajoute la fonction pour toggle la class "current"
    $("#menu ul li a").on("click", function(e){
        e.preventDefault();
        deleteCurrent();

        $(this).addClass("current");

        if(window.innerWidth <= 600) {
            $('#menu').toggle()
        }
    });

    //Désactive le comportement standard du lien découvrir
    $('#intro a').on("click", function (e) {
        e.preventDefault();
    });

    //Gère l'animation du menu pour mobile
    $('#mobile_menu_button').on("click", function(){
        $('#menu').slideToggle()
    });

    //Permet de faire disparaitre le menu en cliquant en dehors
    $('main, footer').on("click", function() {
        if(window.innerWidth <= 600){
            if($('#menu:visible')){
                $('#menu').hide();
            }
        }
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
            console.log("petit");
        } else {
            $('#menu').hide();
            $('#contact #contactTitle').text("Une question ou suggestion ? Contactez nous !");
        }
        copyHeightNavBar();
    });

    $('main, footer').on("click", function() {
        if(connexionOpen){
            console.log('break :/')
            connexionPopUp();
        }
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

});