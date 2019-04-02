require('dotenv').config()

var express = require('express')
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
// var busboy = require('connect-busboy');

var app = express();
app.use(cookieParser());
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(busboy());

var router = express.Router();
var routes = require('./routes/index.js')

app.use(routes(router));

app.listen(process.env.PORT);