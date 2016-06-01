/*
 *  Copyright 2016 DS-Cubed
 *
 *  Authored by Sam Mills (Henchman) <sam.mills@hench.space>
 *
 *  Project: dermdb https://dermdb.github.io
 */

module.exports = function(req, res, next){

    //Check if user is has existed in the database
    if (res.locals.user === null){

        //Respond with 401 code for not authenticated
        res.locals.package.sendError("requestError", 401, {
            message: "Not Authenticated"
        }, res);
        
    } else {

        //Continue to next middleware function
        next();
    }
};