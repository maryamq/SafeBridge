var express = require('express');
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var client = {}
client.twilio = (function() {
  // Twilio Credentials 
  var accountSid = 'ACdcc50e6ed99e769207278222342aa797',
      authToken = '277681ba07d0f8080b668c93a4850aa6',
      fromPhone =  '+16506812302',
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
<<<<<<< HEAD
  var response = "hello world2";
  client.twilio.sendMessage("+14084891405", "This is Maryam!");
=======
  var chat_id = req.param.chat_id;  // id of the session
  var message = req.param.message;

  // look up the receiver chat id.

  var response = "hello world";
  //client.twilio.sendMessage("+16502379529", "This is Maryam!");
>>>>>>> 90deff1f413d9fa65f6d44e750ceefd7265d9b36
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
