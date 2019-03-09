/*
 *
 * User Log Routines (in form of popups only).
 *
 * Copyright (c) 2015 It's Raining Bits
 * Email: shaadylaane@gmail.com
 * Licensed under the MIT license
 */
 
 
Log = (function ( ) {
                
        
        /*
     	 * Init the event handler.
         */
               
        var init = function ( ) {
        
            $(".aw_close").click( function(){
                var aw_active = $(this).parents(".aw_active");
                $(this).animatedAlert("closeAlert", aw_active);
            });
        }   
    


        /*
         * Animated popup of error messages.
         */  

        var popupError = function( text ) {
        
            $('.material_alert').css( "color", "white" );
            $('.material_alert').css( "font-size", "2vw" );
            $('.material_alert').css( "font-size", "2vh" ); 
            $('.material_alert').css( "text-align", "center" );
            $('.material_alert').css( "border-style", "none" );
            $('.material_alert_success').css( "background-color", "#68c368" );
    
            _popupText( text );
        }   
        
        

        /*
         * Animated popup of large texts.
         */
         
        var popupLargeText = function ( text, size ) {

            $('.material_alert').css( "color", "black" );
            $('.material_alert').css( "font-size", size + "vw" );
            $('.material_alert').css( "font-size", size + "vh" );   
            $('.material_alert').css( "text-align", "left" );
            $('.material_alert').css( "border-style", "solid" );
            $('.material_alert_success').css( "background-color", "white" );

            _popupText( text );
        
        }
        
        
        /*
         * Underlying animated text popup function.
         */  
         
        var _popupText = function ( text ) {

            $('#aw_popup_text').html(text);

            $(this).animatedAlert({
                containerAlert: $("#aw_popup_alert"),
                axisX: "center",
                coordinateX: 0,
                coordinateY: 0,
                axisY: "middle"
            });

        }
    
            

    return {
        init: init,
        popupError: popupError,
        popupLargeText: popupLargeText
    };

})();
