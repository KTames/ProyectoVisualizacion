function parseSearchTracksData(data) {
    const newData = [];

    for (track of data.tracks.items) {
        const newTrack = {};

        newTrack.name = track.name;
        newTrack.popularity = track.popularity;
        newTrack.album = track.album.name;
        newTrack.artists = [];
        for (artist of track.artists) {
            newTrack.artists.push(artist.name);
        }

        newTrack.image = track.album.images[0].url;

        newTrack.duration = msToTime(track.duration_ms);

        newData.push(newTrack);
    }

    newData.sort((a, b) => (a.popularity < b.popularity) ? 1 : -1)
    return newData;
}

function msToTime(duration) {
    var milliseconds = parseInt((duration % 1000) / 100),
        seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)));

    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return minutes + ":" + seconds + "." + milliseconds;
}

module.exports = function (request) {
    return {
        search: function (params, access_token, onSuccess, onError) {
            var options = {
                url: 'https://api.spotify.com/v1/search',
                qs: {
                    'q': params,
                    'type': 'track',
                    'limit': '30'
                },
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + access_token
                },
                json: true,
            };
            request.get(options, function (error, response, body) {
                if (!error && response.statusCode === 200)
                    onSuccess(parseSearchTracksData(body));
                else
                    onError(response == undefined || response == null ? error : response.body);
            });
        },
        searchArtist: async function(artist, access_token, onSuccess, onError) {
            var options = {
                url: 'https://api.spotify.com/v1/search',
                qs: {
                    'q': artist,
                    'type': 'artist',
                    'limit': '30'
                },
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + access_token
                },
                json: true,
            };
            request.get(options, function (error, response, body) {
                if (!error && response.statusCode === 200)
                    onSuccess(body);
                else
                    onError(response.body);
            });
        }
    };
};