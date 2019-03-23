/*
 *
 * Map Loader.
 *
 * Copyright (c) 2015 It's Raining Bits
 * Email: shaadylaane@gmail.com
 * Licensed under the MIT license
 */
 
 
var MapLoader = (function ( ) {

    var MAX_STATIONS_PER_LINE = 20;


    /*
     * Load the list of stations and the list of lines from the table of stations 'stationTable'. 
     */
     
    var load = function ( stationTable, initTable ) {
    
    	if ( !stationTable )
	    	return;
    
        var listStations = _loadListStations( stationTable );
        var listLines = _loadListLines( listStations );

        /* Restore old session from the cookies.
        If the page is loaded for the first time (no cookies),
        then fill the map with the init stations */
        if ( _restoreStations( listStations ) <= 1 && initTable )            /// To uncomment when using cookies!!!
            _loadInitStations( listStations, initTable );
        
        return {
            listStations: listStations,
            listLines: listLines
        };
        
    }



    /*
     * Load the list of stations from the table of stations.
     */
    
    var _loadListStations = function ( tabStations )
    {

      var listStations = new Array();

      for (var i = 0; i < tabStations.length; i++ )
        listStations.push( new MapStation( tabStations[i] ) );
    
      return listStations;
  
    }



    /*
     * Line constructor, invoked in the building of lines
     */
     
    var Line = function ( lineName )
    {
        this.name = lineName;
        this.stationIdxArray = new Array(MAX_STATIONS_PER_LINE);
        for( var idx = 0; idx < this.stationIdxArray.length; idx++ ) this.stationIdxArray[idx] = -1;
        this.nbSingles = 0;
    }



    /*
     * Load the list of lines from the built list of stations.
     */
     
    var _loadListLines = function ( listStations )
    {
    
        var listLines = new Array();
    
        /* Browse all map stations */
        for ( var statIdx = 0; statIdx < listStations.length; statIdx++ )
        {   
            /* For each station, browse its crossing lines */
            var lineArray = listStations[statIdx].lineArray;
            for( var crossLine = 0; crossLine < lineArray.length; crossLine++ )
            {
                /* Check if station's cross line already exists. If not, add it */
                var bExists = false;
                for ( var line = 0; line < listLines.length; line++)
                {                   
                    if (listLines[line].name == lineArray[crossLine].name)
                    {
                      bExists = true;
                      /* Set the index of the line station in the list of all stations */
                      listLines[line].stationIdxArray[lineArray[crossLine].idx-1] = statIdx;

                      if (lineArray.length == 1) listLines[line].nbSingles++;                 
                      break;
                    }
                }
                if (!bExists)
                {
                    /* New line found. Create it and add it to the list of lines */
                    listLines.push( new Line(lineArray[crossLine].name));
                    listLines[line].stationIdxArray[lineArray[crossLine].idx-1] = statIdx;

                    if (lineArray.length == 1) listLines[line].nbSingles++;
                }                                     
            }                       
        }
    
        /* Before returning the list of lines, sort the list
        from the least to the most interconnected line.
        In that way, each time the map is filled automatically,
        the more interconnected a line is, the later it is filled.
        Hence, lines which are less interconnected gain a higher visibility
        in the auto-generated map.
        */
        listLines.sort( function ( a, b ) {
            if(a.nbSingles < b.nbSingles)
                return -1;
            else if( a.nbSingles > b.nbSingles )
                return 1;
            return 0;
        });
    
        return listLines;

    }



    /* 
     * Restore into the map all station related content from the previous session,
     * and which is stored in the cookies.
     */ 
     
    var _restoreStations = function ( listStations ) {
        
        var cookiearray = document.cookie.split(';');
        var nbEntries = 0;

        /* Browse each cookie entry */
        for( var cookIdx = 0; cookIdx <cookiearray.length-1; cookIdx++)
        {
            /* Parse the cookie entry */
            var id = cookiearray[cookIdx].split('=')[0].trim();
            var value = cookiearray[cookIdx].split('=')[1].trim();
            var artist = value.split(',')[0];
            var coverURL = value.split(',')[1];
            var link = value.split(',')[2];
                        
            /* Retrieve the station object and set the restore the old content into it */
            for ( var statIdx = 0; statIdx < listStations.length; statIdx++ )
            {
                if ( listStations[statIdx].id == id )
                {
                    listStations[statIdx].fill( artist, coverURL, link, 0 );
                    nbEntries++;
                    break;
                }
            }
        }   
        
        return nbEntries;
    }



    /*
     * Load the init stations.
     */

    var _loadInitStations = function ( listStations, table ) {
            
        for ( var i = 0; i < table.length; i++ )
        {
            var idx = table[i].stationIdx;
            if ( idx < listStations.length )
            {
                listStations[idx].input.value = table[i].artist;
                listStations[idx].input.validateText(table[i].focus);
            }
        }   
    
    }
                
    return {
        MAX_STATIONS_PER_LINE: MAX_STATIONS_PER_LINE,
        load: load
    };      
        

})();   
        
        
        
        
        
        
        
        
        
        
        
        