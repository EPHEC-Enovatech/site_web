var categories = "";
$(document).ready(function() {
    var select2 = $('#filterCat').select2({
        placeholder: "Choisissez une ou plusieurs catégories à filtrer",

        width: '100%',
        allowClear: !0,
        dropdownParent: $('#dropdown')
    }).on('change', function(e) {
        callAPI("posts", listPublication)
    });
    callAPI("categories", selectCategorie);
    callAPI("posts", listPublication);
    moment.locale("fr");
    $('#mobile_menu_button_side').on("click", function() {
        window.location = "index.html";
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
    if (getCookie("token")=="") {
        $(".logout").hide();
        $('a[href="graph.html"]').hide();
        $('a[href="userPage.html"]').attr("href", "index.html").html("Accueil");
        $('#goToCreatePost').on("click", function (e) {
            e.preventDefault();
            $('#validationPopUp').show();
        });
    }
    $('#validationButton').on('click', function(e) {
        e.preventDefault();
        $('#validationPopUp').hide()
    }).on("blur", function(e) {
        e.preventDefault();
        $('#validationPopUp').hide()
    });
});
function setLoading(n) {

}

function selectCategorie(response) {
    let select = '';
    if (response.responseJSON.status === "SUCCESS") {
        categories = response.responseJSON.data;
        for (item in categories) {
            select += "<option value=" + categories[item].id + ">";
            select += categories[item].categoryName + "</option>"
        }
    } else {
        select += "<option value=''>Aucunes catégories disponible</option>"
    }
    $('#filterCat').html(select)
}

function listPublication(response) {
    let list = '';
    if (response.responseJSON.status === "SUCCESS") {
        let publication = response.responseJSON.data;
        let select = $('#filterCat').select2('data');
        let filter = [];
        if (select.length != 0) {
            for (let k in select) {
                filter.push(parseInt(select[k].id))
            }
            publication = publication.filter(function(x) {
                return x.categories.filter(function(y) {
                    return filter.includes(y.id)
                }).length
            })
        }
        for (item in publication) {
            let arrCategories = publication[item].categories;
            list += "<li id='" + publication[item].id + "'><div class=\"object\"><h3>" + publication[item].postTitle + "</h3></div><div class=\"auteur\"> <h3 class=\"name\"><bdi>" + publication[item].user.prenom + "</bdi></h3>";
            list += "<img src=\"IMG/avatar.png\" alt=\"avatar image\" class=\"avatar\"></div>";
            list += "<div class=\"publication\">";
            list += "<p class=\"message\">" + publication[item].postText.substring(0, 200) + "...</p>";
            list += "<select aria-label='Liste des catégories' class=\"cat catPubli\" name=\"states[]\" multiple=\"multiple\" disabled>";
            for (cat in categories) {
                for (i in arrCategories) {
                    if (arrCategories[i].id == categories[cat].id) {
                        list += "<option value=\"" + categories[cat].id + "\" selected>" + categories[cat].categoryName + "</option>"
                    }
                }
            }
            list += "</select>";
            let date = moment(new Date(publication[item].postDate)).format("LLL");
            list += "<p class=\"date\">" + date + "</p>";
            list += "</div></li>"
        }
    } else {
        list += "<li>Il n'y a pas de publication disponible pour l'instant</li>"
    }
    if (list == '') list += "<li>Il n'y a pas de publication disponible pour l'instant</li>";
    $('.listPubli').html(list);
    $(function() {
        $("div.holder").jPages({
            containerID: "paginationList",
            perPage: 3,
            minHeight: false,
            previous: "◄",
            next: "►",
        })
    });
    $('.catPubli').select2({
        width: '49vw',
    });
    $('.listPubli > li').on('click', function() {
        window.location.href = "showPost.html?post_id=" + $(this).attr('id')
    }).css("display", "grid");
}

function toggleSlideMenu() {
    if (window.innerWidth <= 600) {
        $('#menuUser').show().css("max-height", "100vh").css("height", "100vh");
        $('#sideNav').css("height", window.innerHeight).css("max-height", window.innerHeight);
        $('.menu-link').show().bigSlide({
            menu: '#menuUser',
            easyClose: !0,
        })
    } else {
        $('#sideNav').css("height", "auto");
        $('#menuUser').css("position", "initial").css("left", 0).css("width", "auto").css("height", "auto");
        $('.menu-link').hide();
        calculateSizeMain()
    }
}

function calculateSizeMain() {
    let tailleHeader = parseFloat((($('#document_Header').css('height')).split("px"))[0]);
    $('#document_Main').css('height', "calc(100vh - " + tailleHeader + "px)");
    $('#menuUser').css('max-height', "calc(100vh - " + tailleHeader + "px)");
    $('#contentZone').css('max-height', "calc(100vh - " + tailleHeader + "px)");
    $('#sideNav').css('max-height', "calc(100vh - " + tailleHeader + "px)")
}