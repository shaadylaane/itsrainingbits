/*
 *
 * Map Manager.
 *
 * Copyright (c) 2015 It's Raining Bits
 * Email: shaadylaane@gmail.com
 * Licensed under the MIT license
 */
 
 
var MapManager = (function ( ) {


    var listStations = [];
    var listLines = [];

        
    /*
     *  Init the Map Manager.
     */
        
    var init = function ( stationTable, initTable ) {
    
        /* Load the map: the lists of stations and lines are built. */
        var loader = MapLoader.load( stationTable, initTable );
        listStations = loader.listStations;
        listLines = loader.listLines;
        
        /* Init the map resize handling */
        _initResizing();

    }

        
        
    /*
     * Clear the map i.e. remove all stations.
     */
     
    var clear = function ( ) {
    
        for ( var i = 0; i < listStations.length; i++ )
            listStations[i].clear( );
    
        Dashboard.Cover.clear();
        Dashboard.Player.remove();

    }



    /*
     * Clear a line i.e. remove all stations from the line.
     * The line in question is the line on which the station passed in argument
     * is located. If the station is on several lines, then all these lines are cleared.
     */

    var clearThisLine = function ( station ) {
        
        if ( station == null ) return;
                
        for( var s = 0; s < listStations.length; s++ )
        {
            var bFound = false;
    
            for( var crossLine = 0; crossLine < listStations[s].lineArray.length; crossLine++ )
            {
                for ( var i = 0; i < station.lineArray.length; i++ )
                {
                    if ( station.lineArray[i].name == listStations[s].lineArray[crossLine].name )
                    {
                        bFound = true;
                        break;
                    }
                }
            
                if (bFound)
                {
                    listStations[s].clear( );
                    break;
                }
            }               
        }
        
    }



    /*
     * Fill a line i.e. fill all stations on the line.
     * The line in question is the line on which the station passed in argument
     * The line in question is the line on which the station passed in argument
     */ 

    var fillThisLine = function ( station ) {
        
        if ( station == null ) return;
        
        /* Build an array of lines passing by the station */
        var lineArray = [];
        for( var crossLine = 0; crossLine < station.lineArray.length; crossLine++ )
        {
            for( var line = 0; line < listLines.length; line++ )
            {
                if ( station.lineArray[crossLine].name == listLines[line].name )
                {
                    lineArray.push( listLines[line] );              
                    break;
                }
            }
        }               
    
        /* Fill all lines listed in linArray */
        _fillLines ( lineArray );   
    
    }



    /*
     * Fill the complete map i.e fill all lines.
     */ 

    var fill = function ( ) {
    
        /* listLines contains ALL lines of the map */           
        _fillLines ( listLines );   
    
    }



    /*
     * Init the resize handling of the map.
     */ 

    var _initResizing = function ( ) {
    
        /* Init the resize handler of all station map areas upon window resize */
        $('img[usemap]').rwdImageMaps();

        var _resize = function ( ) {
            var imageMap = document.getElementById("subwayim") ;
            for ( var i = 0; i < listStations.length; i++)
                listStations[i].input.resize( imageMap );
        };
		
        /* Init the resize handler of all text inputs upon window resize */
        window.onresize = _resize;
        
        /* Resize once now! */
        _resize();
        
    }   



    /*
     * Fill all lines stored in the list of lines 'lineArray'.
     */
     
    var _fillLines = function ( lineArray ) {
    
        /* Check if all lines have at least one element...*/
        if( !_checkLinesContent( lineArray ) )
            return;

        //for test
        //ctrcol = 0;

        /* Backup input values before starting the magic fill */
        for ( var i = 0; i < listStations.length; i++ )
            listStations[i].inittxt = listStations[i].input.value;
    
    
        /* Let's go magic dude! */
        
        Dashboard.GoMagic.setActive( true );
    
        /* Fill each line, one by one */
        for ( var i = 0; i < lineArray.length; i++ )
            _fillLine( lineArray[i] );
    
        Dashboard.GoMagic.setActive( false );
    

    }



    /*
     * Check if each line has at least one filled station. If not, popup an error message.  
     */ 

    var _checkLinesContent = function ( lineArray ) {
    
        var bFound;
        var emptylines = [];
    
        for ( var i = 0; i < lineArray.length; i++ )
        {
                bFound = false;
                for ( var j = 0; j < lineArray[i].stationIdxArray.length && lineArray[i].stationIdxArray[j] != -1; j++ )
                {
                    var stat = listStations[lineArray[i].stationIdxArray[j]];
                    if ( stat.input.value != "" )
                    {
                        bFound =  true;
                        break;                  
                    }               
                }
            
                if ( !bFound )
                    emptylines.push( lineArray[i].name );
        }
    
        if ( emptylines.length > 0 )
        {
            var linetxt = emptylines.length > 1 ? " each of the " : "the ";
            for ( var i = 0; i < emptylines.length; i++ )
            {
                linetxt += emptylines[i];
                if ( emptylines.length > 2 && i < emptylines.length - 2 )
                    linetxt += ", ";
                else if ( emptylines.length > 1 && i < emptylines.length - 1 )
                    linetxt += " and ";     
            }        
            linetxt += emptylines.length > 1 ? " lines" : " line";
            Log.popupError( "Please write at least one artist on " + linetxt + "!" );
        
        
            return false;
    
        }
    
        return true;
        
    }



    /*
     * Fill a line.
     */

    var _fillLine = function ( line ) {

        var lineSegmentDescs = new Array();
    
        /* Loop through each station of the line, until the end of the line is reached */   

        for ( var currIdx = 0;
            line.stationIdxArray[currIdx] != -1 && currIdx < MapLoader.MAX_STATIONS_PER_LINE;
            currIdx++ )
        {
            var currName = listStations[line.stationIdxArray[currIdx]].inittxt;
            if ( currName != "" )
            {
                /* Current station is NOT empty, explore neighborhood on the line
                 until other artists are found or one extremity of the line is reached!
                 The goal is to identify the largest empty segment of the line which
                 comprises the current station. So basically the largest interval like 
                 [ s1, ..., current, ..., s2] where all stations are empty (except the
                 current station) and contiguous */

                /* Explore upwards along the line, starting from the current station */
                var uCtr = upIdx = currIdx;
                while (true)
                {
                    uCtr--;

                    if ( uCtr < 0 ) {
                        upIdx = 0; break; }
                    else if ( listStations[line.stationIdxArray[uCtr]].inittxt != "" ) {
                        upIdx = Math.round( currIdx - (currIdx-uCtr-1)/2 ); break; }
                }

                /* Explore downwards along the line, starting from the current station */
                var dCtr = downIdx = currIdx;
                while (true)
                {
                    dCtr++;

                    if ( dCtr >= MapLoader.MAX_STATIONS_PER_LINE || line.stationIdxArray[dCtr] == -1 ) {
                        downIdx = dCtr-1; break; }
                    else if ( listStations[line.stationIdxArray[dCtr]].inittxt != "" ) {
                        downIdx = Math.round( currIdx + (dCtr-currIdx-1)/2) ; break; }
                }

                /* The boundaries of the line segment we want to create have been
                identify, register them! */
                if ( downIdx > currIdx || upIdx < currIdx )
                    lineSegmentDescs.push( new LineSegmentDesc( currIdx, upIdx, downIdx ) );
            
            }
      
        }

        /* All empty line segments have been collected, now fill them all, one by one */
        for (var i = 0; i < lineSegmentDescs.length; i++ )  
            _fillLineSegment( line, lineSegmentDescs[i] );

    }



    /*
     * LineSegmentDesc constructor
     */
    
    function LineSegmentDesc( seedIdx, firstIdx, lastIdx )
    {
        /* All indexes below are absolute station indexes, namely the indexes
        of the stations in the list 'listStations' */

        this.seedIdx = seedIdx; /* index of the "seed" station
                                (non-empty station from which to propagate) in the line segment */
        this.firstIdx = firstIdx; /* index of the first station of the segment */
        this.lastIdx = lastIdx; /* index of the last station of the segment */
    }



    /*
     * Fill the line segment characterized by 'lineSegmentDesc'. 
     * 'line' is the line from which the line segment is originated.
     */
    var _fillLineSegment = function ( line, lineSegmentDesc ) {
        
        /* Time to call Spotify to fill the line segment with similar artists to the
        one at existing the "seed" station */   
        var artist = listStations[line.stationIdxArray[lineSegmentDesc.seedIdx]].inittxt;
        console.log('searching for', artist);
        var ardata = Spotify.getArtist(artist);
        if (ardata && ardata.artists.items.length > 0)
        {
            /* The seed artist has been recognized by spotify. Get some images */
            var sdata = Spotify.getSimilarArtists( ardata.artists.items[0] );
			if( sdata )
            {
				/* Dispatch the similar artists through the line segment,
				namely to all empty stations connex to the seed */
			
				/* But can we really take the first similar artist and store it
				to the next connex station found, without first considering if
				it fits in size into the station text box? Nope...
				Better first create an array of all those stations connex
				to the seed station, sorted by increasing text input box size */
				var sortArray = _createSzSortArray( line, lineSegmentDesc );

				//ctrcol++;

				/* Fill each connex station, from the smallest to the biggest box.
				For each station, the first similar artist found which fits into
				the text input box will be selected */					
				for ( var i = 0; i < sortArray.length; i++ )    
					_fillStationWithBestCandidate( line, sortArray[i], sdata.artists );               
                        
            }                                    
        } else {
            info("Can't find that artist");
        }

    }



    /*
     * _SzSortStation constructor .
     */
    
    var _SzSortStation = function ( lineIdx, startIdx, inputSize ) {
    
        this.lineIdx = lineIdx; /* index of the station on the line */
        this.startIdx = startIdx; /* index of the element of similar artists from which the
                                    search of the first size-fitting similar artist
                                    shall start from */
        this.inputSize = inputSize; /* size of the station input box */
    }



    /*
     * Create an array of all connex stations, where those are sorted according to the
     * size of their input text boxes, from the smallest to the largest.
     */
     
    var _createSzSortArray = function ( line, lineSegmentDesc ) {
    
        /* Array to build and return */
        var array=[];
        
        var ctr = 0;  /* Counter through the list of empty stations to be
                        filled around the seed */
        var uCtr = lineSegmentDesc.seedIdx-1;
        var dCtr = lineSegmentDesc.seedIdx+1;       
        var stationIdx;
        
        
        /* Go through all empty stations in the neighborhood of the seed station */

        while ( ctr < lineSegmentDesc.lastIdx - lineSegmentDesc.firstIdx)
        {           
            /* Add the next station found upwards */        
            if ( uCtr >= lineSegmentDesc.firstIdx )
            {           
                stationIdx = line.stationIdxArray[uCtr];            
                array.push(new _SzSortStation( uCtr, ctr, listStations[stationIdx].input.widthprct));               
                uCtr--; ctr++;
            }

            /* Add the next station found downwards */      
            if ( dCtr <= lineSegmentDesc.lastIdx )
            {
                stationIdx = line.stationIdxArray[dCtr];
                array.push(new _SzSortStation( dCtr, ctr, listStations[stationIdx].input.widthprct));               
                dCtr++; ctr++;
            }
        }

        /* Finally sort the array !*/
        array.sort( function ( a, b ) { 
            if(a.inputSize < b.inputSize) return -1;
            else if( a.inputSize > b.inputSize ) return 1;  
            return 0;
        });
            
        return array;

    }



    /*
     * Fill a station with the best candidate (similar artist), among a list of candidates.
     * The best candidate is the first candidate whose size fits to the station text input box.
     */

    var _fillStationWithBestCandidate = function ( line, station, candidates ) {
    
        var ctrSim = 0; /* Counter through the list of similar artists (candidates) */
        var uCtr = station.startIdx;
        var dCtr = station.startIdx+1;
    
        /* Find the closest similar artist to the startIdx-th artist in the list of similar artists */
        while ( ctrSim < candidates.length )
        {       
            /* fill the next similar artist found upwards */                
            if ( uCtr >= 0  )
            {
                if( Utils.getWidthOfText(candidates[uCtr].name) <=  station.inputSize
                && !_alreadyExistsInMap( candidates[uCtr].name ) )
                {           
                    /* The artist fits in the box and is not in the map already, so add it */
                    if( _fillStation( listStations[line.stationIdxArray[station.lineIdx]], candidates[uCtr] ))
                        break;                  
                }
                uCtr--; ctrSim++;                       
            }
        
            /* fill the next similar artist found downwards */              
            if ( dCtr < candidates.length )
            {
                if( Utils.getWidthOfText(candidates[dCtr].name) <=  station.inputSize
                && !_alreadyExistsInMap( candidates[dCtr].name ) )
                {           
                    /* The artist fits in the box and is not in the map already, so add it */               
                    if( _fillStation( listStations[line.stationIdxArray[station.lineIdx]], candidates[dCtr] ))
                        break;              
                }
                dCtr++; ctrSim++;           
            }       
        }   
    }



    /*
     * Fill station with data from a similar artist.
     */

    var _fillStation = function ( station, similar ) {

        if ( station.input.value.length == 0 )
        {
            station.coverURL = similar.images[0].url;
            station.link = similar.href;
    
            station.fill( similar.name, station.coverURL, station.link, 0 /* don't show cover */  );

            return 1;
        }

        return 0;
    }



    /*
     * Return if a name is already existing throughout the map or not.
     */
        
    function _alreadyExistsInMap( name ) {
    
        for (var i = 0; i < listStations.length; i++ )
        {
            if (listStations[i].input.value  == name )
                return true;
        }
        return false;
    }



    return {
        init:init,
        clear: clear,
        clearThisLine: clearThisLine,
        fill: fill,
        fillThisLine: fillThisLine,
    };


})();   
        
        
        
        

