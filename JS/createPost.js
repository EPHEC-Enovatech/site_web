var message = "";
$(document).ready(function () {
    $('.cat').select2({
        placeholder: "Choisissez une ou plusieurs catégories à mettre dans votre publication",
        width: '90vw',
        dropdownParent: $('#dropdown'),
        allowClear: true
    });
    message = $("#textEditor").tailWriter({
        // Width/height of the markdown editor
        "width":     "100%",
        // Customize toolbar
        "toolbar": ["bold", "italic", "headers", "|", "quote", "list:unordered", "list:ordered", "|", "link", "image", "|", "preview"],
        // Where to position the tooltbar
        "toolbar_pos":    "top",
        // Enable / disable the indent
        "indent_tab":   true,
        // True to use "======", False to use a single "#".
        "action_header1": true,
        // True to use "------", False to use "##".
        "action_header2": true,
        // Enable / disable the tooltips
        "tooltip_show":   true,
        // Enable / disable the status bar
        "statusbar": false,
    });
    callAPI('categories', selectCategorie);
    $('#createPubli').on("submit", createPubli);
});

function selectCategorie(response) {
    let select = '';
    if (response.responseJSON.status === "SUCCESS") {

        let categories = response.responseJSON.data;

        for(item in categories){
            select += "<option value=" + categories[item].id + ">";
            select += categories[item].categoryName + "</option>";
        }
    } else {
        select += "<option value=''>Aucunes catégories disponible</option>";
    }
    $('#selectCat').html(select);
}

function createPubli(evt) {
    evt.preventDefault();
    let cat = $('.cat').select2('data');
    let formData = new FormData();
    let categories = [];
    for(item in cat){
        categories.push(cat[item].id);
    }
    formData.append("postTitle", evt.target.titleEditor.value);
    formData.append("postText", evt.target.textEditor.value);
    formData.append("user_id", getCookie('user-id'));
    for (var i = 0; i < categories.length; i++) {
        formData.append('categories[]', categories[i]);
    }

    callAPIMethod("POST", formData, "posts", getErrorCreatePost);
}
function getErrorCreatePost(response){
    console.log(response);
    let message = JSON.parse(response.responseText);


    switch (message.status) {
        case "SUCCESS":
            console.log('success');
            window.location.href = "forumPage.html";
            break;
        case "ERROR":
            console.log('success');
            break;
    }
}