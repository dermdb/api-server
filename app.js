/*
 *  Copyright 2016 DS-Cubed
 *
 *  Authored by Sam Mills (Henchman) <sam.mills@hench.space>
 *
 *  Project: dermdb https://dermdb.github.io
 */

var express = require('express');
var logger = require('jethro');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var Package = require('./middleware/package/index.js');
var routes = require('./routes/index');

var app = express();

//Set express to use logger module
app.use(logger.express);

//Auto parse body for json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Parse cookie
app.use(cookieParser());

//Response Packet
app.use(function(req, res, next){
    //Create response packet former instance
    res.locals.package = new Package();
    next();
});

//Format user object
var format = require('./middleware/auth/format.js');

//Format user data
app.use(format);

//All Routes
app.use(routes);

//Catch 404 errors
app.use(function(req, res, next) {
    res.status(404);
    res.locals.package.sendError("requestError", 404, {
        message: "Not Found",
        url: req.url
    }, res);
});

//Error response handler
app.use(function(err, req, res, next) {
    console.error(err.stack);
    var data = res.locals.package.returnError(err);
    res.status(data.code);
    res.json(data);
});


module.exports = app;
