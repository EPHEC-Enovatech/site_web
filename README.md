# SensoryGarden.be

[![buddy pipeline](https://app.buddy.works/ephec-enovatech/site-web/pipelines/pipeline/161227/badge.svg?token=07bac36d2470476e066030080d5e22080748ee20f3f2debadb48ac6876f96863 "buddy pipeline")](https://app.buddy.works/ephec-enovatech/site-web/pipelines/pipeline/161227)


# Procédure de changement de version de cache 

Quand vous effectuez une modification significative dans la web app et que vous souhaitez que l'utilisateur en soit informer et que la cache soit renouvelée. Vous devez "bump" la version du cache dans le fichier `/sw.js` 

Exemple :
```javascript
var cache = "sensory-static-v3";
var userCache = 'sensory-static-userdata-v3';
var dataCache = "sensory-static-records-v3";
```
vers 
```javascript
var cache = "sensory-static-v4";
var userCache = 'sensory-static-userdata-v4';
var dataCache = "sensory-static-records-v4";
```
