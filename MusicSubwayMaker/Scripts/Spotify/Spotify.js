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
    var spotifyHost= "https://api.spotify.com/";
	   
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
        
        return (accessToken != null);
    }
    
    
    var setRequestHeader = function(xhr) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
    }
    
    
    var autoComplete = function(input, truncWidth) {
    
        $("#"+ input.id ).autocomplete({
    
            source: function( request, response ) {

			    $.ajax({
					type: "GET",
					url: spotifyHost + "v1/search",
					dataType: "json",
					data: {
						type: "artist",
						limit: 30,
						contentType: "application/json; charset=utf-8",
						format: "json",
						q: request.term
					},
                    beforeSend: setRequestHeader,
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
        
        $.ajax({
           url: spotifyHost + 'v1/artists/'+ artist.id +'/related-artists',
           type: "GET",
           beforeSend: setRequestHeader,
           success: function(data) { 
             rdata = data;
           }
        });
        
        return rdata;
    }


    var getArtist = function( name ) {

        var rdata = null;
        
        $.ajax({
            url: spotifyHost + 'v1/search',
            dataType: "json",
            data: {
                type: "artist",
                q: name
            },            
           type: "GET",
           beforeSend: setRequestHeader,
           success: function(data) { 
             rdata = data;
           }
        });
        
        return rdata;
    }

    
    var getArtistPlaylist = function( artist ) {
    
        var rdata = null;
        var art = getArtist(artist);      
        var id = art.artists.items[0].id;
        
        $.ajax({
           url: spotifyHost + 'v1/artists/' + id + '/top-tracks',
           dataType: "json",
           data: {
                country: "SE"
           },            
           type: "GET",
           beforeSend: setRequestHeader,
           success: function(data) { 
             rdata = data;
           }
        });
                
        return rdata;
    }
	
    
    var getSongs = function( songs ) {
        
        var rdata = null;
    
        var tids = [];
        songs.forEach(function(song) {
            var tid = _fidToSpid(song.id);
            tids.push(tid);
        }); 
        
        $.ajax({
           url: spotifyHost + 'v1/tracks/',
           dataType: "json",
           data: {
                ids: tids.join(',')
           },                 
           type: "GET",
           beforeSend: setRequestHeader,
           success: function(data) { 
             rdata = data;
           }
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
