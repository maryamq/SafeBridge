var express = require('express');
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/api/v1/serviceName', function(req, res){
  /*
  service code here
  //accessing get params
    req.params.id
  */
  var response = {"status": "Ok"};
  res.send(response);
});

app.post('/api/v1/serviceName', function(req, res){
  /*
  service code here
  //accessing post params
    req.body
  */
  var response = {"status": "Ok"};
  res.send(response);
});

app.use(express.static(__dirname + '/public'));

app.listen(process.env.PORT || 3000);
