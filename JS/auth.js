
function authenticate(evt) {
    evt.preventDefault();
    let form = $("#formConnexion")[0];
    let data = { "auth": { "email": form.subMail.value, "password": form.password.value }};

    fetch("https://api.sensorygarden.be/user_token", {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(response => {
        return response.json()
    }).then(json => {
        let payload = parseJWT(json.jwt)
        setCookie('user-id', payload.sub, 1)
        setCookie('token', json.jwt, 1)
        window.location = "userPage.html"
    }).catch(error => {
        console.error(error)
    })
}

function setCookie(name, value, exp_day) {
    let exp = new Date()
    exp.setTime(exp.getTime() + (exp_day*24*60*60*1000))
    document.cookie = name + "=" + value + "; expires=" + exp.toUTCString() + ";"
}

function signin(evt) {
    evt.preventDefault();
    let data = {
        nom: evt.target.subName.value,
        prenom: evt.target.subSurname.value,
        email: evt.target.subMail.value,
        password: evt.target.password.value,
        password_confirmation: evt.target.confirmPassword.value
    };
    fetch('https://api.sensorygarden.be/users/', {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(json => {
        if (json.status == "SUCCESS") {

        } else {
            
        }
    })
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

function parseJWT(token) {
    let base64Url = token.split('.')[1]
    let base64 = base64Url.replace('-', '+').replace('_', '/')
    return JSON.parse(window.atob(base64))
}