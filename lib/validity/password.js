/*
 *  Copyright 2016 DS-Cubed
 *
 *  Authored by Sam Mills (Henchman) <sam.mills@hench.space>
 *
 *  Project: dermdb https://github.com/haleleicester/dermdb
 */

var commonPassword =    require('common-password');
var owasp =             require('owasp-password-strength-test');

// Password validation settings
var settings = {
    allowPassphrases       : true,
    maxLength              : 18,
    minLength              : 6,
    minPhraseLength        : 15,
    minOptionalTestsToPass : 4
};
owasp.config(settings);

/*
 *  Password validation function
 */
//TODO: Add callback support
function check(password){

    //Check if password is present
    if (typeof password === "undefined" || password === null) {

        //Check if password is less than 7 characters
    } else if (password.length <= 6){
        return "Password too short! Length was " + password.length + ", required length is " + settings.minLength;

        //Check if password is too long
    } else if (password.length >= 61){
        return "Password too long! Length was " + password.length + ", maximum length is " + settings.maxLength;

    } else {
        //Check if password is too common with commonPassword module
        if (commonPassword(password)) {
            return "Password is too common!";
        } else {

            //Perform final Owasp check
            return owaspCheck(password);
        }
    }
}

function owaspCheck(password){

    //Test password
    var result = owasp.test(password);
    if (result.errors.length >= 1){
        var arr = [];

        //Push all errors into an array
        for (var i in result.errors){
            if (result.errors.hasOwnProperty(i)){
                var msg = result.errors[i] + ",";
                arr.push(msg);
            }
        }

        //Join comma separated errors by space.
        return arr.join(" ");
    } else {
        return true;
    }
}

module.exports = check;