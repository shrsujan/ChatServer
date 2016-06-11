'use strict';

var login = require('./login');
var mw = require('../middleware');
var version = require('../../../../config').versions.v1;

module.exports = function(app){
    app.post(version + '/signup', login.collect, login.addUser, mw.respond, mw.error);
    app.post(version + '/login', login.collect, login.authenticate, mw.respond, mw.error);
    app.get(version + '/test', function(req, res, next){
        req.cdata = {
            success: 1,
            message: 'Test successful'
        };
        next();
    }, mw.respond, mw.error);
};