/*
 *
 * Map Station.
 *
 * Copyright (c) 2015 It's Raining Bits
 * Email: shaadylaane@gmail.com
 * Licensed under the MIT license
 */
 


/*
 * MapStation Constructor.
 */

function MapStation ( tabStation )
{
    var station = this;
    
    /* Unique object ID */
    station.id = '';
    for (var i = 0; i < tabStation.lineArray.length; i++)
        station.id += '_' + tabStation.lineArray[i].name + '_' + tabStation.lineArray[i].idx;

    /* Array of lines crossing the station */
    station.lineArray = tabStation.lineArray;
    
    /*Type of hub*/
    station.hubType = tabStation.hubType;
    
    /* Text input element associated to the station */
    station.input = station.createInput( tabStation.txtpos, tabStation.txtalign, tabStation.width );

    /* Map area element (round station node on the map) associated to the station */
    station.area = station.createArea( tabStation.pos, station.input );
    
    /* station related data to restore upon undo cmd (buffer),
    and restore function, invoked upon undo cmd (restore) */
    station.undo =  { 
        
        buffer: [ station.input.value, station.coverURL, station.link ],        
        restore: function ( buffer ) {                  
                    station.input.value = buffer[0];
                    station.coverURL = buffer[1];
                    station.link = buffer[2];       
                }
    
    };
                

}



/*
 * Create the station's (text) input.
 */

MapStation.prototype.createInput = function ( txtpos, txtalign, width )
{
    /* station element the input to create belongs to */
    var station = this;

    /* Create input element and add it to the DOM */
    var input =  document.createElement("input");
    document.getElementById("subwaypane").appendChild(input);
    

    /* When leaving the input... */ 
    input.onblur = function ( ) {

        this.validateText(1);   
    };


    /* When the mouse goes over the input... */
    input.onmouseover = function( ) {
    
        station.showCover( );
    
    };


    /* When the mouse leaves the input... */
    input.onmouseout = function( ) { 
    
        Dashboard.Cover.showDefault( );
    
    };


    /* When a key has been pressed while editing in the input... */
    input.onkeypress = function( e ) { 
    
        var code = (e.keyCode ? e.keyCode : e.which);
        if (code == 13)       
            this.blur();      
        else if (!Utils.isCharacterKeyPress(e))
            return true;
        else
            return ( Utils.getWidthOfText( this.value ) <=  this.widthprct );
    
    };


    /* When the mouse has been clicked in the input text area... */
    input.onclick = function( e ) {
    
        switch ( e.which ) {
            case 1: //left click
                $( "#"+ this.id ).css( "box-shadow", "1px 1px 2px #888888" );
                break;
            case 3: //right click
                break;
        }   
    };

    /* Resize/position the input based on the size/position of the map image element 'imageMap' */
    input.resize = function( imageMap ) {
    
        var panepos = Utils.getAbsPosition( imageMap.parentElement );
        var impos = Utils.getAbsPosition( imageMap );

        this.style.left = impos.x-panepos.x + input.leftprct * 0.01 * imageMap.width + "px";
        this.style.top = impos.y-panepos.y  + input.topprct * 0.01 * imageMap.height + "px";

        this.style.width = input.widthprct * 0.01 * imageMap.width + "px";
        this.style.height = input.heightprct * 0.01 * imageMap.height + "px";   

        this.style.fontSize = input.fontsizeprct * 0.01 * imageMap.height + "px";   
    
    };
    
    /* focus the input */
    input.foc = function ( ) {

        this.readOnly = false;
        $("#"+ this.id ).css( "box-shadow", "1px 1px 2px #888888" );
        this.focus();
    };
    
    /* Validate the text entered in the input */
    input.validateText = function ( focus ) {
    
        $( "#"+ this.id ).css( "box-shadow", "none" );
    
        var artist = this.value.trim(), name;
        if ( artist != "" )
        {
            /* Search artist for auto-correction and cover load*/
            var data = Spotify.getArtist( artist );
            if( data )
            {                   
                if (data.artists.items.length > 0)
                {
                    name = data.artists.items[0].name;
					station.fill( name, data.artists.items[0].images[0].url, data.artists.items[0].external_urls.spotify, focus );
					if( focus )
						station.setupPlayer( false /*don't play immediately...*/); 
             
                } else
                    station.fill( artist, null, null, focus );          
            }       
        
        } else
        {
            station.clear( );
        }
    }

    /* Init some custom settings */
    input.leftprct = txtpos[0];
    input.topprct = txtpos[1];
    input.widthprct =  width;
    input.heightprct = 2;
    input.fontsizeprct = 1.5;
    input.inittxt = input.value = "";
    
    /* Set ID, type, class and style */
    input.id = "input_" + station.id; 
    input.type = "text";
    input.className = "stationinput"; 
    $( "#"+ input.id ).css( "text-align", txtalign );
    
    if(this.hubType == 'Minor')
    {
        $( "#"+ input.id ).css( "font-weight", "bold" );
        input.heightprct *= 1.1;        
        input.fontsizeprct *= 1.1;        
    } else if(this.hubType == 'Major')
    {
        $( "#"+ input.id ).css( "font-weight", "bold" );
        input.heightprct *= 1.3;        
        input.fontsizeprct *= 1.3;  
    }
        
    /* Resize the input to the map */
    input.resize( document.getElementById("subwayim") );
    
    /* Init of the station auto complete feature */
    Spotify.autoComplete( input, input.widthprct );

    return input;
}



