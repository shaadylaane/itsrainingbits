/*
 *
 * Dashboard "Export" Command.
 *
 * Copyright (c) 2015 It's Raining Bits
 * Email: shaadylaane@gmail.com
 * Licensed under the MIT license
 */
 
 
Dashboard.Export = (function ( ) {
            
    /*
     * Init the event handler.
     */    
    
    var init = function () { 
        $("#export").click( _export );  
    }
    
    
    /*
     * Underlying export function.
     */
     
    var _export = function ( )
    {       
        $( "#subwaypane" ).css( "border-style", "none" );
        html2canvas($("#subwaypane"), {
            onrendered: function(canvas) {
                canvas.toBlob(function(blob) {
                    saveAs(blob, "YourSubway.png" ); 
                });     
                $( "#subwaypane" ).css( "border-style", "groove" );
            }
        });
    }   
    
    return {
        init: init          
    };

})();








