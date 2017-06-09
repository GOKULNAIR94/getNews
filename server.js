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

// var myContext = 'getPromo';
// var actionType = "";
// var titleName = '';
// var tNumber = '';
// var territoryStored = '';
// var objectName = '';
// var attributeName = '';
// var msRecord = '';
// var newValue = "";
// var msId = "";
// var outputAttribute ="";

// var uname = 'gokuln';
// var pword = 'Goklnt@1';
// var speech = '';
// var options = '';
// var urlPath = '';
// var request;
// var responseString;
// var resCode = '';
// var resObj = '';
// var pId, pName, msId, msName;


restService.post('/inputmsg', function(req, res) {

    var intentName = req.body.result.metadata.intentName;
    console.log( "intentName : " + intentName );
    var content;
    try
    {
      if( intentName == 'Budget' || intentName == 'Expense' ){
        var newoptions = {
          host: 'vikiviki.herokuapp.com',
          path: '/inputmsg',
          data: req.body,
          method:'POST',
        };

        var body = "";
        var responseObject;

        var post_req = http.request(newoptions, function(response) {
          response.on('data', function (chunk) {
            body += chunk;
          });

          response.on('end', function() {
            console.log( "Body : " + body );
            //responseObject = JSON.parse(body);
            //res.json(responseObject);
          })
        }).on('error', function(e){
          console.error(e);
        });

        console.log( "JSON.stringify(req.body) : " + JSON.stringify(req.body))
        post_req.write(JSON.stringify(req.body));
        post_req.end();
      }


      if(intentName == 'ReadCSV' ){
        content = fs.readFileSync('data.json', 'utf8');
        console.log( "Content : " + content);
        content = JSON.parse(content);
        console.log( "Name : " + content.items[0].Name );
        console.log( "Grade : " + content.items[0].cadre );
        var query = "cadre=A11";
        var output =
          jsonQuery('items[* '+ query +'].Skils.JS', {
            data: content
          }).value;
          if( output.length == 1 )
            console.log( "Output : " + output);

          if( output.length > 1 )
          {
            var sum = 0;
            for(var i =0; i < output.length; i++)
            {
              sum = sum + parseFloat(output[i]);
            }
            console.log( "Sum : " + sum);
          }
      }

      if(intentName == 'WriteCSV' ){
        content = fs.readFileSync('data.json', 'utf8');
        console.log( "Content : " + content);
        content = JSON.parse(content);
        content.items[0]["Location"] = "Mahape";
        content.items[0]["cadre"] = "A12";
        content = JSON.stringify( content, null, 2);
        fs.writeFile('data.json', content, function(){
          console.log("All set...");
        });
      }
        // var path = require("path");

        // console.log( "Dir Name : " + __dirname);
        // console.log(path.dirname(__filename));

        // if(intentName == 'WriteCSV' )
        // {
        //     var csv = require('fast-csv');
    
        //     var ws =fs.createWriteStream(__dirname +'/my.csv');
        //     csv.write([
        //         ["Name","Goku"],
        //         ["a2","b2"],
        //         ["a3","b3"]
        //       ], {headers : true})
        //     .pipe(ws);
        //     console.log( "Write Finished... " );
        // }

        // if(intentName == 'ReadCSV' )
        // {
        //     var csv = require('fast-csv');
    
        //     fs.createReadStream( './my.csv')
        //         .pipe(csv())
        //         .on('data', function(data){
        //             console.log(data);
        //         } )
        //         .on('end', function(data){
        //             console.log("Read Finished");
        //         });
        // }
    }
    catch(e)
    {
        console.log("Error : " + e );
    }

  //   titleName = req.body.result.parameters.titleName;
  //   territoryStored = req.body.result.parameters.territoryStored;
  //   objectName = req.body.result.parameters.object;
  //   attributeName = req.body.result.parameters.attribute;
  //   msRecord = req.body.result.parameters.msRecord;
  //   actionType = req.body.result.parameters.actionType;
  //   newValue = req.body.result.parameters.newValue;

  //   console.log("titleName :" + titleName);
  //   console.log(" territoryStored : " + territoryStored);
  //   console.log(" msRecord : " + msRecord);
  //   console.log(" actionType : " + actionType);
  //   console.log(" newValue : " + newValue);

  //   if (territoryStored != null) {
  //       myContext = 'getObject';
  //   }
  //   if (msRecord != null)
  //       myContext = 'getValue';
  //   if (actionType == "update") {
  //       myContext = "update";
  //   }

  //   function query(urlPath, callback) {

  //       console.log("urlPath : " + urlPath);
  //       options = {
  //           host: 'cbhs-test.crm.us2.oraclecloud.com',
  //           path: urlPath,
  //           headers: {
  //               'Authorization': 'Basic ' + new Buffer(uname + ':' + pword).toString('base64')
  //           }
  //       };

  //       request = http.get(options, function(resx) {
  //           responseString = "";
  //           resx.on('data', function(data) {
  //               responseString += data;
  //           });
  //           resx.on('end', function() {
  //               resObj = JSON.parse(responseString);
  //               console.log("resObj : " + resObj);
  //               callback(resObj);
  //           });
  //           resx.on('error', function(e) {
  //               console.log("Got error: " + e.message);
  //           });
  //       });
  //   }

  //   switch (myContext) {
  //       case "getPromo":

  //           GetPromo();
  //           break;

  //       case "getObject":
  //           GetObject()
  //           break;

  //       case "getValue":
  //           GetValue()
  //           break;

  //       case "update":
  //           Update()
  //           break;

  //       case "default":
  //           break;
  //   }

  //   function GetPromo() {
  //       console.log("GetPromo");
  //       urlPath = '/salesApi/resources/latest/Title_c?onlyData=true&q=TitleName_c=' + encodeURIComponent(titleName) + '&fields=TitleNumber_c';
  //       console.log(urlPath);

  //       query(urlPath, function(result) {
  //           console.log("titleObj : " + result);
  //           tNumber = result.items[0].TitleNumber_c;
  //           console.log("tNumber : " + tNumber);

  //           urlPath = '/salesApi/resources/latest/__ORACO__PromotionProgram_c?onlyData=true&q=TitleNumberStored_c=' + tNumber + '&fields=RecordName,Id';
  //           query(urlPath, function(result) {
  //               var promoCount = result.count;
  //               console.log("promoCount : " + promoCount);
  //               speech = "";
  //               if( promoCount == 1 )
  //               {
  //                   pId = result.items[0].Id;
  //                   outputAttribute = result.items[0][attributeName];
  //                   speech = attributeName + " of " + titleName + " : " + msattribute;
  //               }
  //               if( promoCount == 0 )
  //               {
  //                   speech = 'There are ' + promoCount + ' promotion(s) for the Title ' + titleName + ".";
  //               }
  //               if( promoCount > 1 )
  //               {
  //                   speech = 'There are ' + promoCount + ' promotion(s) for the Title ' + titleName + "\n Please select a region of the Promotion of the Title";
                
  //                   for (var i = 0; i < promoCount; i++) {
  //                       pId = result.items[i].Id;
  //                       pName = result.items[i].RecordName;
  //                       speech = speech + "\n\n" + parseInt(i + 1, 10) + ". " + pId + " - " + pName;
  //                       if (i == promoCount - 1)
  //                           speech = speech + ".";
  //                       else
  //                           speech = speech + ",";
  //                   }
  //               }
  //               return res.json({
  //                   speech: speech,
  //                   displayText: speech,
  //                   //source: 'webhook-OSC-oppty'
  //               })
  //           });
  //       });



  //   }

  //   function GetObject() {
  //       console.log("GetObject");
  //       urlPath = '/salesApi/resources/latest/__ORACO__PromotionProgram_c?onlyData=true&q=TitleNumberStored_c=' + tNumber + ';TerritoryStored_c=' + territoryStored + '&fields=RecordName,Id';
  //       console.log(urlPath);

  //       query(urlPath, function(result) {
  //           pId = result.items[0].Id;
  //           pName = result.items[0].RecordName;
  //           console.log("pId : " + pId);
  //           console.log("pName : " + pName);

  //           urlPath = "/salesApi/resources/latest/MarketSpend_c?onlyData=true&q=PromotionName_Id_c=" + pId + "&fields=Id,RecordName,Status_c,RequestType_c";
  //           query(urlPath, function(result) {
  //               var msCount = result.count;
  //               console.log("msCount : " + msCount);
  //               speech = "";
  //               speech = 'There are ' + msCount + ' Market Spend(s) for the Promotion ' + pName + "\n Please select a Market Spend";
  //               var msId, msName;

  //               for (var i = 0; i < msCount; i++) {
  //                   msId = result.items[i].Id;
  //                   msName = result.items[i].RecordName;
  //                   speech = speech + "\n\n" + parseInt(i + 1, 10) + ". " + msId + " - " + msName;
  //                   if (i == msCount - 1)
  //                       speech = speech + ".";
  //                   else
  //                       speech = speech + ",";
  //               }
  //               return res.json({
  //                   speech: speech,
  //                   displayText: speech,
  //                   //source: 'webhook-OSC-oppty'
  //               })
  //           });
  //       });
  //       console.log("MultiTerritory");
  //   }

  //   function GetValue() {
  //       console.log("GetValue");
  //       urlPath = "/salesApi/resources/latest/" + objectName + "?onlyData=true&q=RecordName=" + msRecord;
  //       query(urlPath, function(result) {
  //           var msattribute = result.items[0][attributeName];
  //           msId = result.items[0].Id;
  //           var msRecordName = result.items[0].RecordName;
  //           console.log(attributeName + " of " + msRecordName + " : " + msattribute);
  //           speech = "";
  //           speech = attributeName + " of " + msRecordName + " : " + msattribute;
  //           return res.json({
  //               speech: speech,
  //               displayText: speech,
  //               //source: 'webhook-OSC-oppty'
  //           })
  //       });
  //   }

  //   function Update() {
  //       var bodyToUpdate = {};
	 //    bodyToUpdate[attributeName] = newValue;
        
  //       console.log("Update");
	 //    console.log("bodyToUpdate -" + bodyToUpdate.toString());
  //       urlPath = "/salesApi/resources/latest/" + objectName + "/" + msId;
		// console.log("URL : " +  urlPath);
  //       var newoptions = {
  //           host: "cbhs-test.crm.us2.oraclecloud.com",
  //           path: urlPath,
  //           data: bodyToUpdate,
  //           method: 'PATCH',
  //           headers: {
  //               'Authorization': 'Basic ' + new Buffer(uname + ':' + pword).toString('base64'),
  //               'Content-Type': 'application/vnd.oracle.adf.resourceitem+json'
  //           }
  //       };
  //       var post_req = http.request(newoptions, function(resp) {
  //           resp.on('data', function(chunk) {
  //               console.log('Response: ' + chunk);
		// 	speech = "Value has been updated.";
		//     return res.json({
  //                   speech: speech,
  //                   displayText: speech,
  //                   //source: 'webhook-OSC-oppty'
  //               })
		    
  //           });
  //           resp.on('end', function() {
  //               //response.send({statusCode : 200});
                
  //           })
  //       }).on('error', function(e) {
  //           console.log("Error" + e);
  //           speech = "Error" + e;
  //       });
  //       post_req.write(JSON.stringify( bodyToUpdate ));
  //       post_req.end();
		
		
  //   }
	
});


restService.listen((process.env.PORT || 9000), function() {
    console.log("Server up and listening");
});
