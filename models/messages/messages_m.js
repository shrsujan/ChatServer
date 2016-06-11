'use strict';

var messages = require('./tbl_messages');

module.exports = {
    create: function(options, success, error){
        messages.create(options.data).then(success, error);
    },

    read: function(options, success, error){
        messages.findAll(options).then(success, error);
    },

    update: function(options, success, error){
        messages.update(options.data, {where: options.where}).then(success, error);
    }
}