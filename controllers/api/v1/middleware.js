'use strict';

var util = require('util');

var mw = {


  respond: function respondfn(req, res, next) {
    res.json(req.cdata);
  },

  error: function errorfn(err, req, res, next) {

    if (!err) {
      err = new Error('an error has occurred');
    }

    var code = err.status || 500;

    util.log(util.format('Error [%s]: %s', req.url, err.message));

    if (code !== 404 && code !== 403) {
      // not logging traces for 404 and 403 errors
      util.log(util.inspect(err.stack));
    }

    if ('ETIMEDOUT' === err.code || 'ENOTFOUND' === err.code) {
      err.message =
        'Error connecting upstream servers, please try again later.';
    }

    if ('POST' === req.method) {
      if (err.status === 403) {
        err.message =
          'Session expired, please refresh the page to continue.';
      }
    }
    if (code == 401) {
      res.status(401).send();
    } else {
      res.json({
        result: 'failure',
        success: 0,
        error: 1,
        error_msg: err.message,
        statusCode: code
      });
    }
  }
}
module.exports = mw;