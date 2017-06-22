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
restService.post('/inputmsg', function( req, res ) {

    console.log("Req  : " + JSON.stringify(req.body));
	var intentName = req.body.intentName;
    var tracker = "";
	tracker = req.body.track;

		
	console.log( "intentName : " + intentName );
    console.log( "tracker : " + tracker	 );
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
		var count = 1 ;
        googleNews.stream(track, function(stream) {
            

            stream.on(GoogleNews.DATA, function( data ) {
                //console.log('Stringify ' + JSON.stringify(data));
                //console.log('Data Event received... ' + data.link);
                //callback( data.title );
                if( data.link != null && data.link != NaN ){
                    
                    var newsurl = data.link;
                    //tera code
                    var googl = require('goo.gl');
                    
                    googl.setKey('AIzaSyD75VTq7NYjo6nvRgF354QomarX14NWTbY');
                    
                    googl.getKey();
                    
                    googl.shorten(newsurl)
                    .then(function ( shortUrl ) {
                        console.log("count  : " + count);
                        speech = speech + "" + os.EOL + "" + data.title + "! ";
                        speech =  speech + "\n More @ : "+ shortUrl + "!" + os.EOL;
						if( count == 10 ){
                            return res.json({
                              speech: speech,
                              displayText: speech
                            })
                        }
						count++;
                    })
                    .catch(function (err) {
                        console.error(err.message);
                    });
                }
                else{
					speech = speech + "" + os.EOL + "" + data.title + "! ";
					if( count == 10 ){
                        return res.json({
                          speech: speech,
                          displayText: speech
                        })
                    }
					count++;
				}
                    	
            });

            stream.on(GoogleNews.ERROR, function(error) {
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
