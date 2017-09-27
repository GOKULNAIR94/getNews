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

        var carousels = [];
        var basicCard = {
            "key": "value"
        };

        var gNews = "";
        const GoogleNewsRss = require('google-news-rss');

        const googleNews = new GoogleNewsRss();

        googleNews
            .search( tracker, 10, "en")
            .then(resp => {

                console.log("resp : " + resp);
            
            
                

                for (var i = 0; i < resp.length; i++) {
                    
                    if( resp[i].thumbnailUrl == null || resp[i].thumbnailUrl == "" ){
                        resp[i].thumbnailUrl = "https://vignette4.wikia.nocookie.net/logopedia/images/d/d1/Google_News_icon_2015.png/revision/latest?cb=20150901190817";
                    }else{
                        resp[i].thumbnailUrl = "http:" + resp[i].thumbnailUrl;
                        
                    }
                    
                    
                    if( intentName == "Activities - Sales - custom - news - custom"){
                        var headLine = req.body.headline;
                        console.log("HeadLine : " + headLine );
                        
                        
                        
                        basicCard["title"] = resp[i].title;
                        basicCard["image"] = resp[i].thumbnailUrl;
                        basicCard["description"] = resp[i].description;
                        basicCard["url"] = resp[i].link;
                        
                        console.log( "resp[i].title :" + resp[i].title );
                        if( resp[i].title.indexOf(headLine.substring(1, 15)) == 0  ){
                            
                            break;
                        }
                        console.log( "flag :" + resp[i].title.indexOf(headLine.substring(1, 10)) );
                    }else{
                        carousels.push({
                            "optionInfo": {
                                "key": resp[i].title,
                                "synonyms": [
                                    "Google Home Assistant",
                                    "Assistant on the Google Home"
                                ]
                            },
                            "title": resp[i].title + ".. More details..",
                            "description": resp[i].description,
                            "image": {
                                "url": resp[i].thumbnailUrl,
                                "accessibilityText": "resp[i].title"
                            }
                        });
                    }
                    
                    

                    
                }

                if (req.body.originalRequest.source == "google") {
                    if( intentName == "Activities - Sales - custom - news - custom"){
                        returnJson = {
                                'expectUserResponse': true,
                                'isSsml': false,
                                'noInputPrompts': [],
                                'richResponse': {
                                    'items': [{
                                            'simpleResponse': {
                                                'textToSpeech': basicCard["title"],
                                                'displayText': basicCard["title"]
                                            }
                                        },
                                        {
                                            'basicCard': {
                                                'title': '',
                                                "image": {
                                                    "url": basicCard["image"],
                                                    "accessibilityText": ""
                                                },
                                                'buttons': [{
                                                    'title': "More details...",
                                                    'openUrlAction': {
                                                        'url': basicCard["url"]
                                                    }
                                                }]
                                            }
                                        }
                                    ]
                                }
                            }
                    }else{
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
                                                "items": carousels
                                            }
                                        }
                                    }
                                }
                            }
                        };
                    }
                    
                    
                } else {
                    returnJson = {
                        speech: speech,
                        displayText: speech
                    };
                }
                console.log(" returnJson : " + JSON.stringify(returnJson));
                res.json(returnJson);

            });

    } catch (e) {
        console.log("Error : " + e);
    }
});


restService.listen((process.env.PORT || 9000), function() {
    console.log("Server up and listening");
});