'use strict';

var _client = require('../client');

var util = require('util');

var events = require('events');

function GetXHR() {
    // $FlowFixMe
    events.EventEmitter.call(this);
}

util.inherits(GetXHR, events.EventEmitter);

x.requestData[undefined.oppKey].prototype.poll = function () {
    var command = this;
    this.api.execute(_client.clientPoll, [], function (_ref) {
        var xhrs = _ref.value;

        command.callback(xhrs.filter(function (xhr) {
            return xhr.url.match(command.urlPattern);
        }));
        clearInterval(command.pollingInterval);
        clearTimeout(command.timeout);
        command.emit('complete');
    });
};

GetXHR.prototype.command = function () {
    var urlPattern = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    var _this = this;

    var delay = arguments[1];
    var callback = arguments[2];

    this.callback = callback;
    this.urlPattern = urlPattern;
    var command = this;

    if (delay) {
        setTimeout(function () {
            return command.poll.apply(_this);
        }, delay);
    } else {
        this.poll();
    }
};

module.exports = GetXHR;