module.exports = function (axios, cheerio) {
    return {
        getArtist: function (artist_url, res) {
            const url = "https://musicbrainz.org/" + artist_url;
            
            console.log(url);
            axios(url)
                .then(function (response) {
                    // res.send({url: response.toString()});
                    const html = response.data;
                    const $ = cheerio.load(html);
                    const datos = $('.area').text();
                    console.log({text: datos});
                    res.send({area: datos});

            //         onSuccess({text: datos});
            //     }, function(error) {
            //         console.log(error);
                })
        }
    }
};