var fs = require('fs');
var http = require('http');
var https = require('https');

var express = require('express');
var load = require('express-load');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');

var error = require('./middlewares/error');

var privateKey = fs.readFileSync('cert.key', 'utf-8');
var certificate = fs.readFileSync('cert.crt', 'utf-8');
var credential = {key: privateKey, cert: certificate};

app = express();

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credential, app);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(cookieParser('pegalog'));
app.use(expressSession());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'));

load('models')
  .then('controllers')
  .then('routes')
  .into(app);

//middlewares
app.use(error.notFound);
app.use(error.serverError);

var configFile = fs.readFileSync("config.json");
global.appConfig = JSON.parse(configFile);

httpsServer.listen(appConfig.port, function () {
  console.log("Server https no ar.");
}); 