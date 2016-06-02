/*
 *  Copyright 2016 DS-Cubed
 *
 *  Authored by Sam Mills (Henchman) <sam.mills@hench.space>
 *
 *  Project: dermdb https://github.com/haleleicester/dermdb
 */

var S = require('string');

/*
 *  Username validation function
 */
//TODO: Add callback support
module.exports = function(username){

    //Check name is not too short
    if (username.length < 3) {
        return "Name too short";

        //Check name is not too long
    } else if (username.length > 15){
        return "Name too long";
    } else {

        //Check name only contains latin characters
        if (S(username).latinise().s !== username){
            return "Name contains non latin characters";
        } else {
            return true;
        }
    }
};