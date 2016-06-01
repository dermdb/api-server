/*
 *  Copyright 2016 DS-Cubed
 *
 *  Authored by Sam Mills (Henchman) <sam.mills@hench.space>
 *
 *  Project: dermdb https://dermdb.github.io
 */

var express = require('express');
var router = express.Router();

/* - - - - - Available Routes - - - - - */

//Login
var login = require('./login.js');
router.use("/login", login);

//Create Account
var create = require('./create.js');
router.use("/create", create);

//Ensure Authenticated
var isAuthed = require('../../middleware/auth/isAuthed.js');
router.use(isAuthed);

/* - - - - - Protected Routes - - - - - */

//Logout
var logout = require('./logout.js');
router.use("/logout", logout);

//Verify Email
var verify = require('./verify.js');
router.use("/verify", verify);



module.exports = router;
