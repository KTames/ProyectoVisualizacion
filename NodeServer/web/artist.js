module.exports = function (axios, cheerio) {
    return {
        getArtist: function (artist_url, res) {
            const url = "https://musicbrainz.org" + artist_url;
            
            console.log(url);
            axios(url)
                .then(function (response) {
                    // res.send({url: response.toString()});
                    const html = response.data;
                    const $ = cheerio.load(html);
                    const area = $('.area').text();
                    const tipo = $('.type').text();
                    const rating = $('.current-rating').first().text();
                    const link = $('.external_links a').first().attr('href');

                    const table = $('table.release-group-list').first();
                    const albums = [];
                    table.find('tbody tr').each(function() {
                        albums.push({
                            year: $(this).find('td').first().text(),
                            releases: $(this).find('td').last().text()
                        });
                    });

                    while (albums.length > 3)
                        albums.shift();
                    
                    res.send({area: area, type: tipo, rating: rating, link: link, albums: albums});

            //         onSuccess({text: datos});
            //     }, function(error) {
            //         console.log(error);
                }, console.log)
        }
    }
};