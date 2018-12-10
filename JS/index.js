jQuery.easing.jswing=jQuery.easing.swing;jQuery.extend(jQuery.easing,{easeInOutCubic:function(x,t,b,c,d){if((t/=d/2)<1)return c/2*t*t*t+b;return c/2*((t-=2)*t*t+2)+b},});let register=document.getElementById('connexion');function copyHeightNavBar(){let taille=$('#menu_left').css('height');$('#startPageHeader').css('height',taille);$('#presentation, #gridBox').css("min-height","calc(100vh - "+taille+")");return taille}
function goToByScroll(id){Waypoint.disableAll();let size_bar=$('#menu_left').css('height');let size_bar_split=size_bar.split("px");$('html,body').animate({scrollTop:$("#"+id).offset().top-size_bar_split[0]},'slow','easeInOutCubic',function(){Waypoint.enableAll()})}
function change($div){if($div===-1&&window.innerWidth>=600){$('#document_Header').css("animation-name","changeColorToWhite")}else if($div===-2&&window.innerWidth>=600){$('#document_Header').css("animation-name","changeColorToTransparent")}else{$('#menu ul li a').removeClass('current');$('.target-div'+$div).addClass('current')}}
function deleteCurrent(){$('#menu ul li a').each(function(){$(this).removeClass("current")})}
let scrollWaypoint=[];function createWaypointScroll(id,directionScroll,offsetScroll,changeCall){let waypoint=new Waypoint({element:document.getElementById(id),handler:function(direction){if(direction===directionScroll){change(changeCall)}},offset:offsetScroll});scrollWaypoint.push(waypoint)}
function initMap(){let ephec={lat:50.665859,lng:4.61213900000007};let map=new google.maps.Map(document.getElementById('map'),{zoom:17,center:ephec,scrollwheel:!1});new google.maps.Marker({position:ephec,map:map,title:"Haute École EPHEC"})}
let connexionOpen=!1;function connexionPopUp(){let connexion=$('#connexion');if(connexionOpen)connexion.show();$('#subError').hide();connexion.fadeToggle();let page=$('#document_Header, #document_Main, #document_Footer');if(connexionOpen){page.css('filter','none');$('html, body').removeClass('disableScroll');connexionOpen=!1}else{page.css('filter','blur(3px)');$('html, body').addClass('disableScroll');connexionOpen=!0;trapFocus(register)}}
function toggleRegisterLogIn(mode){$('#subError').hide();if(mode==="logIn"){$('#subName, #subSurname, #confirmPassword').prop('required',!1).hide();$('#legalDiv').hide();$('#forgotMDP').show();$('#register').html("Pas encore inscrit ? <a href='#' onclick=toggleRegisterLogIn('register')>S'inscrire</a>");$('#buttonRegister').attr("value","Se connecter");$('#formConnexion header h2').text("Connexion");$('#formConnexion').off('submit').submit(authenticate);trapFocus(register)}else if(mode==="register"){$('#subName, #subSurname, #confirmPassword').prop('required',!0).show();$('#legalDiv').show();$('#forgotMDP').hide();$('#register').html("Déjà inscrit ? <a href='#' onclick=toggleRegisterLogIn('logIn')>Se connecter</a>");$('#buttonRegister').attr("value","S'inscrire");$('#formConnexion header h2').text("Inscription");$('#formConnexion').off('submit').submit(signin);trapFocus(register)}}
function sendMailContact(evt){evt.preventDefault();$('#formContact').trigger("reset");let formData=new FormData();formData.append("nom",evt.target.formName.value);formData.append("email",evt.target.mail.value);formData.append("message",evt.target.message.value);if(evt.target.mail2.value===""){callAPIMethod("POST",formData,"contact",function(data){let response=JSON.parse(data.responseText);if(response.status==="SUCCESS"){$('#errorContactForm').text("Le mail a bien été envoyé !").addClass("success").show()}else{$('#errorContactForm').text("Impossible d'envoyer le mail").addClass("error").show()}})}}
function MDPoublie(response){let data=JSON.parse(response.responseText);if(data.status==="ERROR"){$('#subErrorMDPoublie').removeClass().addClass("error").html(data.message).show()}else{$('#subErrorMDPoublie').removeClass().addClass("success").html(data.message).show();$('#submitMDPoublie').hide();$('#resetMDPoublie').val("Retour")}}
function trapFocus(element,namespace){var focusableEls=element.querySelectorAll('a[href], button, textarea, input[type="text"], input[type="email"], input[type="submit"], input[type="reset"]'),firstFocusableEl=focusableEls[0];lastFocusableEl=focusableEls[focusableEls.length-1];KEYCODE_TAB=9;firstFocusableEl.focus();element.addEventListener('keydown',function(e){var isTabPressed=(e.key==='Tab'||e.keyCode===KEYCODE_TAB);if(!isTabPressed){return}
    if(e.shiftKey){if(document.activeElement===firstFocusableEl){lastFocusableEl.focus();e.preventDefault()}}else{if(document.activeElement===lastFocusableEl){firstFocusableEl.focus();e.preventDefault()}}})}
