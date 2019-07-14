'use strict';

var _client = require('../client');

var util = require('util');
var events = require('events');

function ListenXHR() {
    // $FlowFixMe
    events.EventEmitter.call(this);
}

util.inherits(ListenXHR, events.EventEmitter);

ListenXHR.prototype.command = function () {
    var command = this;
    this.api.execute(_client.clientListen, [], function () {
        command.emit('complete');
    });
};

module.exports = ListenXHR;