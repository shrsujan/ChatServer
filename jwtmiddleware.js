'use strict';

var jwt = require('jsonwebtoken');
var jwtSecret = require('./config').jwtSecret;
var refreshJwtSecret = require('./config').refreshJwtSecret;
var version = require('./config').versions.v1;

module.exports = {
    authMiddleware: function(app){
        app.use(version + '/test', this.jwtAuth({secret: jwtSecret}));
        app.use('/home' || '/home/*' || '/chatBox', this.jwtAuth({secret: jwtSecret}));
        app.use(version + 'users/view', this.jwtAuth({secret: jwtSecret}));
        app.use(version + '/users/refreshToken', this.refreshJwtAuth({secret: refreshJwtSecret}));
    },

    jwtAuth: function(signature){
        return function(req, res, next){
            let secret = signature.secret;
            if(typeof(req.headers.authorization) == 'undefined'){
                res.status(401).json({
                    result: 'failure',
                    success: 0,
                    error: 1,
                    error_msg: 'Token not provided',
                    statusCode: 401,
                    errorCode: 402
                });
            } else{
                var authHeader = req.headers.authorization;
                var token = authHeader.split(" ")[1];
                jwt.verify(token, secret, function(err, decoded){
                    if(decoded){
                        req.user = decoded;
                        next();
                    }
                    if(err){
                        if(err.name == 'TokenExpiredError') {
                            jwt.verify(token, secret, {ignoreExpiration: true}, function(err, decoded){
                                if(err){
                                    res.status(401).json({
                                        result: 'failure',
                                        success: 0,
                                        error: 1,
                                        error_msg: err.message,
                                        statusCode: 401,
                                        errorCode: 403
                                    });
                                }
                                if(decoded){
                                    let refreshToken = jwt.sign({id: decoded.id, username:decoded.username, email:decoded.email}, refreshJwtSecret, {expiresIn: 60});
                                    res.status(401).json({
                                        result: 'failure',
                                        success: 0,
                                        error: 1,
                                        error_msg: 'Refresh token to be provided here',
                                        refreshToken: refreshToken,
                                        statusCode: 401,
                                        errorCode: 401
                                    });
                                }
                            });
                        } else{
                            res.status(401).json({
                                result: 'failure',
                                success: 0,
                                error: 1,
                                error_msg: err.message,
                                statusCode: 401,
                                errorCode: 403
                            });
                        }
                    }
                });
            }
        }
    },

    refreshJwtAuth: function(signature){
        return function(req, res, next){
            let secret = signature.secret;
            if(req.headers.refreshauthorization == 'undefined'){
                res.status(401).json({
                    result: 'failure',
                    success: 0,
                    error: 1,
                    error_msg: 'Refresh token not provided',
                    statusCode: 401,
                    errorCode: 402
                });
            } else{
                let refreshAuthHeader = req.headers.refreshauthorization;
                let refreshToken = refreshAuthHeader.split(" ")[1];
                jwt.verify(refreshToken, secret, function(err, decoded){
                    if(err){
                        res.status(401).json({
                            result: 'failure',
                            success: 0,
                            error: 1,
                            error_msg: err.message,
                            statusCode: 401,
                            errorCode: 403
                        });
                    }
                    if(decoded){
                        req.refreshTokenData = decoded;
                        next();
                    }
                });
            }
        }
    }
};