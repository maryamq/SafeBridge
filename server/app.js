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
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

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
  Advisor  = Parse.Object.extend("advisor"),
  getPhoneHash, generatePhoneHash, getPhoneFromHash, hashCode,
  saveConversation, endConversation, getConversation, claimConversation,
  createConversation, getAllNewConversation, getSingleConversation,
  getConversationAfterDate, getAllConversationsForAdvisor,
  getAdvisor, updateAdvisorAvailability;

  // Initialize Parse
  Parse.initialize(appId, jsKey);

  getAdvisor = function(advisor_id, onSuccess) {
     var query = new Parse.Query(Advisor);
     query.equalTo("user_name", advisor_id);
     query.find().then(function(result){
         onSuccess(result);
     });
  }

  updateAdvisorAvailability = function(advisor_id, available) {
    getAdvisor(advisor_id, function(result) {
         if (!result) {
          return;
         }
         var advisor = result[0];
         advisor.set("available", available);
         advisor.save(null, {
        success: function(new_row) {
          console.log('New object created with objectId: ' + new_row.id);
        },
        error: function(new_row, error) {
          console.log('Failed to create new object, with error code: ' + error.message);
        }
    });
    });
  };

  //***************** Convesation method *********************************
  saveConversation = function(advisor_id, session_id, message, is_client, onSuccess) {
    var new_conv_entry = new Conversation();
    new_conv_entry.set("advisor_id", advisor_id);
    new_conv_entry.set("session_id", session_id);
    new_conv_entry.set("uq_code", session_id);
    new_conv_entry.set("msg", message);
    new_conv_entry.set("is_client", is_client);

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

  getSingleConversation = function(session_id, onSuccess) {
     var new_conv_entry = new Parse.Query(Conversation);
     new_conv_entry.equalTo("session_id", session_id);
     new_conv_entry.first().then(function(result){
         onSuccess(result);
     });
  };

  getConversationAfterDate = function(session_id, date, onSuccess) {
    var query = new Parse.Query(Conversation);
    query.equalTo("session_id", session_id);
    query.greaterThanOrEqualTo( "createdAt", date);
    query.find().then(function(result) {
      onSuccess(result);
    });
  }

  createConversation = function(session_id, smsMessage, is_client, onSuccess) {
    saveConversation(undefined, session_id, smsMessage, is_client, function(blank) {
      getConversation(session_id, function(conversationResp) {
        onSuccess(conversationResp);
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

  getAllConversationsForAdvisor = function(advisor_id, onSuccess) {
      var query = new Parse.Query(Conversation);
      query.equalTo("advisor_id", advisor_id);
      query.find().then(function(result) {
        onSuccess(result);
      });
  }


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
        onSuccess(hash);
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
  };

  return {
    getPhoneHash : getPhoneHash,
    generatePhoneHash: generatePhoneHash,
    getPhoneFromHash: getPhoneFromHash,
    saveConversation: saveConversation,
    endConversation: endConversation,
    getConversation: getConversation,
    claimConversation: claimConversation,
    createConversation: createConversation,
    getAllNewConversation: getAllNewConversation,
    getSingleConversation: getSingleConversation,
    getConversationAfterDate: getConversationAfterDate,
    getAllConversationsForAdvisor: getAllConversationsForAdvisor,
    getAdvisor: getAdvisor,
    updateAdvisorAvailability: updateAdvisorAvailability

  }
}());


app.get('/api/v1/test', function(req, res){
   var session_id = "abc";
   client.twilio.sendMessage(session_id, message);
   

});


app.get('/api/v1/getAllNewConversation', function(req, res){
   //var session_id = "abc";
   console.log("1");
   client.parse.getAllNewConversation(function(result) {
     res.send(result);
   });
});

app.get('/api/v1/getConversationAfterDate/:session_id/:date', function(req, res){
   var session_id = req.params.session_id;
   var date = req.params.date;
   console.log("1");
   client.parse.getConversationAfterDate(session_id, new Date(date), function(result) {
     res.send(result);
   });
});

app.get('/api/v1/getUniqueConversation/:advisor_id', function(req, res){
   var advisor_id = req.params.advisor_id;
   var unique = {};
   client.parse.getAllConversationsForAdvisor(advisor_id, function(result) {
       var unique = {};
       for (var i =0; i<result.length; i++) {
           var key = result[i].attributes.session_id;
           unique[key] = result[i];
       }

       var arr = [];
       for (var k in unique){
         arr.push(unique[k]);
       }

       res.send(arr);   
   });
});

app.get('/api/v1/claimConversation/:session_id/:advisor_id', function(req, res){
   var session_id = req.params.session_id;
   var advisor_id = req.params.advisor_id;
   client.parse.claimConversation(session_id, advisor_id);
   res.send("Success " + session_id);
});


//app.post('/api/v1/sendMessage/:session_id/:advisor_id/:message', function(req, res){
app.post('/api/v1/sendMessage', function(req, res){
  var a_id = req.body.advisor_id;  // advisor id
  var session_id = req.body.session_id;
  var message = req.body.message;

  // Look up phone has via session Id.
  client.parse.getPhoneFromHash(session_id, function(phone_num) {
    if (phone_num == "") {
      console.log("GetPhoneFromHash returned empty phone_num. Should not be the case");
      return;
    }
    client.parse.saveConversation(a_id, session_id, message, false);
    client.twilio.sendMessage(phone_num, message);
  });
  res.send("Success");
});

app.get('/api/v1/getConversation/:session_id', function(req, res){
  var session_id = req.params.session_id;
  client.parse.getConversation(session_id, function(result) {
    res.send(result);
  });
});


app.get('/api/v1/endConversation/:session_id', function(req, res){
  var s_id = req.params.session_id;
  client.parse.endConversation(s_id);
  res.send("End Conversation Done: " + s_id);
});

app.get('/api/v1/getAdvisor/:advisor_id', function(req, res){
  var a_id = req.params.advisor_id;
  client.parse.getAdvisor(a_id, function(result) {
    res.send(result);
  });
  });

app.get('/api/v1/updateAdvisorAvailability/:advisor_id/:available', function(req, res){
    var a_id = req.params.advisor_id;
    var available = req.params.available == "true";
    client.parse.updateAdvisorAvailability(a_id, available);
    res.send("Done");
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
        console.log("New phone has that was generated " + phoneHash )
        twiml.sms('Thank you for reaching out to The Sanctuary San Francisco. We are pairing you with a community advocate and we will have one connected with you within 10 minutes. \n\nUntil then, please read the following information so you understand your rights as a member of our community.')
        // twiml.pause({length: 10})
        // twiml.sms('Until then, please read the following information so you understand your rights as a member of our community.')
        twiml.sms('If you are in immediate danger, PLEASE call local police immediately at 911.')
        twiml.sms('If there is any chance the your phone is being monitored by spyware, do not continue! Find a safe phone to contact us. To learn more about spyware, please visit the webpage http://bit.ly/1K2tAes.')
        twiml.sms('We are here to support you. Please know that in the State of California, you have privacy priviledges that are afforded between you and your counselor. However, in we may have to disclose this information in a criminal proceeding regarding a crime allegedly perpetrated against the yourself or another household member, or in a proceeding related to child abuse. \n\nWe are here to support you and are happy to answer any questions you may have. We will respond very shortly!')
        client.parse.createConversation(phoneHash, smsMessage, true, function(conversationResp) {
          res.writeHead(200, {'Content-Type': 'text/xml'});
          res.end(twiml.toString());
        })
      });
    } else {
      client.parse.getSingleConversation(phoneHash, function(conversationResp) {
        if(typeof conversationResp === 'undefined') {
          client.parse.createConversation(phoneHash, smsMessage, true, function(conversationResp) {
            res.writeHead(200, {'Content-Type': 'text/xml'});
            res.end(twiml.toString());
          })
        } else {
          var attributes = conversationResp.attributes || {}
          var advisorId = attributes.advisor_id ||  undefined
          client.parse.saveConversation(advisorId, phoneHash, smsMessage, true, function(blank) {
            res.writeHead(200, {'Content-Type': 'text/xml'});
            res.end(twiml.toString());
          })
        }
      });
    }
  })
});


app.use(express.static(__dirname + '/public'));

app.listen(process.env.PORT || 2000);
