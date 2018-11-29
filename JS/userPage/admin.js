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
    callBack(box);
}

function updateLinkDownload(numBox){
    $('#downloadQR').on("click", function(e){
        e.preventDefault();
        let imageURL = ($('#qrcode img').attr("src")).replace(/^data:image\/[^;]+/, 'data:application/octet-stream');
        window.location.href = imageURL;
    });
    //window.open(url);
    //$('#downloadQR').attr("href", imageURL).attr("download", "QRCode-" + numBox);
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
            buildQRCode("qrcode", numBox, numCheck, updateLinkDownload);
        });

    });
});