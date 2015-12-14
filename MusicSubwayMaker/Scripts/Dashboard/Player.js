/*
 *
 * Dashboard Music Player.
 *
 * Copyright (c) 2015 It's Raining Bits
 * Email: shaadylaane@gmail.com
 * Licensed under the MIT license
 */
 
 

Dashboard.Player = (function ( ) {

    var audio = null;    
    var player = null;
    var playlist = null;
    var inPlaylist = null;
    var link = null;    
    var curSong = 0;
    var playing = false;
    var curArtist = "";
        
    var launch = function ( artist, newlink, playNow )
    {
        var err = 0;
        curSong = 0;
        curArtist = "";

        if ( !playing || playNow )
        {
            var data = Spotify.getArtistPlaylist( artist );
            if ( !data )
                return 1;   

            if (! ('songs' in data.response)) {
                err = 1;
            } else {

                inPlaylist = data.response.songs;
                link = newlink;
                _addSpotifyInfoToPlaylist();
                if ( playNow )
                    _play();
                
                curArtist = artist;
            }       
        }
    
        return err;
    }

    
    var remove = function () {
        $('.sp-player').remove();
    }


    var getArtist = function () {
        return curArtist;
    }


    var _createPlayer = function () {
        
        remove();
           
        var main = $("<div class='sp-player'>");
       // var img = $("<img class='sp-album-art'>");
        var info  = $("<div class='sp-info'>");
        var title = $("<div class='sp-title'>");
        var artist = $("<div class='sp-artist'>");
        var controls = $("<div class='sp-controls'>");

        var next = $('<button class="btn btn-primary btn-sm" type="button"><span class="glyphicon glyphicon-forward"></span></button>');
        var prev = $('<button class="btn btn-primary btn-sm" type="button"><span class="glyphicon glyphicon-backward"></span></button>');
        var pausePlay = $('<button class="btn btn-primary btn-sm" type="button"><span class="glyphicon glyphicon-play"></span></button>');
        var go2spotify = $('<button class="btn btn-primary btn-sm" type="button"><span class="glyphicon glyphicon-new-window"></span></button>');


        audio = $("<audio>");
        audio.on('pause', function() {
            var pp = pausePlay.find("span");
            pp.removeClass('glyphicon-pause');
            pp.addClass('glyphicon-play');
        });

        audio.on('play', function() {
            var pp = pausePlay.find("span");
            pp.addClass('glyphicon-pause');
            pp.removeClass('glyphicon-play');
        });

        audio.on('ended', function() {
            _nextSong();
        });

        next.on('click', function() {
            _nextSong();
        });

        pausePlay.on('click', function() {
            _togglePausePlay();
        });

        prev.on('click', function() {
            _prevSong();
        });
        
        go2spotify.on('click', function() {         
            _pause();
            Utils.openWindow( link );
        });

        info.append(title);
        info.append(artist);

        controls.append(prev);
        controls.append(pausePlay);
        controls.append(next);
        controls.append(go2spotify);

        main.append(info);
        main.append(controls);
    
        main.on("remove", function () {
            audio.get(0).pause();
            playing = false;
        })

        return main;
    }
        
    
    

    var _addSpotifyInfoToPlaylist = function () {

        var data = Spotify.getSongs( inPlaylist );
        if ( data )
        {
            data.tracks.forEach(function(track, i) {
                inPlaylist[i].spotifyTrackInfo = track;
            });

            playlist = _filterSongs(inPlaylist);
            if ( !playlist.length )
            {
                Log.popupError("No Song found :(");
                return;
            }
    
            player = _createPlayer();                
            _showCurSong(false);
            $("#player").append(player);
        }  
    }

    var _filterSongs = function (songs) {
        var out = [];

        function isGoodSong(song) {
            return song.spotifyTrackInfo.preview_url != null;
        }

        songs.forEach(function(song) {
            if (isGoodSong(song)) {
                out.push(song);
            }
        });

        return out;
    }

    var _showSong = function (song, autoplay) {

        if (player)
        {
            $(player).find(".sp-title").text(song.title);
            $(player).find(".sp-artist").text(song.artist_name);
            audio.attr('src', song.spotifyTrackInfo.preview_url);
            if (autoplay) { 
                audio.get(0).play();
                playing = true;
            }
        }
    }


    var _showCurSong = function (autoplay) {
        if( curSong < playlist.length )
            _showSong(playlist[curSong], autoplay);
    }

    var _nextSong = function () {
        if (curSong < playlist.length - 1) {
            curSong++;
            _showCurSong(true);
        } else {
        }
    }

    var _prevSong = function () {
        if (curSong > 0) {
            curSong--;
            _showCurSong(true);
        }
    }

    var _togglePausePlay = function () {
        if (audio.get(0).paused) {
            audio.get(0).play();
            playing = true;
        } else {
            audio.get(0).pause();
            playing = false;
        }
    }

    var _play = function () {
        if (audio.get(0).paused) {
            audio.get(0).play();
            playing = true;
        }
    }
    
    var _pause = function () {
        if (!audio.get(0).paused) {
            audio.get(0).pause();
            playing = false;
        }
    }
    
        
    return {
        launch: launch,
        remove: remove,
        getArtist: getArtist    
    };

})();
