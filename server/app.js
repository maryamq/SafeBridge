var express        = require('express');
var app            = express();
var bodyParser     = require("body-parser");
var NodeParse      = require('node-parse-api').Parse;
var Parse          = require('parse').Parse;
var twilioResp     = require('twilio')


var options = {
    app_id: process.env.ParseAppID,
    api_key: process.env.ParseSecretKey
}

var parseBackend = new NodeParse(options);

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
  Conversation  = Parse.Object.extend("conversation"),
  getPhoneHash, generatePhoneHash, getPhoneFromHash, hashCode,
  saveConversation, endConversation, getConversation, claimConversation,
  createConversation, getAllNewConversation;

  // Initialize Parse
  Parse.initialize(appId, jsKey);

  //***************** Convesation method *********************************
  saveConversation = function(advisor_id, session_id, message, onSuccess) {
    var new_conv_entry = new Conversation();
    new_conv_entry.set("advisor_id", advisor_id);
    new_conv_entry.set("session_id", session_id);
    new_conv_entry.set("uq_code", session_id);
    new_conv_entry.set("msg", message);

    new_conv_entry.save(null, {
      success: function(new_row) {
        // Execute any logic that should take place after the object is saved.
        if (onSuccess) {
          onSuccess(new_row.id);
        }
        
        console.log('New object created with objectId: ' + new_row.id);
      },
      error: function(new_row, error) {
        // Execute any logic that should take place if the save fails.
        // error is a Parse.Error with an error code and message.
        console.log('Failed to create new object, with error code: ' + error.message);
        if (onSuccess) {
          onSuccess("");
        }
        
      }
    });
  };

  getConversation = function(session_id, onSuccess) {
     var new_conv_entry = new Parse.Query(Conversation);
     new_conv_entry.equalTo("session_id", session_id);
     new_conv_entry.find().then(function(result){
         onSuccess(result);
     });
  };

  createConversation = function(session_id, smsMessage, onSuccess) {
    saveConversation(null, session_id, smsMessage, function(blank) {
      getConversation(session_id, function(conversationResp) {
        onSuccess(conversationResp)
      });
    });
  };

getAllNewConversation = function(onSuccess) {
     var new_conv_entry = new Parse.Query(Conversation);
     new_conv_entry.doesNotExist("advisor_id");
     new_conv_entry.find().then(function(result){
         onSuccess(result);
     });
  };




  claimConversation = function(session_id, a_id) {
    var query = new Parse.Query(Conversation);
     console.log("session _id" + session_id + "a_id " + a_id);
     query.equalTo("session_id", session_id);
     query.find().then(function(results){
      for(var i = 0; i<results.length; i++) {
         var new_conv_entry = results[i];
         console.log("entry " + new_conv_entry.message);
         new_conv_entry.set("advisor_id", a_id);
         new_conv_entry.set("session_id", session_id);
         new_conv_entry.set("uq_code", session_id);
         new_conv_entry.set("session_status", true);
         new_conv_entry.save();
      }
    });
  };
  
  endConversation = function(session_id) {
    var query = new Parse.Query(Conversation);
    query.equalTo("session_id", session_id);
    query.find().then(function(results){
      console.log("results " + results);
      for(var i = 0; i<results.length; i++) {
         results[i].destroy({});
      }
    });
  };
  

  // *********************** PHone Hash Methods **********************/
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
    getPhoneFromHash: getPhoneFromHash,
    saveConversation: saveConversation,
    endConversation: endConversation,
    getConversation: getConversation,
    claimConversation: claimConversation,
    createConversation: createConversation,
    getAllNewConversation: getAllNewConversation
  };


}());


app.get('/api/v1/test', function(req, res){
   var session_id = "abc";
   client.parse.getConversation(session_id, function(result) {
      for(var i = 0; i<result.length; i++) {
        console.log(result[i]);
      }
   });
   res.send("Hello World")

});


app.get('/api/v1/getAllNewConversation', function(req, res){
   //var session_id = "abc";
   console.log("1");
   client.parse.getAllNewConversation(function(result) {
     res.send(result);
   });
});


app.get('/api/v1/claimConversation/:session_id/:advisor_id', function(req, res){
   var session_id = req.params.session_id;
   var advisor_id = req.params.advisor_id;
   client.parse.claimConversation(session_id, advisor_id);
   res.send("Success " + session_id);
});


app.post('/api/v1/sendMessage', function(req, res){
  var a_id = req.param.advisor_id;  // advisor id
  var session_id = req.param.session_id;
  var message = req.param.message;

  // Look up phone has via session Id.
  client.parse.getPhoneFromHash(session_id, function(phone_num) {
    if (phone_num == "") {
      console.log("GetPhoneFromHash returned empty phone_num. Should not be the case");
      return;
    }
    client.parse.saveConversation(a_id, session_id, message);
    client.twilio.sendMessage(phone_num, message);
  });
  res.send("Success");
});


app.get('/api/v1/getConversation', function(req, res){
  var session_id = req.param.session_id;
  client.parse.getConversation(session_id, function(result) {
    res.send(result);
  });
});


app.get('/api/v1/endConversation/:session_id', function(req, res){
  var s_id = req.params.session_id;
  client.parse.endConversation(s_id);
  res.send("End Conversation Done: " + s_id);
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
  var twiml = new twilioResp.TwimlResponse();
  var phoneNumber = req.body.From;
  var smsMessage = req.body.Body;
  client.parse.getPhoneHash(phoneNumber, function(phoneHash) {  
    if(phoneHash === '') {
      client.parse.generatePhoneHash(phoneNumber, function(phoneHash){
        twiml.sms('Thank you for reaching out to us! We are rapidly matching you with a community advocate. We will respond within 3 minutes. Until then, please read the following information so you understand your rights as a member of our community.')
        client.parse.createConversation(phoneHash, smsMessage, function(conversationResp) {
          res.writeHead(200, {'Content-Type': 'text/xml'});
          res.end(twiml.toString());
        })
      });
    } else {
      client.parse.getConversation(phoneHash, function(conversationResp) {
        if(conversationResp.length === 0) {
          client.parse.createConversation(phoneHash, smsMessage, function(conversationResp) {
            res.writeHead(200, {'Content-Type': 'text/xml'});
            res.end(twiml.toString());
          })
        } else {
          res.writeHead(200, {'Content-Type': 'text/xml'});
          res.end(twiml.toString());
        }
      });
    }
  })
});


app.use(express.static(__dirname + '/public'));

app.listen(process.env.PORT || 4000);
