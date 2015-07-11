var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var Parse = require('parse').Parse;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


var client = {}
client.twilio = (function() {
  // Twilio Credentials 
  var accountSid = 'AC92a0190d479907c672610b0433b6fcc8',
      authToken = '982761859812f01588900af41879a555',
      fromPhone =  '+16506812248',
      twilio = require('twilio')(accountSid, authToken),
      sendMessage;


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

client.parse = (function() {
  var appId = "EskNAzWggrRsCs2y0BFSEGUoHoNhzOASNFfqGVi9",
      jsKey = "2X5eB9njA4iVStOfhnk69y7kggwxJ6MCviEPQW2T",
      Client_Map  = Parse.Object.extend("client_map"),
      getPhoneHash;

  // Initialize Parse
  Parse.initialize(appId, jsKey);

  getPhoneHash = function(phone_num, onSuccess) {
    var query = new Parse.Query(Client_Map);
    query.equalTo("ph_num", phone_num);
    var phone_code = "";
    query.find().then(function(result){
        if (result && result.length  > 0) {
          phone_code = result[0].attributes.uq_code;
          onSuccess(phone_code);
        }
    });
  };

  return {
    getPhoneHash : getPhoneHash
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
  res.send(response)
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
