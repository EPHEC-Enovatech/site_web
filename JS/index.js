//Copie la hauteur de la barre de navigation et l'injecte dans #startPageHeader
function copyHeightNavBar(){
    var taille = $('#menu_left').css('height');
    $('#startPageHeader').css('height', taille);
    console.log("taille : " + taille);
    return taille;
}

//Scroll automatique
function goToByScroll(id){

    Waypoint.disableAll();

    var size_bar = $('#menu_left').css('height');
    var size_bar_split = size_bar.split("px");

    $('html,body').animate({scrollTop:$("#"+id).offset().top-size_bar_split[0]},'slow', function () {
        Waypoint.enableAll();
    });
}

//Gère la subrillance de la barre de navigation
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
    var waypoint_presentation = new Waypoint({
        element: document.getElementById(id),
        handler: function(direction) {
            if (direction === directionScroll) {
                change(changeCall)
            }
        },
        offset: offsetScroll
    });

    scrollWaypoint.push(waypoint_presentation);
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
        var menu = $('#menu');
        if(menu.css('display') === "none"){
            menu.slideDown();
        } else {
            menu.slideUp();
        }
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

});

//Chaque fois que la fenêtre est redimensionnée
$().on("resize", function(){

    if(window.innerWidth > 600){
        $('#menu').show();
    } else {
        $('#menu').hide();
    }

    copyHeightNavBar();
});