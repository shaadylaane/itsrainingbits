/*
 *
 * Dashboard "Go Magic" Command.
 *
 * Copyright (c) 2015 It's Raining Bits
 * Email: shaadylaane@gmail.com
 * Licensed under the MIT license
 */
 
 
Dashboard.GoMagic = (function ( ) {

    var button;
        
        
    /*
     * Init the event handler.
     */ 
    
    var init = function ( ) {   

        button = document.getElementById("magicfill");
        button.onclick = function () {
            MapManager.fill(); /* No Argument => Fill all lines! */
        };              

        setActive(false);       

    }   
    
        
        
    /*
     * Set Active status of the "GoMagic" button.
     * true: the "GoMagic" process is in progress
     * false: the "GoMagic" process is stopped (default)
     */
    
    var setActive = function ( active ) {
    
        if (!button)
            return;
        
        if ( active )
        {
            button.value = "Map In Progress...";
            button.className = "hvr-pulse";
            button.focus();
        
        } else {
            button.value = "GO MAGIC";
            button.className = "hvr-bounce-in";
            button.blur();
        }   
    }       
        
        
    return {
        init: init,
        setActive: setActive    
    };

})();
