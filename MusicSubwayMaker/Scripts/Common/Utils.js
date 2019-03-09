/*
 *
 * Diverse Utils.
 *
 * Copyright (c) 2015 It's Raining Bits
 * Email: shaadylaane@gmail.com
 * Licensed under the MIT license
 */
 
 
var Utils = (function ( ) {


    return {


        openWindow: function( link ) {
            var err = 0;
            var winName = "myWin";
            var myWin = this.myWin || null;
            var oldURL = this.oldURL || "";

            if (link.length > 0)
            {   
                if (oldURL == link && this.myWin != null && !this.myWin.closed )
                {
                    this.myWin.focus();
                    return this.myWin;
                }   
    
                this.oldURL = link;
        
                var params = [
                        'height='+screen.height,
                        'width='+screen.width,
                        'fullscreen=yes' // only works in IE, but here for completeness
                    ].join(',');
                
                this.myWin = window.open(link, winName, params);        
                    
            } else
                err = 1;
    
            return err;
        },


        truncateEntries: function ( array, maxLenEntry ) {
    
            for( var idx = 0; idx < array.length; idx++ )
            {
                if ( Utils.getWidthOfText(array[idx].name) >  maxLenEntry )
                {
                    array.splice(idx, 1);
                    idx--;
                }
            }
    
            return array;
        },


        truncateArray: function ( array, maxLenArray ) {
            if ( maxLenArray < 0 ) return null;
    
            var len = array.length;
            if (len > maxLenArray)
                    array.splice(maxLenArray, len-maxLenArray);
    
            return array;
        },


        getWidthOfText: function ( txt ) {
    
            var canvas = this.canvas || (this.canvas = document.createElement("canvas"));
            var context = canvas.getContext("2d");
            context.font = 'bold 12pt arial';
            var metrics = context.measureText(txt);
            var w = metrics.width;
            var w_norm = w * 22.5/250; 
            return w_norm; 
        },



        getAbsPosition: function (element) {
    
            var xPosition = 0;
            var yPosition = 0;

            while(element) {
                xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
                yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
                element = element.offsetParent;
            }
            return { x: xPosition, y: yPosition };
        },


        isCharacterKeyPress: function ( evt ) {
    
            if (typeof evt.which == "undefined") {
                // This is IE, which only fires keypress events for printable keys
                return true;
            } else if (typeof evt.which == "number" && evt.which > 0) {
                // In other browsers except old versions of WebKit, evt.which is
                // only greater than zero if the keypress is a printable key.
                // We need to filter out backspace and ctrl/alt/meta key combinations
                return !evt.ctrlKey && !evt.metaKey && !evt.altKey && evt.which != 8;
            }
            return false;
        },


                

    };


})();   
