/*
 *  Copyright 2016 DS-Cubed
 *
 *  Authored by Sam Mills (Henchman) <sam.mills@hench.space>
 *
 *  Project: dermdb https://dermdb.github.io
 */

//Format User
var jwt = require('jsonwebtoken');
var config = require('auto-config');
var mysql = require('../../interfaces/mysql');

//TODO: Cache this data in Redis first
module.exports = function(req, res, next){

    //Read and verify cookie with salt
    jwt.verify(req.cookies.dermdb, config.jwt.salt, function(err, decoded) {
        if (err){

            //Clear cookie if error
            res.clearCookie("dermdb");
            res.locals.user = null;
            next();

        } else {

            //Read database for user information
            mysql.query("SELECT * FROM users WHERE id = " + mysql.escape(decoded.user.id), function (err, result) {
                if (err) {

                    //Err on clearing cookie to prevent improper access, even if server fault!
                    res.clearCookie("dermdb");
                    next(err);
                } else if (typeof result[0] !== "undefined") {

                    //Formulate user object
                    res.locals.user = result[0];
                    next();
                } else {

                    //Formulate blank user
                    res.clearCookie("dermdb");
                    res.locals.user = null;
                    next();
                }
            });
        }
    });
};