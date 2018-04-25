// server.js
// where your node app starts
// init project
var express = require('express');
var app = express();
const ejs = require('ejs');
const mongodb = require('mongodb');
//We need to work with "MongoClient" interface in order to connect to a mongodb server.
const MongoClient = mongodb.MongoClient;
const debug = require('debug');
const morgan = require('morgan');
// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

app.set('views', './src/views');
app.set('view engine', 'ejs');
app.set('json spaces', 2);

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));
app.use(morgan('dev'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.render('index');
});

app.get('/shorten', function(req, res) {
  function isValidURL(str) {
    var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
    if(!regex .test(str)) {
      return false;
      res.send('false');
    } else {
      return true;
    }
    }
  const query = req.query;
  
  if(isValidURL(query.dream)) {
    console.log('Here');
    // Connection URL. This is where your mongodb server is running.
    const url = 'mongodb://SiddharthIITG:siddharth@ds157089.mlab.com:57089/short_url_db';
    const dbName = 'short_url_db';
    // Use connect method to connect to the Server
    (async function mongo() {
        let client;
        try {
          client = await MongoClient.connect(url);
          debug('Connected correctly to server');

          const db = client.db(dbName);
          // var dbCount = db.collection('urls').count();
          
          const a = async function countDocs(){
            try {
              var dbCount = await db.collection('urls').count();

            } catch (err1) {
              debug(err1.stack);
          }
          var jsonObj = {url: query.dream, short_url: 'https://abrasive-reaction.glitch.me/' + (dbCount + 1).toString()};
          const response = await db.collection('urls').insertOne(jsonObj);
          res.render(
            'shortUrlRender', 
            {
              jsonObj: JSON.stringify(jsonObj, null, 2)
            }
          ) 
          }
          await a();
          // db.close();
        } catch (err) {
          debug(err.stack);
        }

        client.close();
      }());
  }
  // res.send(query.dream);
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
