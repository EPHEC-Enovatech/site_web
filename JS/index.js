//Copie la hauteur de la barre de navigation et l'injecte dans #startPageHeader
function copyHeightNavBar(){
    var taille = $('#headers_menu').css('height');
    $('#startPageHeader').css('height', taille);
    console.log("taille : " + taille);
    return taille;
}

//Scroll automatique
function goToByScroll(id){
    var size_bar = $('#headers_menu').css('height');
    var size_bar_split = size_bar.split("px");

    if (window.innerWidth>600){
        $('html,body').animate({scrollTop:$("#"+id).offset().top-size_bar_split[0]},'slow');
    }
    else {
        $('html,body').animate({scrollTop:$("#"+id).offset().top},'slow');
    }
}

var currentSection = "section1";

function change($div){
    $('#menu ul li a').removeClass('current');
    //currentSection = $div.attr('class');
    //$('.target-'+currentSection).addClass('current');
    $('.target-div'+$div).addClass('current');
    console.log("event + " + $div);
}

//Toggle la class current
function deleteCurrent(){
    $('#menu ul li a').each(function(i){
        $(this).removeClass("current");
    })
}

function createWaypointScroll() {
    var waypoint_presentation = new Waypoint({
        element: document.getElementById('presentation'),
        handler: function(direction) {
            if (direction === "down") {
                change(2)
            }
        },
        offset: '20%'
    })

    var waypoint_team = new Waypoint({
        element: document.getElementById('team'),
        handler: function(direction) {
            if (direction === "down") {
                change(3)
            }
        },
        offset: '20%'
    })

    var waypoint_intro = new Waypoint({
        element: document.getElementById('intro'),
        handler: function(direction) {
            if (direction === "down") {
                change(1)
            }
        },
        offset: '20%'
    })

    var waypoint_presentation_up = new Waypoint({
        element: document.getElementById('presentation'),
        handler: function(direction) {
            if (direction === "up") {
                change(2)
            }
        },
        offset: '-20%'
    })

    var waypoint_team_up = new Waypoint({
        element: document.getElementById('team'),
        handler: function(direction) {
            if (direction === "up") {
                change(3)
            }
        },
        offset: '-20%'
    })

    var waypoint_intro_up = new Waypoint({
        element: document.getElementById('intro'),
        handler: function(direction) {
            if (direction === "up") {
                change(1)
            }
        },
        offset: '-20%'
    })
}

$(document).ready(function(){
    copyHeightNavBar();

    //Ajoute la fonction pour toggle la class "current"
    $("#menu ul li a").on("click", function(){
        deleteCurrent();
        $(this).addClass("current");
    })

    createWaypointScroll();

});
$(window).resize(copyHeightNavBar);