$(function(){copyHeightNavBar();$('#document_Header').css("background-color",'rgba(255, 255, 255, 0.7)');if(getCookie("token")!==""){$('.target-div5').prop("onclick",null).attr("href","userPage.html").text("Mon profil").off("click")}else{$('.target-div5').attr("href","#connexion").text("Connexion").on("click",function(){connexionPopUp();toggleRegisterLogIn('logIn')})}
    $('#errorContactForm').hide();$('#formContact').on("submit",sendMailContact);$("#menu ul li a:not(.target-div5)").on("click",function(e){e.preventDefault();deleteCurrent();$(this).addClass("current");if(window.innerWidth<=600){$('#menu').toggle()}});$('#intro a, #formConnexion #register a').on("click",function(e){e.preventDefault()});$('#mobile_menu_button').on("click",function(){$('#menu').slideToggle()});$('#menu ul li .target-div5').on("click",function(){if(window.innerWidth<=600){$('#menu').hide()}});$('#document_Main, #document_Footer').on("click",function(){if(window.innerWidth<=600){if($('#menu:visible')){$('#menu').hide()}}});if(getCookie("cookies_enabled")===""){$('#dialCookies button').on("click",function(){$('#dialCookies').hide();setCookie("cookies_enabled","Les cookies ont été accepté",30)});$('#dialCookies').show()}
    $('#closeConnexion').on("click",function(){$('#formConnexion').trigger("reset")});$('#formMDPoublie').on("submit",function(evt){evt.preventDefault();let mail=evt.target.email.value;let formData=new FormData();formData.append("email",mail);let endPoint="reset/";callAPIMethod("POST",formData,endPoint,MDPoublie)}).on("reset",function(){$('#MDPoublie').hide();$('#connexion').show()});$('#subErrorMDPoublie').hide();$('#forgotMDP').on("click",function(){$('#MDPoublie').show();trapFocus(formMDPoublie);$('#connexion').hide()});if((window.navigator.userAgent.indexOf("MSIE "))>0||!!navigator.userAgent.match(/Trident.*rv\:11\./)){$("mobile_menu_button").css('top','1em')}
    createWaypointScroll('presentation','up','-20%',2);createWaypointScroll('presentation','down','20%',2);createWaypointScroll('intro','up','-20%',1);createWaypointScroll('intro','down','20%',1);createWaypointScroll('team','up','-20%',3);createWaypointScroll('team','down','20%',3);createWaypointScroll('contact','up','-20%',4);createWaypointScroll('contact','down','20%',4);createWaypointScroll('presentation','up','96%',-2);createWaypointScroll('presentation','down','96%',-1);copyHeightNavBar();$(window).on("resize",function(){if(window.innerWidth>600){$('#menu').show();$('#contact #contactTitle').text("Une question ou suggestion ? Envoyer nous une lettre !")}else{$('#menu').hide();$('#contact #contactTitle').text("Une question ou suggestion ? Contactez nous !")}
        copyHeightNavBar()});$('#document_Main, #document_Footer, #document_Header #headers_menu #menu li a:not(.target-div5)').on("click",function(){if(connexionOpen){$('#MDPoublie').hide();connexionPopUp()}});$('#mail2').hide();$('#register a').on("click",function(e){e.preventDefault()});$('#menu ul li a:not(.target-div1), #intro a').on("click",function(){$('#document_Header').css("animation-name","changeColorToWhite")});$('.target-div1').on("click",function(){$('#document_Header').css("animation-name","changeColorToTransparent")});$('#laterCache').on("click",function(){$('#dialWebApp').hide()});var egg=new Egg("c,o,o,k,i,e,s",function(){console.log("COOKIES !");$('#logo').attr("src","IMG/icon/cookies.svg").css("background-color","transparent");$('#logo_title').text("COOKIES HUB");$('#intro h1').html('CookiesHub, le cookie trop Cool')}).listen();$('#subError').hide();$("#formConnexion").submit(authenticate)})