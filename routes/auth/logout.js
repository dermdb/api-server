/*
 *  Copyright 2016 DS-Cubed
 *
 *  Authored by Sam Mills (Henchman) <sam.mills@hench.space>
 *
 *  Project: dermdb https://dermdb.github.io
 */

//Logout route
module.exports = function(req, res, next){

    //Invalidate cookie
    res.clearCookie("dermdb");

    //Respond with success
    res.locals.package.sendData(res, {
        message:"Logged Out"
    });
};