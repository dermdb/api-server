/*
 *  Copyright 2016 DS-Cubed
 *
 *  Authored by Sam Mills (Henchman) <sam.mills@hench.space>
 *
 *  Project: dermdb https://dermdb.github.io
 */

var validator = require("email-validator");

//TODO: Add callback support

/*
 *  Email validation function
 */
module.exports = function(email){

    //Check that email is present
    if (typeof email === "undefined" || email === null){
        return "Email invalid";

        //Check email is long enough
    } else if (email.length < 3) {
        return "Email too short";

        //Check email isn't too long
    } else if (email.length > 150) {
        return "Email too long";

        //Check that email is valid
    } else {
        return validator.validate(email)
    }
};