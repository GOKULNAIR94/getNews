'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const restService = express();
var http = require('https');
var fs = require('fs');
restService.use(bodyParser.urlencoded({
    extended: true
}));
restService.use(bodyParser.json());

var jsonQuery = require('json-query');

restService.post('/inputmsg', function(req, res) {

    var intentName = req.body.result.metadata.intentName;
    var tracker = req.body.result.parameters.track;
    console.log( "intentName : " + intentName );
    var content;
    var speech = '';
    try
    {   
        var GoogleNews, googleNews, track;

        GoogleNews = require('google-news');
        googleNews = new GoogleNews();

        track = tracker;
        var speech = "";
        googleNews.get(track, function(stream) {
            var news = "";

            stream.on(GoogleNews.DATA, function(data) {
                //console.log('Stringify ' + JSON.stringify(data));
                console.log('Data Event received... ' + data.title);

                speech =  speech + data.title;
            });
            stream.on(DATA, function(data) {
                return res.json({
                  speech: speech,
                  displayText: speech
                })
            });

            stream.on(ERROR, function(error) {
                console.log('Error Event received... ' + error);
            });

        });
    }
    catch(e)
    {
        console.log("Error : " + e );
    }
});


restService.listen((process.env.PORT || 9000), function() {
    console.log("Server up and listening");
});
