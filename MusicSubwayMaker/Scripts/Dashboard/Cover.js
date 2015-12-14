/*
 *
 * Display Handler of the Dashboard "Cover".
 *
 * Copyright (c) 2015 It's Raining Bits
 * Email: shaadylaane@gmail.com
 * Licensed under the MIT license
 */
 
 
Dashboard.Cover = (function ( ) {
                
    
    var defCover = {}; /* "default cover": the cover which is by default shown
                        when the mouse is not pointing onto any specific artist */
    var curArtist = "";
    var coverLocked = false;     


    /*
	 *  Init the event handler
	 */ 
	 
	 var init = function () { 

        $("#coverlink").click( function (e) {
            Utils.openWindow( e.currentTarget.href );
            return false;
        } );
    
    }


    /*
	 * Remove the displayed cover und reset all internal vars.
	 */ 
	 
    var clear = function ( ) {
    
        defCover = {};
        curArtist = "";
        document.getElementById("cover").removeAttribute('src');
        document.getElementById("coverlink").removeAttribute('href');
    }



    /*
	 * Show the cover from its URL and store the link which is accessed
	 * (when clicking on the cover).
	 * If the flag isDefault is true, then this cover shall be considered
	 * as default!
	 */ 
	 
	 var show = function ( artist, coverURL, link, isDefault ) {
            
        if ( isDefault )
        {
            defCover.coverURL = coverURL;
            defCover.link = link;
            defCover.artist = artist;
        }
        
        /* Don't update if the current cover on display has been locked */
        if (coverLocked)
            return;
    
        if ( coverURL )
        {   
            document.getElementById("cover").src = coverURL;
            document.getElementById("coverlink").href = link;
            curArtist = artist;
        
        } else
        {
            clear();    
        }

    }
    
    
    
    /*
	 * Show the default cover.
	 */     
    
    var showDefault = function ( ) {
    
        if ( defCover )
            show( defCover.artist, defCover.coverURL, defCover.link, 0);
        else
            clear();
    }   

    

	/*
	 * Lock cover currently displayed: each show() call will be dismissed.
	 */      
    
    var lock = function ( station ) {
        coverLocked = true;
    }



    /*
	 *  Unlock cover currently displayed: each show() call will be processed.
	 */ 
	
	 var unlock = function ( station ) {
        coverLocked = false;
    }   


        
    /*
	 * Get the artist name of the cover currently shown.  
	 */ 
	 
	 var getArtist = function ( ) {
        return curArtist;
    }   


        
    return {
        init: init,
        clear: clear,
        show: show,
        showDefault: showDefault,
        lock: lock,
        unlock: unlock,
        getArtist: getArtist
    };

})();








