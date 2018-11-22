$(document).ready(function() {
    var select2 = $('#filterCat').select2({
        placeholder: "Choisissez une ou plusieurs catégories à filtrer",
        width: 'resolve',
    });
    callAPI("posts/" + getUrlParameter('post_id'), publication);


});
function publication(response) {
    let list = '';
    if (response.responseJSON.status === "SUCCESS") {

        let publication = response.responseJSON.data;
        let arrCategories = publication.categories;

        list += "<li><div class=\"auteur\"> <h3 class=\"name\"><bdi>" + "" + "</bdi></h3>";
        list += "<img src=\"IMG/avatar.png\" alt=\"avatar image\" class=\"avatar\"></div>";
        list += "<div class=\"publication\"> <h3 class=\"object\">" + publication.postTitle + "</h3>";
        list += "<p class=\"message\">" + publication.postText + "</p>";
        list += "<select class=\"cat catPubli\" name=\"states[]\" multiple=\"multiple\" disabled>";
        for (cat in arrCategories) {
            list += "<option value=\"" + arrCategories[cat].id + "\" selected>" + arrCategories[cat].categoryName + "</option>";
        }
        list += "</select>";
        let date = moment(new Date(publication.postDate)).format("LLL");
        list += "<p class=\"date\">" + date + "</p>";
        list += "</div></li>";


    } else {
        list += "<li>Il n'y a pas de publication disponible pour l'instant</li>";
    }
    if(list == '') list += "<li>Il n'y a pas de publication disponible pour l'instant</li>";
    $('.listPubli').html(list);
    $('.catPubli').select2();
}