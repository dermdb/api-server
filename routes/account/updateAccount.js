/*
 *  Copyright 2016 DS-Cubed
 *
 *  Authored by Sam Mills (Henchman) <sam.mills@hench.space>
 *
 *  Project: dermdb https://dermdb.github.io
 */

var mysql = require('../../interfaces/mysql.js');

module.exports = function(req, res, next){
    if (res.locals.user !== null){
        var q = "REPLACE INTO users (id, gender, country, dob_year, eye_colour, skin_tone) VALUES (" + res.locals.user.id + ", ";

        //Values
        if (typeof req.body.gender !== "undefined"){
            q += mysql.escape(req.body.gender) + ", ";
        } else {
            q += "NULL, "
        }

        if (typeof req.body.country !== "undefined"){
            q += mysql.escape(req.body.country) + ", ";
        } else {
            q += "NULL, "
        }

        if (typeof req.body.year !== "undefined"){
            q += mysql.escape(req.body.year) + ", ";
        } else {
            q += "NULL, "
        }

        if (typeof req.body.eye_colour !== "undefined"){
            q += mysql.escape(req.body.eye_colour) + ", ";
        } else {
            q += "NULL, "
        }

        if (typeof req.body.skin_tone !== "undefined"){
            q += mysql.escape(req.body.skin_tone) + ")";
        } else {
            q += "NULL)";
        }

        console.log(q);
        mysql.query(q, function(err, result){
            if (err){
                console.log(err);
                next(err);
            } else {
                console.log("Success");
                res.locals.package.sendData(res, {id:res.locals.user.id});
            }
        });
    } else {
        res.locals.package.sendError("requestError", 401, {
            message: "Not Authenticated"
        }, res);
    }
};