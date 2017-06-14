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
var os = require('os');
restService.post('/inputmsg', function(req, res) {

    var intentName = req.body.result.metadata.intentName;
    var tracker = req.body.result.contexts[0].parameters.track;
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
        var news = "";
        googleNews.stream(track, function(stream, callback) {
            

            stream.on(GoogleNews.DATA, function(data, callback) {
                //console.log('Stringify ' + JSON.stringify(data));
                //console.log('Data Event received... ' + data.link);
                //callback( data.title );
                if( data.link != null && data.link != NaN && req.body.result.metadata.intentName == "News - link" ){
                    
                    var newsurl = data.link;
                    //tera code
                    var googl = require('goo.gl');
                    
                    googl.setKey('AIzaSyD75VTq7NYjo6nvRgF354QomarX14NWTbY');
                    
                    googl.getKey();
                    
                    googl.shorten(newsurl)
                    .then(function (shortUrl, callback) {
                        console.log("shortUrl  : " + shortUrl);
                        speech = speech + "" + os.EOL + "" + data.title + "! ";
                        speech =  speech + "\n More @ : "+ shortUrl + "!" + os.EOL;
                        callback("");
                    })
                    .catch(function (err) {
                        console.error(err.message);
                    });
                }
                else
                    speech = speech + "" + os.EOL + "" + data.title + "! ";
                
                callback("");
                    
            });

            stream.on(GoogleNews.ERROR, function(error) {
                console.log('Error Event received... ' + error);
            });
            
            //setTimeout(function() {
                return res.json({
                  speech: speech,
                  displayText: speech
                })
            //}, 2000);
            
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
