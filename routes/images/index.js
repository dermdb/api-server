/*
 *  Copyright 2016 DS-Cubed
 *
 *  Authored by Sam Mills (Henchman) <sam.mills@hench.space>
 *
 *  Project: dermdb https://dermdb.github.io
 */

var express = require('express');
var router = express.Router();
var mysql = require("../../interfaces/mysql.js");

var multer  = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        console.log(file);
        mysql.query("SELECT * FROM snapshots WHERE sid = ")
        callback(null, __dirname + "/public/" + req.body.pid + "/" + req.body.sid);
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now());
    }
});
var upload = multer({ storage : storage}).any();

router.post('/',function(req,res){
    upload(req,res,function(err) {
        if(err) {
            console.error(err);
            return res.end("Error uploading file.");
        }
        res.end("File is uploaded");
    });
});

module.exports = router;