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
    var speech = '';
    var returnJson;
    try {
        var GoogleNews, googleNews, track;

        GoogleNews = require('google-news');
        googleNews = new GoogleNews();

        track = tracker;
        var speech = "";
        var news = "";
        var count = 1;
        googleNews.stream(track, function(stream) {


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
                            if (req.body.originalRequest.source == "google") {
                                console.log("Google Response:");
                                speech = speech + "" + os.EOL + "" + data.title + "! ";
                                speech = speech + "\n More @ : " + shortUrl + "!" + os.EOL;
                                returnJson = {
                                    speech: speech,
                                    displayText: speech,
                                    data: {
                                        google: {
                                            'expectUserResponse': true,
                                            'isSsml': false,
                                            'noInputPrompts': [],
                                            'richResponse': {
                                                'items': [{
                                                        'simpleResponse': {
                                                            'textToSpeech': "Hi",
                                                            'displayText': "Hi"
                                                        }
                                                    },
                                                    {
                                                        "simpleSelect": {
                                                    "items": [{
                                                            "optionInfo": {
                                                                "key": "MATH_AND_PRIME",
                                                                "synonyms": [
                                                                    "math",
                                                                    "math and prime",
                                                                    "prime numbers",
                                                                    "prime"
                                                                ]
                                                            },
                                                            "title": "Math & prime numbers",
                                                            "description": "42 is an abundant number because the sum of its proper divisors 54 is greater…",
                                                            "image": {
                                                                "url": "https://image.flaticon.com/teams/slug/freepik.jpg",
                                                                "accessibilityText": "Math & prime numbers"
                                                            }
                                                        },
                                                        {
                                                            "optionInfo": {
                                                                "key": "EGYPT",
                                                                "synonyms": [
                                                                    "religion",
                                                                    "egpyt",
                                                                    "ancient egyptian"
                                                                ]
                                                            },
                                                            "title": "Ancient Egyptian religion",
                                                            "description": "42 gods who ruled on the fate of the dead in the afterworld. Throughout the under…",
                                                            "image": {
                                                                "url": "https://image.flaticon.com/teams/slug/freepik.jpg",
                                                                "accessibilityText": "Egypt"
                                                            }
                                                        },
                                                        {
                                                            "optionInfo": {
                                                                "key": "RECIPES",
                                                                "synonyms": [
                                                                    "recipes",
                                                                    "recipe",
                                                                    "42 recipes"
                                                                ]
                                                            },
                                                            "title": "42 recipes with 42 ingredients",
                                                            "description": "Here's a beautifully simple recipe that's full of flavor! All you need is some ginger and…",
                                                            "image": {
                                                                "url": "https://image.flaticon.com/teams/slug/freepik.jpg",
                                                                "accessibilityText": "Recipe"
                                                            }
                                                        }
                                                    ]
                                                }
                                                    }
                                                ]
                                            }
                                        }
                                    }
                                }
                            } else {
                                speech = speech + "" + os.EOL + "" + data.title + "! ";
                                speech = speech + "\n More @ : " + shortUrl + "!" + os.EOL;
                                returnJson = {
                                    speech: speech,
                                    displayText: speech
                                }
                            }
                            if (count == 10) {
                                console.log(" Speech : " + speech);
                                console.log(" returnJson : " + JSON.stringify(returnJson));
                                res.json(returnJson)
                            }
                            count++;
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