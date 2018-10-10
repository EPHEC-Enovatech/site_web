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

    $('html,body').animate({scrollTop:$("#"+id).offset().top-size_bar_split[0]},'slow','easeInOutCubic', function () {
        //$("html, body").removeClass('disableScroll');
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

//Création des waypoints de super scroll pour animation de l'intro
function createWaypointSuperScroll(id, directionScroll, offsetScroll, idToGo){
    var waypointSuperScroll = new Waypoint({
        element: document.getElementById(id),
        handler: function(direction) {
            if (direction === directionScroll) {
                goToByScroll(idToGo);
                //$('html, body').addClass('disableScroll');
            }
        },
        offset: offsetScroll
    });

    scrollWaypoint.push(waypointSuperScroll);
}

function superScrollTriger(offset){
    var taille = $('#menu_left').css('height').split("px")[0];
    offset += parseInt(taille);
    console.log(offset);
    return offset;
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

    //createWaypointSuperScroll('presentation', 'down', '99.5%', 'presentation');

    //createWaypointSuperScroll('presentation', 'up', superScrollTriger(5), 'allIntroElement');

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

//Chaque fois que la fenêtre est redimensionnée
$().on("resize", function(){

    if(window.innerWidth > 600){
        $('#menu').show();
    } else {
        $('#menu').hide();
    }

    Waypoint().refreshAll();
    copyHeightNavBar();
});