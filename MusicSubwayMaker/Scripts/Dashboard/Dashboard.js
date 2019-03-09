/*
 *
 * Application Dashboard.
 *
 * Copyright (c) 2015 It's Raining Bits
 * Email: shaadylaane@gmail.com
 * Licensed under the MIT license
 */
 
 
Dashboard = (function ( ) {
        
        
    var init = function ( ) {
    
        Dashboard.Help.init( );     
        Dashboard.Back.init( );
        Dashboard.Clear.init( );
        Dashboard.Export.init( );
        Dashboard.GoMagic.init( );
        Dashboard.Cover.init( );            
    }
        
    return {
        init: init      
    };

})();
