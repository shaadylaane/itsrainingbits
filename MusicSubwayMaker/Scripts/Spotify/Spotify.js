/*
 *
 * Spotify Data Requester.
 *
 * Copyright (c) 2015 It's Raining Bits
 * Email: shaadylaane@gmail.com
 * Licensed under the MIT license
 */
 
 
var Spotify = (function ( ) {


    var config = {
        apiKey: "BDBD83XGRIXVTMYJB",
        spotifySpace: "spotify",
        echoNestHost: "http://developer.echonest.com/",
        spotifyHost: "https://api.spotify.com/"
    };
        
        
    var autoComplete = function( input, truncWidth ) {
    
        $("#"+ input.id ).autocomplete({
    
            source: function( request, response ) {

                $.ajax({
                    url: config.echoNestHost + "api/v4/artist/suggest",
                    dataType: "jsonp",
                    data: {
                        results: 30,
                        api_key: config.apiKey,
                        format:"jsonp",
                        name:request.term
                    },
                    success: function( data ) {                 
                        response( $.map( Utils.truncateArray(Utils.truncateEntries(data.response.artists, truncWidth), 12), function(item) {
                            return {
                                label: item.name,
                                value: item.name,
                                id: item.id
                            }
                        }));
                    }
                });
    
            },
            open: function() { $('#div .ui-menu').width(10);},  
            minLength: 3,
            select: function( event, ui ) {
                input.value = ui.item.value;
                input.blur(); 
            },
        }); 
    }
    
    
    var getSimilarArtists = function ( artist )
    {
        var rdata = null;
        var url = config.echoNestHost + 'api/v4/artist/similar';

        $.getJSON(url, { 
                'api_key': config.apiKey,
                'id' : artist.id,
                'bucket': [ 'id:' + config.spotifySpace], 
                'limit' : true,   
                'results': 50,   
              }) 
            .done(function(data) {
                if (data.response.status.code == 0 && data.response.artists.length > 0) {
                    rdata = data.response.artists;
                } 
            });
        
            return rdata;
    }


    var getImage = function( artist ) {

        var rdata = null;
        var url = config.spotifyHost + 'v1/artists/';

        $.getJSON(url, { 'ids': _fidToSpid(artist.foreign_ids[0].foreign_id) }) 
            .done(function(data) {
                rdata = data.artists[0];
            });
        
        return rdata;

    }


    var getImages = function( artists )
    {
        var rdata = null;
        var url = config.spotifyHost + 'v1/artists/';
    
        var fids = [];
        artists.forEach(function(artist) {
            fids.push(_fidToSpid(artist.foreign_ids[0].foreign_id));
        });

        $.getJSON(url, { 'ids': fids.join(',')}) 
            .done(function(data) {
                data.artists.forEach(function(sartist, which) {
                    artists[which].spotifyArtistInfo = sartist;
                });
                rdata = artists;
            });
    
        return rdata;
    }


    var getArtist = function( name ) {

        var rdata = null;
        var url = config.echoNestHost + 'api/v4/artist/search';

        $.getJSON(url, {
                'api_key': config.apiKey,
                'name' : name,
                'bucket': [ 'id:' + config.spotifySpace], 
                'limit' : true,
              }) 
            .done(function(data) {
                rdata = data;
            });
        
        return rdata;
    }



    var getArtistBio = function( name ) {

        var rdata = null;
        var url = config.echoNestHost + 'api/v4/artist/biographies';

        $.getJSON(url, {
                'api_key': config.apiKey,
                'name' : name,
              }) 
            .done(function(data) {
                rdata = data;
            });
        
        return rdata;        

    }     
    
    
    var getArtistPlaylist = function( artist ) {
    
        var rdata = null;                   
        var url = config.echoNestHost + 'api/v4/playlist/static';
        
        $.getJSON(url, { 'artist': artist, 
                'api_key': config.apiKey,
                'bucket': [ 'id:' + config.spotifySpace, 'tracks'], 
                'limit' : true,
                'variety' : 0, 'results': 20, 'type':'artist',  }) 
            .done(function(data) {
                rdata = data;
            });
            
        return rdata;
    }
    
    
    var getSongs = function( songs ) {
    
    
        var rdata = null;
        var url = config.spotifyHost + 'v1/tracks/';
    
        var tids = [];
        songs.forEach(function(song) {
            var tid = _fidToSpid(song.tracks[0].foreign_id);
            tids.push(tid);
        }); 
        
        $.getJSON( url, { 'ids': tids.join(',')}) 
            .done(function(data) {
                rdata = data;
            });

        return rdata;
    
    }


	/* Converts full URI to just the simple spotify id */
	var _fidToSpid = function ( fid ) {
	
		var fields = fid.split(':');
		return fields[fields.length - 1];
	
	}
    
    
        
    return {
        autoComplete: autoComplete,     
        getSimilarArtists: getSimilarArtists,
        getImage: getImage,
        getImages: getImages,
        getArtist: getArtist,
        getArtistBio: getArtistBio,
        getArtistPlaylist: getArtistPlaylist,
        getSongs: getSongs  
    };


})();
