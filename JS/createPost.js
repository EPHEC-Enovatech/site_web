var message = "";
$(document).ready(function () {
    $('.cat').select2({
        placeholder: "Choisissez une ou plusieurs catégories à mettre dans votre publication",
        width: '50vw',
        dropdownParent: $('#dropdown'),
        allowClear: true
    });
    message = new SimpleMDE({
        autofocus: true,
        element: $("#textEditor")[0],
        placeholder: "Décrivez ce que vous avez à dire, soyez le plus précis possible...",
        status: false,
        toolbar: ["bold", "italic", "heading", "|", "quote", "unordered-list", "ordered-list", "|", "link", "image", "|", "preview", "guide"],
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
    formData.append("postText", message.value());
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