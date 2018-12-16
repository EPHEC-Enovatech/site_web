var comment;
var deleting;
$(document).ready(function() {
    callAPI("posts/" + getUrlParameter('post_id'), publication);
    var select2 = $('.catPubli').select2({
        placeholder: "Choisissez une ou plusieurs catégories à filtrer",
        width: "20em",
    });
    comment = $("#commentEditor").tailWriter({
        "width": "100%",
        "toolbar": !1,
        "toolbar_pos": "top",
        "indent_tab": !0,
        "action_header1": !0,
        "action_header2": !0,
        "tooltip_show": !1,
        "statusbar": !1,
    });
    $('#mobile_menu_button_side').on("click", function() {
        window.location = "forumPage.html";
    });
    if(getCookie("token")==""){
        $(".logout").hide();

        $('#commentEditor').attr("disabled", true).val("Vous devez être connecté pour créer un commentaire !").css({
            "font-size": (window.matchMedia("(max-width: 600px)").matches)?"1em":"2em",
            "font-weight": "bolder"
        });
        $('#createComment input').attr("disabled", true);

    }
    moment.locale("fr");
    $('#createComment').on("submit", createComment);
    $('#confirmPopUp #cancel').on("click", function(e) {
        $('#confirmPopUp').hide();
        e.preventDefault()
    });
    $('#confirmPopUp #confirm').on("click", function(e) {
        e.preventDefault();
        if (deleting.includes("Post")) {
            callAPIMethod("DELETE", "", "posts/" + deleting.substring(10, deleting.length), getErrorDelete)
        } else if (deleting.includes("Comment")) {
            console.log('testComment');
            callAPIMethod("DELETE", "", "comments/" + deleting.substring(13, deleting.length), getErrorDelete)
        }
        $('#confirmPopUp').hide();
        $('#validationPopUp').show()
    });
    $(".logout").click(function(e) {
        e.preventDefault();
        deleteCookie('token');
        deleteCookie('user-id');
        if(e.target.href !== undefined){
            window.location = e.target.href;
        } else {
            window.location = "index.html";
        }
    });
});
function setLoading(n) {

}

function publication(response) {
    let publi = '';
    let publication;
    if (response.responseJSON.status === "SUCCESS") {
        publication = response.responseJSON.data;
        let garbage = (getCookie("token")!="" && parseJWT(getCookie("token")).admin) ? "<a href='#' id='deletePost" + publication.id + "' class='deletePosts'><img src='IMG/userPage/garbage.svg' class='deletePost' alt='Corbeille de suppression de post'></a>" : "";
        let arrCategories = publication.categories;
        publi += "<li><div class=\"object\"><h3>" + publication.postTitle + "</h3>"+garbage+"</div><div class=\"auteur\"> <h3 class=\"name\"><bdi>" + publication.user.prenom + "</bdi></h3>";
        publi += "<img src=\"IMG/avatar.png\" alt=\"avatar image\" class=\"avatar\"></div>";
        publi += "<div class=\"publication\">";
        publi += "<p class=\"message\"><pre>" + marked(publication.postText) + "</pre></p>";
        publi += "<select class=\"cat catPubli\" name=\"states[]\" multiple=\"multiple\" disabled>";
        for (cat in arrCategories) {
            publi += "<option value=\"" + arrCategories[cat].id + "\" selected>" + arrCategories[cat].categoryName + "</option>"
        }
        publi += "</select>";
        let date = moment(new Date(publication.postDate)).format("LLL");
        publi += "<p class=\"date\">" + date + "</p>";
        publi += "</div></li>"
    } else {
        publi += "<li>Cette publication n'existe pas</li>"
    }
    if (publi == '') publi += "<li>Cette publication n'existe pas</li>";
    $('.listPubli').html(publi);
    listComment(publication.comments);
    $('.catPubli').select2({
        width: '49vw',
    })
}

function listComment(comments) {
    let list = "";
    console.log(comments);
    if (comments != []) {
        for (item in comments) {
            let garbage = (getCookie("token")!="" &&parseJWT(getCookie("token")).admin) ? "<a href='#' id='deleteComment" + comments[item].id + "' class='deletePosts'><img src='IMG/userPage/garbage.svg' class='deletePost' alt='Corbeille de suppression de post'></a>" : "";
            list += "<li><div class='object'><img src=\"IMG/avatar.png\" alt=\"avatar image\" class=\"avatar\">";
            list += "<h3 class=\"name\"><bdi>" + comments[item].user.prenom + "</bdi></h3>" + garbage + "</div>";
            list += "<div class=\"publication\"><p class=\"message\"><pre>" + marked(comments[item].commentText) + "</pre></p>";
            let date = moment(new Date(comments[item].commentDate)).format("LLL");
            list += "<p class=\"date\">" + date + "</p>";
            list += "</div></li>"
        }
    } else {
        list += "<li>Il n'y a pas de commentaire dans cette publication</li>"
    }
    if (comments = undefined) list += "<li>Il n'y a pas de commentaire dans cette publication</li>";
    $('#commentList').html(list);
    $(function() {
        $("div.holder").jPages({
            containerID: "commentList",
            perPage: 5,
            previous: "◄",
            next: "►",
            minHeight: false,
        })
    });
    $('.deletePosts').on("click", function() {
        $('#confirmPopUp').show();
        deleting = $(this).attr('id');
        $('.insertText').html((deleting.includes("Post")) ? "tte publication" : " commentaire")
    })
    $('.listPubli li').css("display", "grid");
}

function createComment(evt) {
    evt.preventDefault();
    let formData = new FormData();
    formData.append("commentText", evt.target.commentEditor.value);
    formData.append("user_id", getCookie('user-id'));
    formData.append("post_id", getUrlParameter('post_id'));
    callAPIMethod("POST", formData, "comments", getErrorCreateComment)
}

function getErrorCreateComment(response) {
    let message = JSON.parse(response.responseText);
    switch (message.status) {
        case "SUCCESS":
            console.log('success');
            callAPI("posts/" + getUrlParameter('post_id'), publication);
            $('#commentEditor').val("");
            break;
        case "ERROR":
            console.log('success');
            break
    }
}

function getErrorDelete(response) {
    let message = JSON.parse(response.responseText);
    switch (message.status) {
        case "SUCCESS":
            if (deleting.includes("Post")) {
                $('#validationForm').on("click", function(e) {
                    e.preventDefault();
                    window.location.href = "forumPage.html";
                    $('#validationPopUp').hide()
                }).on("blur", function(e) {
                    e.preventDefault();
                    window.location.href = "forumPage.html";
                    $('#validationPopUp').hide()
                })
            } else if (deleting.includes("Comment")) {
                $('#validationForm').on("click", function(e) {
                    e.preventDefault();
                    callAPI("posts/" + getUrlParameter('post_id'), publication);
                    $('#validationPopUp').hide()
                }).on("blur", function(e) {
                    e.preventDefault();
                    callAPI("posts/" + getUrlParameter('post_id'), publication);
                    $('#validationPopUp').hide()
                })
            }
            break;
        case "ERROR":
            $('#valText').html(message.message);
            $('#validationButton').on('click', function(e) {
                e.preventDefault();
                $('#validationPopUp').hide()
            }).on("blur", function(e) {
                e.preventDefault();
                $('#validationPopUp').hide()
            });
            break
    }
}