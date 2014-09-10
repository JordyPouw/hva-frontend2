/**
* CONTROLLER OBJECT
*   init: function()
*
*
* GPS OBJECT
*   init: function()
*   EventTarget: function()
*   startInterval: function(event)
*   updatePosition: function()
*   setPosition: function(position)
*   checkLocations: function(event)
*   calculateDistance: function(p1, p2)
*
*
* MAP OBJECT
*   generateMap: function(myOptions, canvasId)
*
*
* POSITION OBJECT
*   isNumber: function(n)
*   updatePositie: function(event)
*
*
* DEBUG OBJECT
*   geoErrorHandler: function(code, message)
*   debugMessage: function(message)
*   setCustomDebugging: function(debugId)
**/


/**
* cmdaan.js
*   Bevat functies voor CMDAan stijl geolocatie welke uitgelegd
*   zijn tijdens het techniek college in week 5.
*
*   Author: J.P. Sturkenboom <j.p.sturkenboom@hva.nl>
*   Credit: Dive into html5, geo.js, Nicholas C. Zakas
*
*   Copyleft 2012, all wrongs reversed.
**/

var CMDAanGeo = CMDAanGeo || {};

(function(){


    // Variable declaration
    var SANDBOX = "SANDBOX";
    var LINEAIR = "LINEAIR";
    var GPS_AVAILABLE = 'GPS_AVAILABLE';
    var GPS_UNAVAILABLE = 'GPS_UNAVAILABLE';
    var POSITION_UPDATED = 'POSITION_UPDATED';
    var REFRESH_RATE = 1000;
    var currentPosition = currentPositionMarker = customDebugging = debugId = map = interval =intervalCounter = updateMap = false;
    var locatieRij = markerRij = [];


    // $ controller object
    var CMDAanGeo.controller = {

        // Test of GPS beschikbaar is (via geo.js) en vuur een event af
        init: function(){
            gps.init();
        }

    };


    // $ gps object
    var CMDAanGeo.gps = {

        // Test of GPS beschikbaar is (via geo.js) en vuur een event af
        init: function(){
            debugMessage("Controleer of GPS beschikbaar is...");

            ET.addListener(GPS_AVAILABLE, startInterval);
            ET.addListener(GPS_UNAVAILABLE, function(){debugMessage('GPS is niet beschikbaar.')});

            (geo_position_js.init())?ET.fire(GPS_AVAILABLE):ET.fire(GPS_UNAVAILABLE);
        },

        // Event functies - bron: http://www.nczonline.net/blog/2010/03/09/custom-events-in-javascript/ Copyright (c) 2010 Nicholas C. Zakas. All rights reserved. MIT License
        // Gebruik: ET.addListener('foo', handleEvent); ET.fire('event_name'); ET.removeListener('foo', handleEvent);
        EventTarget: function(){
            this._listeners={};
        },

        EventTarget.prototype={constructor:EventTarget,addListener:function(a,c){"undefined"==typeof this._listeners[a]&&(this._listeners[a]=[]);this._listeners[a].push(c)},fire:function(a){"string"==typeof a&&(a={type:a});a.target||(a.target=this);if(!a.type)throw Error("Event object missing 'type' property.");if(this._listeners[a.type]instanceof Array)for(var c=this._listeners[a.type],b=0,d=c.length;b<d;b++)c[b].call(this,a)},removeListener:function(a,c){if(this._listeners[a]instanceof Array)for(var b=
        this._listeners[a],d=0,e=b.length;d<e;d++)if(b[d]===c){b.splice(d,1);break}}}; var ET = new EventTarget();    

        // Start een interval welke op basis van REFRESH_RATE de positie updated
        startInterval: function(event){
            debugMessage("GPS is beschikbaar, vraag positie.");
            updatePosition();
            interval = self.setInterval(updatePosition, REFRESH_RATE);
            ET.addListener(POSITION_UPDATED, checkLocations);
        },

        // Vraag de huidige positie aan geo.js, stel een callback in voor het resultaat
        updatePosition: function(){
            intervalCounter++;
            geo_position_js.getCurrentPosition(setPosition, geoErrorHandler, {enableHighAccuracy:true});
        },

        // Callback functie voor het instellen van de huidige positie, vuurt een event af
        setPosition: function(position){
            currentPosition = position;
            ET.fire("POSITION_UPDATED");
            debugMessage(intervalCounter+" positie lat:"+position.coords.latitude+" long:"+position.coords.longitude);
        },

        // Controleer de locaties en verwijs naar een andere pagina als we op een locatie zijn
        checkLocations: function(event){
            // Liefst buiten google maps om... maar helaas, ze hebben alle coole functies
            for (var i = 0; i < locaties.length; i++) {
                var locatie = {coords:{latitude: locaties[i][3],longitude: locaties[i][4]}};

                if(calculateDistance(locatie, currentPosition)<locaties[i][2]){

                    // Controle of we NU op die locatie zijn, zo niet gaan we naar de betreffende page
                    if(window.location!=locaties[i][1] && localStorage[locaties[i][0]]=="false"){
                        // Probeer local storage, als die bestaat incrementeer de locatie
                        try {
                            (localStorage[locaties[i][0]]=="false")?localStorage[locaties[i][0]]=1:localStorage[locaties[i][0]]++;
                        } catch(error) {
                            debugMessage("Localstorage kan niet aangesproken worden: "+error);
                        }

        // TODO: Animeer de betreffende marker

                        window.location = locaties[i][1];
                        debugMessage("Speler is binnen een straal van "+ locaties[i][2] +" meter van "+locaties[i][0]);
                    }
                }
            }
        },

        // Bereken het verchil in meters tussen twee punten
        calculateDistance: function(p1, p2){
            var pos1 = new google.maps.LatLng(p1.coords.latitude, p1.coords.longitude);
            var pos2 = new google.maps.LatLng(p2.coords.latitude, p2.coords.longitude);
            return Math.round(google.maps.geometry.spherical.computeDistanceBetween(pos1, pos2), 0);
        }

    };


    /**
     * $ google maps object
     *
     * generateMap(myOptions, canvasId)
     *  roept op basis van meegegeven opties de google maps API aan
     *  om een kaart te genereren en plaatst deze in het HTML element
     *  wat aangeduid wordt door het meegegeven id.
     *
     *  @param myOptions:object - een object met in te stellen opties
     *      voor de aanroep van de google maps API, kijk voor een over-
     *      zicht van mogelijke opties op http://
     *  @param canvasID:string - het id van het HTML element waar de
     *      kaart in ge-rendered moet worden, <div> of <canvas>
     **/
    var CMDAanGeo.googleMaps = { 

        generateMap: function(myOptions, canvasId){
        // TODO: Kan ik hier asynchroon nog de google maps api aanroepen? dit scheelt calls
            debugMessage("Genereer een Google Maps kaart en toon deze in #"+canvasId)
            map = new google.maps.Map(document.getElementById(canvasId), myOptions);

            var routeList = [];
            // Voeg de markers toe aan de map afhankelijk van het tourtype
            debugMessage("Locaties intekenen, tourtype is: "+tourType);
            for (var i = 0; i < locaties.length; i++) {

                // Met kudos aan Tomas Harkema, probeer local storage, als het bestaat, voeg de locaties toe
                try {
                    (localStorage.visited==undefined||isNumber(localStorage.visited))?localStorage[locaties[i][0]]=false:null;
                } catch (error) {
                    debugMessage("Localstorage kan niet aangesproken worden: "+error);
                }

                var markerLatLng = new google.maps.LatLng(locaties[i][3], locaties[i][4]);
                routeList.push(markerLatLng);

                markerRij[i] = {};
                for (var attr in locatieMarker) {
                    markerRij[i][attr] = locatieMarker[attr];
                }
                markerRij[i].scale = locaties[i][2]/3;

                var marker = new google.maps.Marker({
                    position: markerLatLng,
                    map: map,
                    icon: markerRij[i],
                    title: locaties[i][0]
                });
            }
        // TODO: Kleur aanpassen op het huidige punt van de tour
            if(tourType == LINEAIR){
                // Trek lijnen tussen de punten
                debugMessage("Route intekenen");
                var route = new google.maps.Polyline({
                    clickable: false,
                    map: map,
                    path: routeList,
                    strokeColor: 'Black',
                    strokeOpacity: .6,
                    strokeWeight: 3
                });

            }

            // Voeg de locatie van de persoon door
            currentPositionMarker = new google.maps.Marker({
                position: kaartOpties.center,
                map: map,
                icon: positieMarker,
                title: 'U bevindt zich hier'
            });

            // Zorg dat de kaart geupdated wordt als het POSITION_UPDATED event afgevuurd wordt
            ET.addListener(POSITION_UPDATED, updatePositie);
        }

    };


    // $ position object
    var CMDAanGeo.position = {

        isNumber: function(n) {
          return !isNaN(parseFloat(n)) && isFinite(n);
        },

        // Update de positie van de gebruiker op de kaart
        updatePositie: function(event){
            // use currentPosition to center the map
            var newPos = new google.maps.LatLng(currentPosition.coords.latitude, currentPosition.coords.longitude);
            map.setCenter(newPos);
            currentPositionMarker.setPosition(newPos);
        }

    };


    // $ debugging object
    var CMDAanGeo.debugging = {

        geoErrorHandler: function(code, message) {
            debugMessage('geo.js error '+code+': '+message);
        },

        debugMessage: function(message){
            (customDebugging && debugId)?document.getElementById(debugId).innerHTML:console.log(message);
        },

        setCustomDebugging: function(debugId){
            debugId = this.debugId;
            customDebugging = true;
        }

    };


})(); // end of self-invoking anonymous function.