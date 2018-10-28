
function authenticate(evt) {
    evt.preventDefault();
    let form = $("#formConnexion")[0];
    let data = { "auth": { "email": form.subMail.value, "password": form.password.value }};

    fetch("https://api.sensorygarden.be/user_token", {
        method: 'POST',
        mode: 'cors',
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify(data)
    }).then(response => {
        return response.json()
    }).then(json => {
        let exp = new Date()
        exp.setTime(exp.getTime() + 24*60*60*1000)
        document.cookie = "token="+ json.jwt + ";expires="+ exp.toUTCString() +";"
    }).catch(error => {
        console.error(error)
    })
}

function setCookie(name, value, exp_day) {
    let exp = new Date()
    exp.setTime(exp.getTime() + (exp_day*24*60*60*1000))
    document.cookie = name + "=" + value + "; expires=" + exp.toUTCString() + ";"
}

function getCookie(name) {
    let cname = name + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(cname) == 0) {
            return c.substring(cname.length, c.length);
        }
    }
    return "";
}

function deleteCookie(name) {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT;"
}