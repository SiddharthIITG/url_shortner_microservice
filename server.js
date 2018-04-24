// server.js
// where your node app starts
// init project
var express = require('express');
var app = express();
const ejs = require('ejs');
const mongodb = require('mongodb');
//We need to work with "MongoClient" interface in order to connect to a mongodb server.
const MongoClient = mongodb.MongoClient;


// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

app.set('views', './src/views');
app.set('view engine', 'ejs');

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.render('index');
});

app.get('/shorten', function(req, res) {
  function isValidURL(str) {
    var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
    if(!regex .test(str)) {
      return false;
    } else {
      return true;
    }
    }
  const query = req.query;
  if(isValidURL(query.dream)) {
    // Connection URL. This is where your mongodb server is running.
    const url = 'mongodb://SiddharthIITG:siddharth@ds157089.mlab.com:57089/short_url_db';

    // Use connect method to connect to the Server
    MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    } 
    else {
      console.log('Connection established to', url);
    // do some work here with the database.
    //Close connection
    db.close();
  }
});
  }
  res.send(query.dream);
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
