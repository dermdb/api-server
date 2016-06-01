/*
 *  Copyright 2016 DS-Cubed
 *
 *  Authored by Sam Mills (Henchman) <sam.mills@hench.space>
 *
 *  Project: dermdb https://dermdb.github.io
 */

var mysql = require("mysql");

/*
 *  Auto config https://github.com/HenchSpace/auto-config
 *
 *  This module loads all files in /config and adds them to its exports
 */

var config = require('auto-config');

//Creates a connection to the MySQL database
var connection = mysql.createPool({
    connectionLimit : 10,
    host     : config.mysql.host,
    user     : config.mysql.user,
    database : config.mysql.database,
    password : config.mysql.password
});

module.exports = connection;