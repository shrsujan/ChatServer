'use strict';

var db = require('../../lib/db');
var Sequelize = require('sequelize');
var users = require('../users/tbl_users');

var messages = db.define('messages', {
    id: {
        type: Sequelize.BIGINT,
        field: 'id',
        primaryKey: true,
        autoIncrement: true
    },
    message_body: {
        type: Sequelize.TEXT,
        field: 'message_body'
    },
    sender_id: {
        type: Sequelize.INTEGER,
        field: 'sender_id',
        references: {
            model: users,
            key: 'id'
        }
    },
    receiver_id: {
        type: Sequelize.INTEGER,
        field: 'receiver_id',
        references: {
            model: users,
            key: 'id'
        }
    },
    createdAt: {
        type: Sequelize.DATE,
        field: 'created_at'
    },
    updatedAt: {
        type: Sequelize
    }
},{

});

module.exports = messages;