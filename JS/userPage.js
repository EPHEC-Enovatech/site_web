function calculateSizeMain(){
    let tailleHeader = parseFloat((($('#document_Header').css('height')).split("px"))[0]);
    let tailleFooter = parseFloat((($('#document_Footer').css('height')).split("px"))[0]);
    let tailleHeaderFooter = tailleHeader + tailleFooter;

    $('#document_Main').css('min-height', "calc(100vh - " + tailleHeaderFooter + "px)");
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
    calculateSizeMain();

    $('.sousMenu').on("click", function(){
        loadHTML($(this).attr('id'));
    });

    $('#contentZone').load('userHTML/userInfo.html');

    $(window).on("resize", function(){
        calculateSizeMain();
    });
});