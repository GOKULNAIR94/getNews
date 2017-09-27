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
var SendRes = require("./sendres");

restService.post('/inputmsg', function(req, res) {

    console.log("Req  : " + JSON.stringify(req.body));
    var intentName = "";
    var tracker = "";
    if (req.body.intentName != null)
        intentName = req.body.intentName;
    else {
        intentName = req.body.result.metadata.intentName;
    }
    if (req.body.track != null)
        tracker = req.body.track;
    else {
        tracker = req.body.result.contexts[0].parameters.track;
    }

    console.log("intentName : " + intentName);
    console.log("tracker : " + tracker);
    var content;
    var speech = "";
    var speechVoice = "";
    var returnJson;
    try {
        var GoogleNews, googleNews, track;

        GoogleNews = require('google-news');
        googleNews = new GoogleNews();

        track = tracker;
        
        var news = "";
        var image = "";
        var count = 1;
        var carousels1 = [];
        var carousels2 = [];

        
        googleNews.stream(track, function(stream) {
            
            
            const GoogleNewsRss = require('google-news-rss');
 
            const googleNews = new GoogleNewsRss();

            googleNews
               .search('Steve Jobs',10,en)
               .then(resp => console.log(resp));


            stream.on(GoogleNews.DATA, function(data) {
                //console.log('Stringify ' + JSON.stringify(data));
                //console.log('Data Event received... ' + data.link);
                //callback( data.title );
                if (data.link != null && data.link != NaN) {

                    var newsurl = data.link;
                    //tera code
                    var googl = require('goo.gl');

                    googl.setKey('AIzaSyD75VTq7NYjo6nvRgF354QomarX14NWTbY');

                    googl.getKey();

                    googl.shorten(newsurl)
                        .then(function(shortUrl) {
                            console.log("count  : " + count);
                        //console.log("Image : " + JSON.stringify(data.meta.image.url));
                        if( data.image.url != null && data.image.url != "" ){
                           image = data.image.url;
                           }else{
                               image = data.meta.image.url;
                           }
                            console.log("Google Response:");
                            speech = speech + "" + os.EOL + "" + data.title + "! ";
                            speechVoice = speechVoice + "" + os.EOL + "" + data.title + "!.. ";
                            speech = speech + "\n More @ : " + shortUrl + "!" + os.EOL;
    
                        carousels1.push({
                                        "shortUrl": shortUrl,
                                        "title": shortUrl,
                                        "description": data.title + ".",
                                        "image": image
                                    });
                        

                            if (count == 10) {
                                for( var i=0; i<10; i++){
                                    
                                carousels2.push({
                                                "optionInfo": {
                                                    "key": "Please open " + carousels1[i].shortUrl,
                                                    "synonyms": [
                                                        "Google Home Assistant",
                                                        "Assistant on the Google Home"
                                                    ]
                                                },
                                                "title":  carousels1[i].title,
                                                "description": carousels1[i].description,
                                                "image": {
                                                    "url": carousels1[i].image,
                                                    "accessibilityText": ""
                                                }
                                            });
                                }
                                
                                if (req.body.originalRequest.source == "google") {
                                    returnJson = {
                                        "speech": "Following are the top 5 news from Google.",
                                        "data": {
                                            "google": {
                                                "expectUserResponse": true,
                                                "richResponse": {
                                                    "items": [{
                                                        "simpleResponse": {
                                                            "textToSpeech": "Following are the top 5 news from Google."
                                                        }
                                                    }]
                                                },
                                                "systemIntent": {
                                                    "intent": "actions.intent.OPTION",
                                                    "data": {
                                                        "@type": "type.googleapis.com/google.actions.v2.OptionValueSpec",
                                                        "carouselSelect": {
                                                            "items": carousels2
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    };
                                } else {
                                    returnJson = {
                                        speech: speech,
                                        displayText: speech
                                    };
                                }
                                //console.log(" Speech : " + speech);
                                console.log(" returnJson : " + JSON.stringify(returnJson));
                                res.json(returnJson);
                            } else {
                                count++;
                            }

                        })
                        .catch(function(err) {
                            console.error(err.message);
                        });
                } else {
                    speech = speech + "" + os.EOL + "" + data.title + "! ";
                    if (count == 10) {
                        if (req.body.intentName != null)
                            res.json(speech);
                        else {
                            return res.json({
                                speech: speech,
                                displayText: speech
                            })
                        }
                    }
                    count++;
                }

            });

            stream.on(GoogleNews.ERROR, function(error) {
                console.log('Error Event received... ' + error);
            });

        });
    } catch (e) {
        console.log("Error : " + e);
    }
});


restService.listen((process.env.PORT || 9000), function() {
    console.log("Server up and listening");
});