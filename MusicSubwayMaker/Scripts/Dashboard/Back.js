/*
 *
 * Dashboard "Back" Command.
 *
 * Copyright (c) 2015 It's Raining Bits
 * Email: shaadylaane@gmail.com
 * Licensed under the MIT license
 */
 
 
Dashboard.Back = (function ( ) {
            
    /*
     * Init the event handler.
     */
                    
    var init = function () { 
        $("#back").click( MLUndo.undo );    
    }

    return {
        init: init
    };

})();





