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

var mysql = require('../../interfaces/mysql.js');

router.get("/:id", function(req, res, next){
    var id = req.params.id;

    //Select user where equal to id
    mysql.query("SELECT * FROM users WHERE id = " + mysql.escape(id), function(err, result){
        if (err){
            throw err;
        } else {

            //If user exists, respond with user object
            if (typeof result[0] !== "undefined" && result[0].id == id){

                //Send user object
                res.locals.package.sendData(res, result[0]);
            } else {

                //Respond if user is not found
                res.locals.package.sendError("requestError", 404, {
                    message: "User Not Found",
                    id: req.params.id
                }, res);
            }
        }
    })
});

module.exports = router;
