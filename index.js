// require
var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var path = require('path');
var router = require('./router')


// package
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(router);


app.listen(3000);
