/*
 *  Copyright 2016 DS-Cubed
 *
 *  Authored by Sam Mills (Henchman) <sam.mills@hench.space>
 *
 *  Project: dermdb https://dermdb.github.io
 */

var Package = function(startTime){
    this.startTime = process.hrtime();
};

// Formulate JSON error 
Package.prototype.returnError = function(err, code, data){

    //Formulate data object
    if (typeof data !== "object"){

        //Make sure data is an object, if not, data.value contains the string passed as data
        data = {message:data}
    }

    //Form packet if err is not an object
    if (typeof err !== "object") {
        return {
            status: err,
            code: code,
            data: data,

            //Returning time taken to come to error
            time: this.endTime()
        }
    } else {

        // If err is an object,
        // Form new packet
        // Understanding predefined variables as input
        return {
            status: "serverError",
            code: err.statusCode || 500,
            data: {
                message: err.message
            },
            time: this.endTime()
        };
    }
};

//Function to return a JSON packet response
Package.prototype.returnData = function(data){

    //Formulate data object
    if (typeof data !== "object"){

        //Make sure data is an object, if not, data.value contains the string passed as data
        data = {value:data}
    }
    return {

        //Status ok means operation succeeded
        status: "ok",

        //Code 200 is fallback for status ok, as is used in error responses
        code: 200,

        //Data object
        data: data,

        //Returning time taken to
        time: this.endTime()
    };
};

//Function to send error using returnError to formulate JSON packet
Package.prototype.sendError = function(type, code, data, res){

    //If status code is not known, default to 500, internal server error
    res.status(code || 500);

    //Send as JSON
    res.json(this.returnError(type, code, data));
};

//Send data as JSON
Package.prototype.sendData = function(res, data){
    res.json(this.returnData(data));
};

//Get end time of time taken to return data or error
Package.prototype.endTime = function(){
    var diff = process.hrtime(this.startTime);
    return (diff[0] * 1e9 + diff[1])/1000000;
};

Package.prototype.setId = function(id){
    if (typeof id === "string"){
        this.id = id;
    } else {
        throw id;
    }
};

var jwt = require('jsonwebtoken');
var config = require('auto-config');
Package.prototype.setCookie = function(res){

    //Set cookie, encrypted by JWT
    res.cookie(config.cookie.name, jwt.sign({
        foo: true,
        user: {
            id: this.id
        },
        date: new Date()
    }, config.jwt.salt), {
        httpOnly: true
    });

    //Respond with successful login
    res.locals.package.sendData(res, {
        id: this.id,
        message: "Login Success"
    }, res);
};

module.exports = Package;