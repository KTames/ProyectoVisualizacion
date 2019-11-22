async function loadSingleArtist(artist, search, reload, token) {
    const asincrono = new Promise((resolve, reject) => {

        const onSuccess = function (data) {
            console.log("Resolved data");
            resolve(data);
        };

        search.searchArtist(artist, token, onSuccess, function (error) {
            console.log("Error");
            console.log(error);
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
    })

    const ret = await asincrono;
    // console.log(ret);
    return ret;
}

module.exports = function (axios, cheerio, puppeteer) {
    return {
        getGenre: function (genre, search, reloadToken, access_token, res, onError = console.error) {
            const url = "https://musicbrainz.org/tag/" + genre;
            console.log(url)
            axios(url)
                .then(async function (response) {
                    console.log("Entered then");
                    const html = response.data;
                    const $ = cheerio.load(html)
                    const statsTable = $('#content > ul, #content > h2');
                    const artistsArray = [];

                    let loadArtists = false;
                    statsTable.each(function () {
                        if ($(this).text() == "Artists")
                            loadArtists = true;
                        else if (loadArtists) {
                            $(this).find("li").each(function () {
                                const text = $(this).text();
                                const href = $(this).find('a').attr('href');
                                artistsArray.push({
                                    text: text,
                                    link: href,
                                });
                            });
                            artistsArray.pop();
                            loadArtists = false;
                        }
                    });
                    
                    console.log("Starting to search");
                    for (artist of artistsArray) {
                        console.log("Entered");
                        const response = await loadSingleArtist(text, search, reloadToken, access_token);
                        console.log("Got response");
                        artist['response'] = response;
                    }

                    console.log(artistsArray);
                    res.send({
                        artists: artistsArray
                    });
                })
                .catch(onError);
        }
    };
};