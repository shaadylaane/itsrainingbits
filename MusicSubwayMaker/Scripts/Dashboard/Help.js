/*
 *
 * Dashboard "Help".
 *
 * Copyright (c) 2015 It's Raining Bits
 * Email: shaadylaane@gmail.com
 * Licensed under the MIT license
 */
 
 
Dashboard.Help = (function ( ) {
            
    /*
     * Init the event handler.
     */    
    
    var init = function () { 
        $("#helptxt").click( _showHelp );  
    }
    
    
    /*
     * Help Popup.
     */
     
    var _showHelp = function ( ) {
           
        var txt = "You've always wanted to have your fave artists printed on a subway map?<br><br>\
                   Write one artist on each line of the map and press <b>Go Magic</b> to have the rest magically filled, under the motto:<br><br>\
                   <b>Proximity rhymes with Similarity!</b><br><br>\
                   Right-Click on an artist station to preview its songs,\
                   listen to them in full length if you are a Spotify member,...<br><br>\
                   When you are done, export the map and let it print on every possible kind of products (t-shirt, sticker, cup of coffee, duvet cover, etc) on a marketplace like <a href=\"https://www.redbubble.com/about/selling\">Redbubble</a> and show off like the king of fashion!";
        Log.popupLargeText( txt, "2" );        
    }   
    
    return {
        init: init          
    };

})();








