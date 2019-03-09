/*
 *
 * Dashboard "Clear" Command.
 *
 * Copyright (c) 2015 It's Raining Bits
 * Email: shaadylaane@gmail.com
 * Licensed under the MIT license
 */
 
 
Dashboard.Clear = (function ( ) {
        
        
    /*
     * Init the event handler.
     */ 
                    
    var init = function ()
    {
        $("#clear").click( function () { MapManager.clear( ); } );
    }

    return {
        init: init
    };

})();