/*
 * Create the station's map area (materialized on the map by the station node).
 */
 
MapStation.prototype.createArea = function ( pos, input ) {

    //positionMask(pos[0] , pos[1] );
    
    /* Station element the area to create belongs to */
    var station = this;
    
    /* Create area element */
    var map = document.getElementsByName("map");
    var area = document.createElement("area");

    /* Set ID, shape, coords */
    area.id = "area_" + station.id; 
    area.shape = "circle";
    area.coords= pos[0] + "," + pos[1] + "," + pos[2];
    
    /* Add the area element to the DOM */
    map[0].appendChild(area);   

    /* Create the area context menu */
    CM_addEvent( window, 'load', function( ) { area.createCtxMenu( ) } );   
    
    /* When the mouse has been clicked on the area element... */    
    area.onclick = function( ) {
        area.focus( );
        station.input.foc( );
    };
    
    /* When the mouse goes over the area element... */
    area.onmouseover = function( ) {
        station.showCover( );
    };
    
    /* When the mouse leaves the area element... */ 
    area.onmouseout = function( ) {
        Dashboard.Cover.showDefault( );
    };
      
      
    area.createCtxMenu = function ( )  {
                
        var stationCtxMenu = new ContextMenu();
        if ( stationCtxMenu )
        {
            stationCtxMenu.addItem("fill",   "Fill This Line", function() { MapManager.fillThisLine( station ); } );
            stationCtxMenu.addItem("clear",   "Clear This Line", function() { MapManager.clearThisLine( station ); } );
            //stationCtxMenu.addItem("info",    "Get Artist Biography", function() { station.showArtistBio(); });
            stationCtxMenu.addItem("quickplay",    "Quick Play!", function() { station.quickPlay( ); });
            stationCtxMenu.addItem("spotifyplay",    "Play In Spotify", function() { station.playInSpotify(); });

            stationCtxMenu.onShow = function() { Dashboard.Cover.lock() };
            stationCtxMenu.onHide = function() { Dashboard.Cover.unlock() };

            stationCtxMenu.register( area.id );
        }
    }
      
          
      
    return area;

}
 
 
 
/*
 *  Show the station's artist cover.
 */     

MapStation.prototype.showCover = function ( ) {

    if ( this.coverURL )
        Dashboard.Cover.show( this.input.value, this.coverURL, this.link, false );
}


 
/*
 *  Show the station's artist cover as default.
 */     

