function calculateCheckCode(param) {
    var result = 0;
    for(var i = 0; i < param.length; i++) {
        result = result + param.charCodeAt(i)*(i+1);
    }
    return result%97;
}

function buildQRCode(idDiv, box, check, callBack) {
    $('#' + idDiv).html("");
    new QRCode(idDiv, {
        text: "https://sensorygarden.be/userPage.html?box=" + box + "&check=" + check,
        width: 128,
        height: 128,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });
    $('#QRBox').show();
}

function updateLinkDownload(){
    let imageURL = $('#qrcode img').attr("src");
    $('#downloadQR').attr("href", imageURL).attr("download", "QRCode");
    return true;
}

function fillSimpleSelect(idSelect, type, errorId, data){
    setLoading();
    let select = $('#' + idSelect);
    select.html("");

    if(data.responseJSON.status === "SUCCESS"){
        let allData = data.responseJSON.data;
        let fillSelect = "";
        allData.forEach(function(myData){
            fillSelect += "<option value=" + myData.id + ">" + myData[type + "Name"] +  " (id : " + myData.id + ")" +"</option>";
        });
        select.html(fillSelect);
    } else {
        $('#' + errorId).text("Erreur : impossible de charger les données.");
        select.html("<option value='error'>Erreur</option>");
    }
}


function deleteAdmin(idElem, endpoint, idError, idSelect){
    let data = new FormData();
    callAPIMethod("DELETE", data, endpoint + idElem, function(data){
        let retour = JSON.parse(data.responseText);
        if(retour.status === "SUCCESS"){
            $('#' + idError).removeClass().addClass("success").text(retour.message).show();
            $("#" + idSelect + " option:selected").remove();
        } else {
            $('#' + idError).removeClass().addClass("error").text(retour.message).show();
        }
    });
}

$(function(){
    $('#adminCreateCheck').on("submit", function(e){
        e.preventDefault();
        let numBox = $('#newBox').val();

        let data = new FormData();
        data.append("device_id", numBox);
        callAPIMethod("POST", data, "/checksum", function(e){
            let numCheck = (JSON.parse(e.responseText)).data;
            $('#newCheck').val(numCheck);
            buildQRCode("qrcode", numBox, numCheck);
        });
    });

    callAPI("users", function(data){
        setLoading();
        let selectUsers = $('#allUsersSelect');

        if(data.responseJSON.status === "SUCCESS"){
            let users = data.responseJSON.data;
            let simpleUsers = users.filter(user => user.admin === false);
            let fillSelect = "";
            simpleUsers.forEach(function(user){
                fillSelect += "<option value=" + user.id + ">" + user.prenom + " " + user.nom + " (id : " + user.id + ")" +"</option>";
            });
            selectUsers.html(fillSelect);
        } else {
            $('#errorPromote').text("Erreur : impossible de charger les utilisateurs.");
            selectUsers.html("<option value='error'>Erreur</option>");
        }
    });

    callAPI("categories", function(data){
        fillSimpleSelect("selectDelCateg", "category", "errordelCateg", data);
    });

    callAPI("sensors", function(data){
        fillSimpleSelect("selectDelCaptor", "sensor", "errorDelCaptor", data);
    });

    $('#promoteForm').on("submit", function(evt){
        evt.preventDefault();
        let idUser = evt.target.allUsersSelect.value;
        let dataAPI = new FormData();
        dataAPI.append("user_id", idUser);
        callAPIMethod("POST", dataAPI, "promote/", function(data){
            let retour = JSON.parse(data.responseText);
            if(retour.status === "SUCCESS"){
                $("#allUsersSelect option:selected").remove();
                $('#errorPromote').removeClass().addClass("success").text(retour.message).show();

            } else {
                $('#errorPromote').removeClass().addClass("error").text(retour.message).show();
            }
        });
    });

    $('#addCateg').on("submit", function (evt) {
        evt.preventDefault();
        let data = new FormData();
        data.append("categoryName", evt.target.categ.value);
        callAPIMethod("POST", data, "categories", function(data){
            let retour = JSON.parse(data.responseText);
            if(retour.status === "SUCCESS"){
                $('#addCateg').trigger("reset");
                $('#errorCateg').removeClass().addClass("success").text(retour.message).show();
                callAPI("categories", function(data){
                    fillSimpleSelect("selectDelCateg", "category", "errordelCateg", data);
                });
            } else {
                $('#errorCateg').removeClass().addClass("error").text(retour.message).show();
            }
        });
    });

    $('#addCaptor').on("submit", function (evt) {
        evt.preventDefault();
        let data = new FormData();
        data.append("sensorName", evt.target.captor.value);
        data.append("sensorUnit", evt.target.unite.value);
        callAPIMethod("POST", data, "sensors", function(data){
            let retour = JSON.parse(data.responseText);
            if(retour.status === "SUCCESS"){
                $('#addCaptor').trigger("reset");
                $('#errorCaptor').removeClass().addClass("success").text(retour.message).show();
                callAPI("sensors", function(data){
                    fillSimpleSelect("selectDelCaptor", "sensor", "errorDelCaptor", data);
                });
            } else {
                $('#errorCaptor').removeClass().addClass("error").text(retour.message).show();
            }
        });
    });

    $('#delCateg').on("submit", function (evt) {
        evt.preventDefault();
        deleteAdmin(evt.target.selectDelCateg.value, "categories/", "errorDelCateg", "selectDelCateg");
    });

    $('#delCaptor').on("submit", function (evt) {
        evt.preventDefault();
        deleteAdmin(evt.target.selectDelCaptor.value, "sensors/", "errorDelCaptor", "selectDelCaptor");
    });
});