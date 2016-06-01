/*
 *  Copyright 2016 DS-Cubed
 *
 *  Authored by Sam Mills (Henchman) <sam.mills@hench.space>
 *
 *  Project: dermdb https://dermdb.github.io
 */

var mysql = require('../../interfaces/mysql.js');
var bcrypt = require('bcryptjs');

//Login route
module.exports = function(req, res, next){

    //If user is NOT logged in
    if (res.locals.user === null) {

        //Ensure all required fields are present
        if (typeof req.body !== "undefined" && typeof req.body.password !== "undefined" && req.body.email !== "undefined") {

            //Form select query
            var q = "SELECT * FROM local_accounts WHERE email = " + mysql.escape(req.body.email);

            //Select account by email
            mysql.query(q, function (err, result) {
                if (err) {
                    next(err);
                } else if (typeof result[0] !== "undefined" && result.length === 1) {

                    //Compare password with hash in database
                    bcrypt.compare(req.body.password, result[0].password, function (err, r) {
                        if (err) {
                            next(err);
                        } else if (!r) {

                            //Respond anonymous error if password cannot be compared
                            res.locals.package.sendError("requestError", 401, {
                                message: "Incorrect username or password"
                            }, res);

                        } else {
                            //Set User ID
                            res.locals.package.setId(result[0].user_id);

                            //Set cookie and login
                            res.locals.package.setCookie(res);
                        }
                    });
                } else {

                    //Respond for bad credentials
                    res.locals.package.sendError("requestError", 401, {
                        message: "Incorrect Username Or Password"
                    }, res);
                }
            });
        } else {

            //Respond for bad credentials
            res.locals.package.sendError("requestError", 401, {
                message: "Incorrect username or password"
            }, res);
        }
    } else {

        //Respond for already logged in user
        res.locals.package.sendError("requestError", 403, {
            message: "Already Authenticated"
        }, res);
    }
};