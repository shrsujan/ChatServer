'use strict';

var config = require('../../../../config');
var jwt = require('jsonwebtoken');
var jwtSecret = config.jwtSecret;

module.exports = {

    collect: function(req, res, next){
        var fields = ['first_name','last_name','email','phone','username','password'];
        var reqdata = {};
        fields.forEach(function(entry){
            if(typeof req.body[entry] !== 'undefined')
                reqdata[entry] = req.sanitize(req.body[entry]);
            if(typeof req.query[entry] !== 'undefined')
                reqdata[entry] = req.sanitize(req.query[entry]);
            if(typeof req.params[entry] !== 'undefined')
                reqdata[entry] = req.sanitize(req.params[entry])
        });
        req.cb_userData = reqdata;
        next();
    },

    addUser: function(req, res, next){
        var options = {
            data: req.cb_userData
        }
        req.users.create(options, success, error);
        function success(result){
            if(!result.$options.isNewRecord) next(new Error("User not added"));
            else{
                req.cdata = {
                    success: 1,
                    message: "New user added"
                }
                next();
            }
        }
        function error(err){
            if(err) next(err);
        }
    },

    authenticate: function(req, res, next){
        if(!(req.cb_userData.username && req.cb_userData.password)) next(new Error("Username/Password not provided"));
        else{
            var options = {
                where: {
                    username: req.cb_userData.username,
                }
            }
            req.users.authenticate(options, success, error);
            function success(result){
                if(result != ''){
                    var userInfo = result[0];
                    if(userInfo.password == req.cb_userData.password){
                        var token = jwt.sign({id: userInfo.id, username: userInfo.username, email: userInfo.email}, jwtSecret, {expiresIn: 10});
                        req.cdata = {
                            success: 1,
                            message: "Login successful",
                            token: token
                        }
                        next();
                    } else{
                        next(new Error("Login unsuccessful"));
                    }
                } else{
                    next(new Error("Login unsuccessful"));
                }
            }
            function error(err){
                if(err) next(err);
            }
        }
    }

}