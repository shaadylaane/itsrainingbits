/*
 *
 * JS Application Entry Point.
 *
 * Copyright (c) 2015 It's Raining Bits
 * Email: shaadylaane@gmail.com
 * Licensed under the MIT license
 */
 
 
$(document).ready(function() {

    
    /* Set ajax the global settings */ 
    $.ajaxSetup({
        async: false /* all calls shall be synchronous */
    });
    jQuery.ajaxSettings.traditional = true; 
            
    /* Init Log module */
    Log.init();

    Spotify.authorize();

    /* Init Dashboard */
    Dashboard.init();
            
    /* Finally init the map from the table of stations defined in StationTables.js */
    MapManager.init( stationTable, initTable ); 


});            