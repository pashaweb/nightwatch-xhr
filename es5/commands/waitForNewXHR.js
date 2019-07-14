'use strict';

var _client = require('../client');

var util = require('util');

var events = require('events');

function waitForCountXHR() {
    // $FlowFixMe
    events.EventEmitter.call(this);
}

util.inherits(waitForCountXHR, events.EventEmitter);

waitForCountXHR.prototype.poll = function () {
    var command = this;
    this.api.execute(_client.clientPoll, [], function (_ref) {
        var xhrs = _ref.value;


        var filtered = [];
        if (xhrs && xhrs.length) {
            filtered = xhrs.filter(function (xhr) {
                return xhr.url.match(command.urlPattern);
            });
        }
        if (!command.initCount && command.initCount !== 0) {
            command.initCount = filtered.length;
        }
        if (filtered.length > command.initCount) {
            command.callback(filtered);
            clearInterval(command.pollingInterval);
            clearTimeout(command.timeout);
            command.emit('complete');
        }
    });
};

waitForCountXHR.prototype.command = function () {
    var urlPattern = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var delay = arguments[1];

    var _this = this;

    var count = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
    var callback = arguments[3];

    this.callback = callback;
    this.urlPattern = urlPattern;
    this.count = count;
    var command = this;
    this.reschedulePolling();
    this.timeout = setTimeout(function () {
        _this.api.execute(_client.clientPoll, [], function (_ref2) {
            var xhrs = _ref2.value;


            var filtered = [];
            if (xhrs && xhrs.length) {
                filtered = xhrs.filter(function (xhr) {
                    return xhr.url.match(command.urlPattern);
                });
            }
            command.callback(filtered);
            clearInterval(command.pollingInterval);
            clearTimeout(command.timeout);
            command.emit('complete');
        });
    }, delay);
};

waitForCountXHR.prototype.reschedulePolling = function () {
    var command = this;
    this.pollingInterval = setInterval(function () {
        return command.poll.call(command);
    }, 100);
};

module.exports = waitForCountXHR;