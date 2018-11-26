var message;
$(document).ready(function() {
    callAPI("posts/" + getUrlParameter('post_id'), publication);
    var select2 = $('.catPubli').select2({
        placeholder: "Choisissez une ou plusieurs catégories à filtrer",
        width: '100%',
    });
    message = new SimpleMDE({
        autofocus: false,
        element: $("#commentCreation")[0],
        placeholder: "Donner votre avis sur cette publication ! Soyez le plus complet possible...",
        status: false,
        toolbar: false,
        autosaved: false,
    });
    $('#createComment').on("submit", createComment);


});
function publication(response) {
    let publi = '';
    let publication
    if (response.responseJSON.status === "SUCCESS") {

        publication = response.responseJSON.data;
        let arrCategories = publication.categories;

        publi += "<li><div class=\"auteur\"> <h3 class=\"name\"><bdi>" + "" + "</bdi></h3>";
        publi += "<img src=\"IMG/avatar.png\" alt=\"avatar image\" class=\"avatar\"></div>";
        publi += "<div class=\"publication\"> <h3 class=\"object\">" + publication.postTitle + "</h3>";
        publi += "<p class=\"message\"><pre>" + publication.postText + "</pre></p>";
        publi += "<select class=\"cat catPubli\" name=\"states[]\" multiple=\"multiple\" disabled>";
        for (cat in arrCategories) {
            publi += "<option value=\"" + arrCategories[cat].id + "\" selected>" + arrCategories[cat].categoryName + "</option>";
        }
        publi += "</select>";
        let date = moment(new Date(publication.postDate)).format("LLL");
        publi += "<p class=\"date\">" + date + "</p>";
        publi += "</div></li>";




    } else {
        publi += "<li>Cette publication n'existe pas</li>";
    }
    if(publi == '') publi += "<li>Cette publication n'existe pas</li>";
    $('.listPubli').html(publi);
    listComment(publication.comments);
    $('.catPubli').select2();
}

function listComment(comments) {
    let list = '';
    console.log(comments);
    if (comments!= []) {

        for(item in comments){

            list += "<li><div class=\"auteur\"> <h3 class=\"name\"><bdi>" + "" + "</bdi></h3>";
            list += "<img src=\"IMG/avatar.png\" alt=\"avatar image\" class=\"avatar\"></div>";
            list += "<div class=\"publication\"> <pre><p class=\"message\">" + comments[item].commentText + "</p></pre>";
            let date = moment(new Date(comments[item].commentDate)).format("LLL");
            list += "<p class=\"date\">" + date + "</p>";
            list += "</div></li>";

        }
    } else {
        list += "<li>Il n'y a pas de commentaire dans cette publication</li>";
    }
    if(comments = undefined) list += "<li>Il n'y a pas de commentaire dans cette publication</li>";
    $('#commentList').html(list);
    $(function(){

        $("div.holder").jPages({
            containerID : "commentList",
            perPage: 5,
            previous: "◄",
            next: "►"
        });

    });
}

function createComment(evt) {
    evt.preventDefault();
    let formData = new FormData();
    formData.append("commentText", evt.target.commentEditor.value);
    formData.append("user_id", getCookie('user-id'));
    formData.append("post_id", getUrlParameter('post_id'));

    callAPIMethod("POST", formData, "comments", getErrorCreateComment);
    message.codemirror.setValue("");
}

function getErrorCreateComment(response){
    let message = JSON.parse(response.responseText);


    switch (message.status) {
        case "SUCCESS":
            console.log('success');
            callAPI("posts/" + getUrlParameter('post_id'), publication);
            message.codemirror.setValue("");
            break;
        case "ERROR":
            console.log('success');
            break;
    }
}