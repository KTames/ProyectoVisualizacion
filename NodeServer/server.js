/* Load the HTTP library */
const http = require("http");
const express = require('express'); // Express web server framework
const request = require('request'); // "Request" library
const cors = require('cors');
const cookieParser = require('cookie-parser');

const axios = require('axios');
const cheerio = require('cheerio');

const search = require('./web/search')(request);
const genres = require('./web/genres')(axios, cheerio);

const static_songs = require('./static/songs');

const client_id = '9d7aa1f7b8e54ab99f56b250648de459'; // Your client id
const client_secret = 'cd4b0c86fa87436e9e7419666d701e8d'; // Your secret
const refresh_token = 'AQAr18lBX9wdwzXfur4fdFprQmnONWZqaInuJsyYxtLYo_GIRa6yliqHPAqBsTSizhndslYLBKv0nnSscWa8wrCZRqkrTjC65qq4xxgefoN0WXGt0WuDKnJGXZJZBPGhEGY';

let access_token = 'BQDQiZLZ0n5GLBU01U3Y1kwRmvhQEmJ06k49-1tFDZ0yIB-kUa-couZnbI6gv9_rLHnTHjkgm8nfN8JHKwaEI9nzcpGaRoi4WoKLVbtVh7toNU-n56MPeChkvpCeL1RvWtqWy6qKP2Dt1qxKQQJOsNKheQ061_sJeGu3I7IJJOk9-R1EQQ';

app = express();
app.use(cors()).use(cookieParser());

app.get('/search', function (req, res) {
    const onError = function (error) {
        if (error.error != undefined && error.error.status == 401) {
            getNewAccessToken(function (access_token) {
                search.search(req.query.q, access_token, onSuccess, function (error) {
                    res.send(error);
                });
            });
        } else {
            res.send(error);
        }
    };

    const onSuccess = function (data) {
        res.send(data);
    };

    search.search(req.query.q, access_token, onSuccess, onError);
});

app.get('/genre', function (req, res) {
    genres.getGenre(req.query.q, search, getNewAccessToken, access_token, res, res.send);
});

app.get('/static/search', function (req, res) {
    res.send(static_songs.getStatic());
});

function getNewAccessToken(then) {
    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
        },
        form: {
            grant_type: 'refresh_token',
            refresh_token: refresh_token
        },
        json: true
    };
    request.post(authOptions, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            access_token = body.access_token;
            console.log(access_token);
            then(access_token);
        }
    });
}

console.log('Listening on 9999');
app.listen(9999);