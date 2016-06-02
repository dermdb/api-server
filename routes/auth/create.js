/*
 *  Copyright 2016 DS-Cubed
 *
 *  Authored by Sam Mills (Henchman) <sam.mills@hench.space>
 *
 *  Project: dermdb https://dermdb.github.io
 */

var logger = require('jethro');
var bcrypt = require('bcryptjs');
var uuid = require('uuid-v4');
var config = require('auto-config');

var mysql = require("../../interfaces/mysql.js");

var check = {
    email: require('../../lib/validity/email'),
    password: require('../../lib/validity/password'),
    username: require('../../lib/validity/username')
};


//TODO: Rewrite and comment this mess :)
module.exports = function(req, res, next){
    if (res.locals.user === null){
        var b = req.body;
        req.body = null;
        if (typeof b.confirmPassword !== "undefined" && typeof b.password !== "undefined" && typeof b.email !== "undefined" && typeof b.firstName !== "undefined" && typeof b.lastName !== "undefined") {
            if (b.password === b.confirmPassword) {

                //Email Check
                var eCheck = check.email(b.email);
                logger("debug", "Validity", "Email: " + eCheck);

                //Password Check
                var pCheck = check.password(b.password);
                logger("debug", "Validity", "Password: " + pCheck);

                var fnCheck = check.username(b.firstName);
                var lnCheck = check.username(b.lastName);

                if (eCheck !== true) {
                    if (eCheck === false) {
                        eCheck = 'This is not a valid email';
                    }
                    return res.locals.package.sendError("requestError", 422, {
                        message: "Invalid Email",
                        reason: eCheck
                    }, res);
                } else if (pCheck !== true) {
                    return res.locals.package.sendError("requestError", 422, {
                        message: "Invalid Password",
                        reason: pCheck
                    }, res);
                } else if (fnCheck !== true) {
                    return res.locals.package.sendError("requestError", 422, {
                        message: "Invalid Name",
                        reason: "First " + fnCheck
                    }, res);
                } else if (lnCheck !== true) {
                    return res.locals.package.sendError("requestError", 422, {
                        message: "Invalid Name",
                        reason: "Last " + lnCheck
                    }, res);
                } else {
                    var email = mysql.escape(b.email);
                    logger("debug", "Bcrypt", "Creating salt...");
                    bcrypt.genSalt(12, function (err, salt) {
                        logger("debug", "Bcrypt", "Salt: " + salt);
                        logger("debug", "Bcrypt", "Hashing password...");
                        bcrypt.hash(b.password, salt, function (err, hash) {
                            logger("debug", "Bcrypt", "Hash: " + hash);
                            var vc = mysql.escape(uuid());
                            var ID = uuid();
                            var id = mysql.escape(ID);
                            var f = mysql.escape(b.firstName);
                            var l = mysql.escape(b.lastName);
                            mysql.query("INSERT INTO users (id, first_name, last_name) VALUES (" + id + ", " + f + ", " + l + ")", function (err, result) {
                                if (err) {
                                    next(err);
                                } else {
                                    var q = "INSERT INTO local_accounts (user_id, email, password, verification_code) VALUES (" + id + ", " + email + ", '" + hash + "'," + vc + ")";
                                    logger("transport", "MySQL", q);
                                    mysql.query(q, function (err) {
                                        if (err && err.code !== "ER_DUP_ENTRY") {
                                            next(err);
                                        } else if (err && err.code === "ER_DUP_ENTRY") {
                                            return res.locals.package.sendError("requestError", 409, {
                                                message: "Email Taken",
                                                reason: "User with this email already exists"
                                            }, res);
                                        } else {

                                            //Set User ID
                                            res.locals.package.setId(ID);

                                            //Set cookie and login
                                            res.locals.package.setCookie(res);
                                        }
                                    });
                                }
                            });
                        });
                    });
                }
            } else {
                res.locals.package.sendError("requestError", 422, {
                    message: "Invalid Password",
                    reason: "Password and confirmation mismatch"
                }, res);
            }
        } else {
            res.locals.package.sendError("requestError", 400, {
                message: "Missing Parameters"
            }, res);
        }
    } else {
        res.locals.package.sendError("requestError", 403, {
            message: "Already Authenticated"
        }, res);
    }
};