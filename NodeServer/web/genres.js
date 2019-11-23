async function loadSingleArtist(artist, search, reload, token) {
    return new Promise(async (res, rej) => {
        const artists = new Promise((resolve, reject) => {
            const onSuccess = function (data) {
                resolve(data);
            };
            
            search.searchArtist(artist, token(), onSuccess, function (error) {
                if (error.error.status == 401) {
                    reload(function (new_token) {
                        search.searchArtist(artist, new_token, onSuccess, function (error) {
                            resolve(error);
                        });
                    });
                } else {
                    resolve(error);
                }
            });
        });

        const response = await artists.catch(console.log);
        if (response.artists.total == 0)
            res(0);
        else {
            res({
                popularity: response.artists.items[0].popularity,
                id: response.artists.items[0].id
            });
        }
    });
}

async function getSongs(artist, search, reload, token) {
    if (artist == undefined) return [];
    return new Promise(async (res, rej) => {
        const songs = new Promise((resolve, reject) => {
            const onSuccess = function (data) {
                resolve(data);
            };

            search.searchArtistSongs(artist, token(), onSuccess, function (error) {
                if (error.error.status == 401) {
                    reload(function (new_token) {
                        search.searchArtist(artist, new_token, onSuccess, function (error) {
                            resolve(error);
                        });
                    });
                } else {
                    resolve(error);
                }
            });
        });

        const response = await songs;
        // res(songs);

        const newSongs = [];
        // console.log(response.tracks);
        for (song of response.tracks) {
            const newObj = {};
            newObj['nombre'] = song.name;
            newObj['size'] = song.popularity;
            newSongs.push(newObj);
        }
        res(newSongs);
    });
}

module.exports = function (axios, cheerio) {
    return {
        getGenre: function (genre, search, reloadToken, access_token, res, onError = console.error) {
            const url = "https://musicbrainz.org/tag/" + genre;
            console.log(url)
            axios(url)
                .then(async function (response) {
                    const html = response.data;
                    const $ = cheerio.load(html);
                    const statsTable = $('#content > ul, #content > h2');
                    const artistsArray = [];

                    let loadArtists = false;
                    statsTable.each(function () {
                        if ($(this).text() == "Artists")
                            loadArtists = true;
                        else if (loadArtists) {
                            $(this).find("li").each(function () {
                                const text = $(this).find('a > bdi').text();
                                const href = $(this).find('a').attr('href');
                                artistsArray.push({
                                    nombre: text,
                                    link: href,
                                });
                            });
                            artistsArray.pop();
                            loadArtists = false;
                        }
                    });
                    const indexesToDrop = [];
                    let genderPopularity = 0;

                    for ([index, artist] of artistsArray.entries()) {
                        const singleArtistData = await loadSingleArtist(artist.nombre, search, reloadToken, access_token).catch(console.log);
                        artist['popularity'] = singleArtistData.popularity;
                        if (singleArtistData.popularity == undefined)
                            indexesToDrop.push(index);
                        else {
                            genderPopularity += singleArtistData.popularity;
                            const singleArtistSongs = await getSongs(singleArtistData.id, search, reloadToken, access_token).catch(console.log);
                            artist['children'] = singleArtistSongs;
                        }
                    }

                    for (let x = indexesToDrop.length - 1; x >= 0; x--) {
                        artistsArray.splice(indexesToDrop[x]);
                    }

                    genderPopularity /= artistsArray.length;


                    res.send({
                        nombre: genre,
                        popularity: genderPopularity,
                        children: artistsArray
                        // artists: []
                    });
                })
                .catch(onError);
        }
    };
};