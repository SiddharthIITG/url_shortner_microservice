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
const url = require('url');
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


// this route gets the url request, checks whether it is a valid url. If yes, it creates a short_rl for it which redirects to the given url. 
app.get('/shorten', function(req, res) {
  //Checks for valid url. 
  function isValidURL(str) {
    var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
    if(!regex .test(str)) {
      return false;
      res.send('Invalid Url :(');
    } else {
      return true;
    }
    }
  const query = req.query;
  
  if(isValidURL(query.dream)) {
    console.log('Here');
    // Connection URL. This is where your mongodb server is running.
    const url_db = 'mongodb://SiddharthIITG:siddharth@ds157089.mlab.com:57089/short_url_db';
    const dbName = 'short_url_db';
    // Use connect method to connect to the Server
    (async function mongo() {
        let client;
        try {
          client = await MongoClient.connect(url_db);
          console.log('Connected correctly to server again');

          const db = client.db(dbName);
          const regexp = /\>(.*?)\</;
          
          const a = async function countDocs(){
            try {
              var dbCount = await db.collection('urls').count();

            } catch (err1) {
              debug(err1.stack);
          }
            //creating json object. 
          var jsonObj = {_id: (dbCount + 1).toString() ,url: query.dream, short_url: `<a href = ${(dbCount + 1).toString()}>` + 'https://abrasive-reaction.glitch.me/' + (dbCount + 1).toString() + '</a>'};
          jsonObj.cleanUrl = jsonObj.short_url.match(regexp)[1];
          const response = await db.collection('urls').insertOne(jsonObj);
          var jsonRender = {url: jsonObj.url, short_url: jsonObj.short_url};
            //rendering page with json object as parameter.
          res.render(
            'shortUrlRender', 
            {
              jsonObj: JSON.stringify(jsonRender, null, 2)
            }
          ) 
          }
          await a();
          db.close();
        } catch (err) {
          debug(err.stack);
        }
        client.close();
      }());
  }
});

app.route(/\d+/)
  .get(function (req, res) {
    const reqString = 'https://abrasive-reaction.glitch.me/' + url.parse(req.url).path.substring(1);
   // Connection URL. This is where your mongodb server is running.
    const url_db = 'mongodb://SiddharthIITG:siddharth@ds157089.mlab.com:57089/short_url_db';
    const dbName = 'short_url_db';
    // Use connect method to connect to the Server
    (async function mongo() {
        let client;
        try {
          client = await MongoClient.connect(url_db);
          console.log('Connected correctly to server');
          const db = client.db(dbName);
          const dbCount = await db.collection('urls').count();
          const document = await db.collection('urls').findOne({cleanUrl: reqString});
          res.redirect(document.url);
          
          // db.close();
        } catch (err) {
          debug(err.stack);
        }
        client.close();
      }());
  })

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
