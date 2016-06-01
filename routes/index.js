/*
 *  Copyright 2016 DS-Cubed
 *
 *  Authored by Sam Mills (Henchman) <sam.mills@hench.space>
 *
 *  Project: dermdb https://dermdb.github.io
 */

var express = require('express');
var router = express.Router();
var config = require('auto-config');

// Get Home Route
router.get('/', function(req, res, next) {
    res.locals.package.sendData(res, {
        name: config.package.name,
        version: config.package.version
    });
});

//Auth Routes
var auth = require('./auth/index.js');
router.use("/auth", auth);

//Ensure Authenticated
var isAuthed = require('../middleware/auth/isAuthed.js');
router.use(isAuthed);

//Users
var images = require("./images/index.js");
router.use("/images", images);

//Users
var problems = require("./problems/index.js");
router.use("/problems", problems);

//Users
var snapshots = require("./snapshots/index.js");
router.use("/snapshots", snapshots);

//Users
var users = require("./users/index.js");
router.use("/users", users);

module.exports = router;
