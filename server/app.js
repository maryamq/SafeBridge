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
  getPhoneHash, generatePhoneHash, getPhoneFromHash, hashCode;

  // Initialize Parse
  Parse.initialize(appId, jsKey);

  // Returns phone hash code from the db.
  getPhoneHash = function(phone_num, onSuccess) {
    var query = new Parse.Query(Client_Map);
    query.equalTo("ph_num", phone_num);
    var phone_code = "";
    query.find().then(function(result){
      if (result && result.length  > 0) {
        phone_code = result[0].attributes.uq_code;
        onSuccess(phone_code);
      } else {
        onSuccess("");
      }
    });
  };

  // Returns phone hash code from the db.
  getPhoneFromHash = function(phone_hash, onSuccess) {
    var query = new Parse.Query(Client_Map);
    query.equalTo("uq_code", phone_hash);
    var phone_code = "";
    query.find().then(function(result){
      if (result && result.length  > 0) {
        phone_num = result[0].attributes.ph_num;
        onSuccess(phone_num);
      } else {
        onSuccess("");
      }
    });
  };

  // Generate hash code for the phone num and stores in db
  generatePhoneHash = function(phone_num, onSuccess) {
    var hash = hashCode(phone_num);
    var new_client = new Client_Map();
    new_client.set("ph_num" , phone_num);
    new_client.set("uq_code", hash + "");
    new_client.save(null, {
      success: function(new_client) {
        // Execute any logic that should take place after the object is saved.
        onSuccess(new_client.id);
        console.log('New object created with objectId: ' + new_client.id);
      },
      error: function(new_client, error) {
        // Execute any logic that should take place if the save fails.
        // error is a Parse.Error with an error code and message.
        onSuccess("");
        console.log('Failed to create new object, with error code: ' + error.message);
      }
    });
  };

  hashCode = function(str) {
    var hash = 0, i, chr, len;
    if (str.length == 0) return hash;
    for (i = 0, len = str.length; i < len; i++) {
      chr   = str.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  }
  
  return {
    getPhoneHash : getPhoneHash,
    generatePhoneHash: generatePhoneHash,
    getPhoneFromHash: getPhoneFromHash
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
  client.parse.getPhoneFromHash("abc", function(value) {
    console.log("success " + value);
  })
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
