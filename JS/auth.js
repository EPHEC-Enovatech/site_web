/**
 * Authentifie l'utilisateur
 * @param evt le sender de l'event
 */
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
        let payload = parseJWT(json.jwt);
        setCookie('user-id', payload.sub, 1);
        setCookie('token', json.jwt, 1);
        window.location = "userPage.html"
    }).catch(error => {
        console.error(error);
        $('#subError').removeClass().addClass("error").html("Impossible de vous connecter, vérifier vos identifiants").show();
    })
}

/**
 * Mets en place un cookie
 * @param name le nom
 * @param value la valeur
 * @param exp_day la date d'expiration
 */
function setCookie(name, value, exp_day) {
    let exp = new Date();
    exp.setTime(exp.getTime() + (exp_day*24*60*60*1000));
    document.cookie = name + "=" + value + "; expires=" + exp.toUTCString() + ";"
}

/**
 * Se logger
 * @param evt le sender de l'event
 */
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
        if (json.status === "SUCCESS") {
            toggleRegisterLogIn("logIn");
            $('#subError').removeClass().addClass("success").html(json.message).show();
        } else {
            let msgError = "Impossible de terminer <wbr>l'inscription :<br />";
            for(let item in json.data){
                switch (item) {
                    case "password_confirmation":
                        msgError += '- Le mot de passe doit être identique dans les 2 champs<br />';
                        break;
                    case "password":
                        msgError += "- Le mot de passe ne doit pas être vide<br />";
                        break;
                    case "prenom":
                        msgError += "- Le prénom ne doit pas être vide<br />";
                        break;
                    case "nom":
                        msgError += "- Le nom ne doit pas être vide<br />";
                        break;
                    case "email":
                        if(json.data[item][0] === "has already been taken"){
                            msgError += "- Cette adresse mail existe déjà (<a href='#' onclick=toggleRegisterLogIn('logIn')>Se connecter</a>)<br />"
                        } else {
                            msgError += "- Le mail ne doit pas être vide<br />";
                        }
                        break;
                    default:
                        msgError += "- Vérifier les champs<br />"
                }
            }
            $('#subError').removeClass().addClass("error").html(msgError).show();
        }
    })
}

/**
 * Récupérer un cookie
 * @param name le nom du cookie
 * @returns {string} la valeur du cookie
 */
function getCookie(name) {
    let cname = name + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(cname) === 0) {
            return c.substring(cname.length, c.length);
        }
    }
    return "";
}

/**
 * Supprime un cookie
 * @param name le nom du cookie à supprimer
 */
function deleteCookie(name) {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT;"

}

/**
 * Parse le token JSON
 * @param token le token à parser
 * @returns {any} le token parser
 */
function parseJWT(token) {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64))
}

/**
 * Permet d'appeler l'API en GET
 * @param arg la fin l'endpoint
 * @param func la function à executer à la fin de la requète (pour traitement, premier argument = donnée reçues)
 */
function callAPI(arg, func){
    setLoading(1);
    $.ajax({
        url: "https://api.sensorygarden.be/" + arg,
        type: "GET",
        beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + getCookie('token'));},
        complete: func
    });
}

/**
 * Permet d'appeler l'API en POST, PATCH, DELETE
 * @param method POST, PATCH, DELETE
 * @param data les données a envoyer
 * @param endpoint l'endpoint
 * @param func la function à executer à la fin de la requète (pour traitement, premier argument = donnée reçues)
 */
function callAPIMethod(method, data, endpoint, func){
    setLoading(1);
    var settings = {
        "beforeSend": function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + getCookie('token'));},
        "async": true,
        "crossDomain": true,
        "url": "https://api.sensorygarden.be/" + endpoint,
        "method": method,
        "headers": {},
        "processData": false,
        "contentType": false,
        "mimeType": "multipart/form-data",
        "data": data,
        "complete": func
    };

    $.ajax(settings).done(function (response) {
        console.log(response);
    });
}

/**
 * Récupère les infos passé dans l'URL
 * @param sParam le paramètre à récupérer
 * @returns {*} la valeur
 */
function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
}