MapStation.prototype.showCoverAsDefault = function ( ) {

    Dashboard.Cover.show( this.input.value, this.coverURL, this.link, true );
}



/*
 *  Clear the station artist cover (if displayed )
 */ 
 
MapStation.prototype.clearCover = function ( ) {

    if( Dashboard.Cover.getArtist( ) == this.input.value )
        Dashboard.Cover.clear( );
}



/*
 *  Clear the station.
 */     

MapStation.prototype.clear = function ( ) {

    MLUndo.push( this );
    
    this.clearCover( );
    this.removePlayer( );
        
    /* clear! */
    this.input.value = this.coverURL = this.link = "";  

    this.save( );
}



/*
 *  Fill the station, with a name, the cover URL and link to the artist.
 *  Optionally, you can set the cover as default
 *  cover. 
 */   
 
MapStation.prototype.fill = function ( name, coverURL, link, showCover ) {
    
    if ( Utils.getWidthOfText(name) <  this.input.widthprct  )      
    {       
        MLUndo.push( this );
        
        /* fill! */
        this.input.value = name;
        this.coverURL = coverURL;   
        this.link = link;       
    
        if ( showCover )
            this.showCoverAsDefault( );
        
        this.save( );
        
    }
}



/*
 *  Save the station content in a cookie.
 */     

MapStation.prototype.save = function ( ) {

    document.cookie = this.id + "=" + this.input.value + "," + this.coverURL + "," + this.link +";";
}



/*
 *  Popup the station's artist biography.
 */     
/*
MapStation.prototype.showArtistBio = function ( )  {

    var bioTxt = "";
    var err = 0;
    
    if ( this.input.value )
    {
        var data = Spotify.getArtistBio( this.input.value );
        if(data && data.response.status.code == 0)
        {
            var text = "";
            var list = data.response.biographies;
            for (var i = 0; i < list.length; i++ )
            {
                if ( !list[i].truncated )
                {
                    var limit = 3000;

                    if ( list[i].text.length > limit )                      
                    {
                        var c = limit;
                        while ( c != 0 && list[i].text[c] != ' ') c--;
                        text = list[i].text.substring(0,c) + "...";
                    } else
                        text = list[i].text;

                    
                    if (list[i].url && list[i].site )
                        text += "More on " + list[i].site.link(list[i].url);
                                            
                    break;
                    
                }
            }

            if ( text.length > 0 )
            {
                Log.popupLargeText( text, "1.4" );
                biofound = 1; 
            } else
                err = 1;
        } 
        else
            err = 1;            
    }
    else
        err = 1;
    
    if ( err )
        Log.popupError("No Biography found :(");    

}
*/


/*
 *  Play the station's artist in Spotify (in a new window).
 */     

MapStation.prototype.playInSpotify = function ( ) {

    if ( this.link ? Utils.openWindow( this.link ) : 1 )
        Log.popupError("Could not be played in Spotify :(");                
}



/*
 *  Quick-Play the station's artist in the player.
 */     

MapStation.prototype.quickPlay = function( ) {

    if ( this.input.value ? this.setupPlayer( true /*Play immediately!*/) : 1)
        Log.popupError("Quick Play could not be started :(");   
}



/*
 *  Prepare player with the station's artist.
 *  If 'play' is true, a song is started immediately, otherwise not.
 */     

MapStation.prototype.setupPlayer = function ( play ) {

    var err = Dashboard.Player.launch(this.input.value, this.link, play );
    if ( play && !err )
    {
        /* playing! show cover */
        this.showCoverAsDefault( );
    }
    
    return err;
}



/*
 *  Remove the player. Also, playing is immediately interrupted.
 */
   
MapStation.prototype.removePlayer = function ( ) {

    if ( Dashboard.Player.getArtist( ) == this.input.value )
        Dashboard.Player.remove( );
    
}