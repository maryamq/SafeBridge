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

app.post('/api/v1/sendMessage', function(req, res){
  /*
  service code here
  //accessing get params
    req.params.id
  */
  var uniqueId     = req.body.chat_id;  // id of the session
  var smsMessage   = req.body.message;

  if (typeof(chat_id) === "undefined") {
    throw new Error("Error: No existing chat_id")
  }
  if (typeof(message) === "undefined") {
    throw new Error("Error: No existing message")
  }

  parseBackend.find('client_map', {uq_code: uniqueId}, function (err, response) {
    if(!err) {
      var phoneNumber = ("+1" + response.ph_num)
      client.twilio.sendMessage({
          to: phoneNumber,
          from: '+19783636041',
          body: message
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



app.use(express.static(__dirname + '/public'));

app.listen(process.env.PORT || 3000);
