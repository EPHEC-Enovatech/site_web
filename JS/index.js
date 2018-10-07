//Copie la hauteur de la barre de navigation et l'injecte dans #startPageHeader
function copyHeightNavBar(){
    var taille = $('#menu_left').css('height');
    $('#startPageHeader').css('height', taille);
    console.log("taille : " + taille);
    return taille;
}

//Scroll automatique
function goToByScroll(id){
    var size_bar = $('#menu_left').css('height');
    var size_bar_split = size_bar.split("px");

    $('html,body').animate({scrollTop:$("#"+id).offset().top-size_bar_split[0]},'slow');
}

//Gère la subrillance de la barre de navigation
function change($div){
    $('#menu ul li a').removeClass('current');
    $('.target-div'+$div).addClass('current');
    console.log("event + " + $div);
}

//Toggle la class current
function deleteCurrent(){
    $('#menu ul li a').each(function(i){
        $(this).removeClass("current");
    })
}

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
}

$(document).ready(function(){

    //Ajoute la fonction pour toggle la class "current"
    $("#menu ul li a").on("click", function(e){
        e.preventDefault();
        deleteCurrent();
        $(this).addClass("current");

        if(window.innerWidth <= 600) {
            $('#menu').toggle()
        }
    });

    $('#mobile_menu_button').on("click", function(){
        if($('#menu').css('display') === "none"){
            $('#menu').slideDown();
        } else {
            //$('#menu').toggle();
            $('#menu').slideUp();
        }
    });

    $('main, footer').on("click", function() {
        if(window.innerWidth <= 600){
            if($('#menu:visible')){
                $('#menu').hide();
            }
        }
    });

    createWaypointScroll('presentation', 'up', '-20%', 2);
    createWaypointScroll('presentation', 'down', '20%', 2);

    createWaypointScroll('intro', 'up', '-20%', 1);
    createWaypointScroll('intro', 'down', '20%', 1);

    createWaypointScroll('team', 'up', '-20%', 3);
    createWaypointScroll('team', 'down', '20%', 3);

    copyHeightNavBar();

});

$(window).resize(function() {

    if(window.innerWidth > 600){
        $('#menu').show();
    } else {
        $('#menu').hide();
    }

    copyHeightNavBar();
});