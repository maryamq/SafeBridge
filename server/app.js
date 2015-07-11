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
 

app.post('/api/v1/sendMessage', function(req, res){
  /*
  service code here
  //accessing get params
    req.params.id
  */

  var chat_id = req.body.chat_id;  // id of the session
  var message = req.body.message;

  console.log("chat id")
  console.log(chat_id)
  console.log("message")
  console.log(message)

  if (typeof(chat_id) === "undefined") {
  throw new Error("Error: No existing chat_id")
}
if (typeof(message) === "undefined") {
  throw new Error("Error: No existing message")
}

  // look up the receiver chat id.

  var response = "chat id = " + chat_id + " and message = " + message;
  //client.twilio.sendMessage("+16502379529", "This is Maryam!");

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
