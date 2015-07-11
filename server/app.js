var express = require('express');
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var client = {}
client.twilio = (function() {
  // Twilio Credentials 
  var accountSid = process.env.twilioSid,
      authToken = process.env.twilioToken,
      fromPhone =  '+19783636041',
      twilio = require('twilio')(accountSid, authToken),
      sendMessage, init;


  sendMessage = function(toPhone, message) {
    twilio.messages.create({
      from: fromPhone,  
      to: toPhone,
      body: message
    });
  };
  
  return {
    sendMessage : sendMessage
  };

}());
 

app.get('/api/v1/sendMessage', function(req, res){
  /*
  service code here
  //accessing get params
    req.params.id
  */
  var chat_id = req.param.chat_id;  // id of the session
  var message = req.param.message;

  // look up the receiver chat id.

  var response = "hello world";
  client.twilio.sendMessage("+16039186391", "This is Maryam!");
  res.send(response);
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
