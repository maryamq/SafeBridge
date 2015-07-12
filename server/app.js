var express        = require('express');
var app            = express();
var bodyParser     = require("body-parser");
var Parse          = require('node-parse-api').Parse;

var options = {
    app_id: process.env.ParseAppID,
    api_key: process.env.ParseSecretKey
}

var parseBackend = new Parse(options);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var client = {}
client.twilio = require('twilio')(process.env.twilioSid, process.env.twilioToken);

var twilio = require('twilio');







app.post('/api/v1/sendMessage', function(req, res){
  /*
  service code here
  //accessing get params
    req.params.id
  */
  var uniqueId     = req.body.unique_id;  // id of the session
  var smsMessage   = req.body.message;

  if (typeof(uniqueId) === "undefined") {
    throw new Error("Error: The request body is missing the unique_id key.")
  }
  if (typeof(smsMessage) === "undefined") {
    throw new Error("Error: The request body is missing the message key.")
  }

  parseBackend.find('client_map', {where: {uq_code: uniqueId}, limit: 1}, function (err, response) {
    if(!err) {
      var parseObject = response.results[0]
      if(typeof parseObject === 'undefined') {
        throw new Error('The unique_id ' + uniqueId + ' could not be found.')
      }
      var phoneNumber = ("+1" + parseObject.ph_num)
      delete parseObject
      client.twilio.sendMessage({
          to: phoneNumber,
          from: '+19783636041',
          body: smsMessage
      }, function(err, responseData) {
          if (!err) {
            res.send("success");
          } else {
            throw new Error('There was an issue sending the message to the client.')
          }
      });
    } else {
      throw new Error('The unique_id ' + uniqueId + ' could not be found.')
    }
  });
});


app.get('/api/v1/endConversation', function(req, res){
  var session_id = req.param.session_id;
  // delte data

});

app.post('/api/v1/serviceName', function(req, res){
  /*
  service code here
  //accessing post params
    req.body
  */
  res.send(response);
});


app.post('/api/v1/receiveMessage', function(req, res){
  /*
  service code here
  //accessing post params
    req.body
  */
  var resp = new twilio.TwimlResponse();
  var phoneNumber = req.body.From
  parseBackend.find('client_map', {where: {ph_num: phoneNumber}, limit: 1}, function (err, response) {
    if(!err) {
      var results = response.results;
      if(results.length === 0) {
        parseBackend.
      }
      var parseObject = response.results[0]
      if(typeof parseObject === 'undefined') {
        throw new Error('The unique_id ' + uniqueId + ' could not be found.')
      }
      var phoneNumber = ("+1" + parseObject.ph_num)
      delete parseObject
      client.twilio.sendMessage({
          to: phoneNumber,
          from: '+19783636041',
          body: smsMessage
      }, function(err, responseData) {
          if (!err) {
            res.send("success");
          } else {
            throw new Error('There was an issue sending the message to the client.')
          }
      });
    } else {
      throw new Error('The unique_id ' + uniqueId + ' could not be found.')
    }
  });

  resp.sms('hello world')
  console.log(req.body)
  console.log(resp)
  console.log(Object.keys(resp))
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(resp.toString());
  // res.end(resp);
});



app.use(express.static(__dirname + '/public'));

app.listen(process.env.PORT || 3000);
