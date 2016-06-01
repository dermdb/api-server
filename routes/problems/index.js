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
    var q = "INSERT INTO problems (uid, type, description) VALUES (" + mysql.escape(res.locals.user.id);
    var v =  ", " + mysql.escape(req.body.type) + ", " + mysql.escape(req.body.description) + ")";
    if (typeof req.body.type !== "undefined" && typeof req.body.description !== "undefined"){
        mysql.query(q + v, function(err, result){
            if (err){
                next(err);
            } else {

                //Response
                var data = {id:result.insertId};
                res.send(res.locals.package.returnData(data));
            }
        })
    } else {
        var e = new Error("Missing Parameters");
        next(e);
    }
});

module.exports = router;
