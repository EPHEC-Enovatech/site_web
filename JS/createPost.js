var message = "";
$(document).ready(function() {
    $('.cat').select2({
        placeholder: "Choisissez une ou plusieurs catégories à mettre dans votre publication",
        width: '90vw',
        dropdownParent: $('#dropdown'),
        allowClear: !0
    });
    message = $("#textEditor").tailWriter({
        "width": "100%",
        "toolbar": ["bold", "italic", "headers", "|", "quote", "list:unordered", "list:ordered", "|", "link", "image", "|", "preview"],
        "toolbar_pos": "top",
        "indent_tab": !0,
        "action_header1": !0,
        "action_header2": !0,
        "tooltip_show": !0,
        "statusbar": !1,
    });
    callAPI('categories', selectCategorie);
    $('#createPubli').on("submit", createPubli);
});
function setLoading(n) {

}

function selectCategorie(response) {
    let select = '';
    if (response.responseJSON.status === "SUCCESS") {
        let categories = response.responseJSON.data;
        for (item in categories) {
            select += "<option value=" + categories[item].id + ">";
            select += categories[item].categoryName + "</option>"
        }
    } else {
        select += "<option value=''>Aucunes catégories disponible</option>"
    }
    $('#selectCat').html(select)
}

function createPubli(evt) {
    evt.preventDefault();
    let cat = $('.cat').select2('data');
    let formData = new FormData();
    let categories = [];
    for (item in cat) {
        categories.push(cat[item].id)
    }
    formData.append("postTitle", evt.target.titleEditor.value);
    formData.append("postText", evt.target.textEditor.value);
    formData.append("user_id", getCookie('user-id'));
    for (var i = 0; i < categories.length; i++) {
        formData.append('categories[]', categories[i])
    }
    callAPIMethod("POST", formData, "posts", getErrorCreatePost)
}

function getErrorCreatePost(response) {
    console.log(response);
    let message = JSON.parse(response.responseText);
    switch (message.status) {
        case "SUCCESS":
            console.log('success');
            window.location.href = "forumPage.html";
            break;
        case "ERROR":
            console.log('success');
            break
    }
}