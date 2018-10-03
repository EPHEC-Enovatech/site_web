function copyHeightNavBar(){
    var taille = $('#headers_menu').css('height');
    $('#startPageHeader').css('height', taille);
    console.log("taille : " + taille);
}

function goToByScroll(id){
    if (window.innerWidth>600){
        $('html,body').animate({scrollTop:$("#"+id).offset().top-150},'slow');
    }
    else {
        $('html,body').animate({scrollTop:$("#"+id).offset().top},'slow');
    }
}

function change($section){
    $('menu ul li a').removeClass('current');
    currentSection = $section.attr('id');
    $('.target-'+currentSection).addClass('current');
    console.log("hello")
}

$(document).ready(function(){
    copyHeightNavBar();
    $("#main section").waypoint( function( direction ) {
        if( direction === 'down' ) {
            change( $( this ) );
        }
    }, { offset: '20%' } ).waypoint( function( direction ) {
        if( direction === 'up' ) {
            change( $( this ) );
        }
    }, { offset: '-20%' } );
});
$(window).resize(copyHeightNavBar);