/*
 *
 * Spotify Data Requester.
 *
 * Copyright (c) 2015 It's Raining Bits
 * Email: shaadylaane@gmail.com
 * Licensed under the MIT license
 */
 
 
var Spotify = (function () {

    var accessToken;

    var config = {
        apiKey: "BDBD83XGRIXVTMYJB",
        spotifySpace: "spotify",
        //echoNestHost: "http://developer.echonest.com/",
        spotifyHost: "https://api.spotify.com/"
    };
       
	   
    var authorize = function ( ) {   

        // Get the hash of the url
        const hash = window.location.hash
        .substring(1)
        .split('&')
        .reduce(function (initial, item) {
          if (item) {
            var parts = item.split('=');
            initial[parts[0]] = decodeURIComponent(parts[1]);
          }
          return initial;
        }, {});
        window.location.hash = '';

        // Set token
        //let _token = hash.access_token;
        accessToken = hash.access_token;

        const authEndpoint = 'https://accounts.spotify.com/authorize';

        // Replace with your app's client ID, redirect URI and desired scopes
        const clientId = 'b725456746e745e9a891df162bdb7741';
        const redirectUri = 'http://localhost:8000/';


        const scopes = [
          'user-top-read'
        ];

        // If there is no token, redirect to Spotify authorization
        if (!accessToken) {
          window.location = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&response_type=token&show_dialog=true`;
        }
    }

    
    
    var autoComplete = function(input, truncWidth) {
    
        $("#"+ input.id ).autocomplete({
    
            source: function( request, response ) {

			    $.ajax({
					type: "GET",
					url: config.spotifyHost + "v1/search",
					dataType: "json",
					data: {
						type: "artist",
						limit: 30,
						contentType: "application/json; charset=utf-8",
						format: "json",
						q: request.term
					},
                    success: function( data ) {                 
                        response( $.map( Utils.truncateArray(Utils.truncateEntries(data.artists.items, truncWidth), 12), function(item) {
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
        var url = config.spotifyHost + 'v1/artists/' + artist.id +'/related-artists';

        $.getJSON(url) 
            .done(function(data) {
                    rdata = data;
            });
        
            return rdata;
    }


    var getArtist = function( name ) {

        var rdata = null;
        
        $.ajax({
           url: config.spotifyHost + 'v1/search?q='+ encodeURIComponent(name.trim()) +'&type=artist',
           type: "GET",
           beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);},
           success: function(data) { 
             rdata = data;
           }
        });
        
        return rdata;
    }

    
	//Biography not supported by Spotify API, what a real pity...
/*     var getArtistBio = function( name ) {

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

    }    */  
    
    var getArtistPlaylist = function( artist ) {
    
        var rdata = null;
        var art = getArtist(artist);        
        var url = config.spotifyHost + 'v1/artists/' + art.artists.items[0].id + '/top-tracks';
        
        $.getJSON(url, { 
                'country': 'SE',
                }) 
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
            var tid = _fidToSpid(song.id);
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
        authorize: authorize,
        autoComplete: autoComplete,     
        getSimilarArtists: getSimilarArtists,
        getArtist: getArtist,
        //getArtistBio: getArtistBio,
        getArtistPlaylist: getArtistPlaylist,
        getSongs: getSongs  
    };


})();
