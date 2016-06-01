/*
 *  Copyright 2016 DS-Cubed
 *
 *  Authored by Sam Mills (Henchman) <sam.mills@hench.space>
 *
 *  Project: dermdb https://dermdb.github.io
 */

var express = require('express');
var router = express.Router();
var mysql = require('../../interfaces/mysql');

router.post("/", function(req, res, next){
    console.log(req.body);
    if (typeof req.body.description !== "undefined" && typeof req.body.pid !== "undefined") {
        var q = "INSERT INTO snapshots (uid, pid, description) VALUES (" + mysql.escape(res.locals.user.id) + ", ";
        var v = mysql.escape(req.body.pid) + ", " + mysql.escape(req.body.description) + ")";
        mysql.query(q + v, function (err, result) {
            if (err) {
                next(err);
            } else {
                //Response
                res.locals.package.sendData(res, {
                    id: result.insertId
                });
            }
        })
    } else {
        var e = new Error("Missing Parameters");
        next(e);
    }
});

module.exports = router;