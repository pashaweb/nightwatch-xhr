'use strict';

var _client = require('../client');

var util = require('util');

var events = require('events');

function WaitForXHR() {
    // $FlowFixMe
    events.EventEmitter.call(this);
}

util.inherits(WaitForXHR, events.EventEmitter);

WaitForXHR.prototype.reschedulePolling = function () {
    var command = this;
    this.pollingInterval = setTimeout(function () {
        return command.poll.call(command);
    }, 100);
};

WaitForXHR.prototype.poll = function () {
    var command = this;
    this.api.execute(_client.clientPoll, [], function (_ref) {
        var xhrs = _ref.value;

        if (xhrs && xhrs.length) {
            var filtered = xhrs.filter(function (xhr) {
                return xhr.url.match(command.urlPattern);
            });
            if (filtered && filtered.length && filtered[0].status) {
                console.warn('Got ' + filtered[0].status + ' response for id ' + command.xhrListenId);
                command.callback(filtered[0]);
                clearInterval(command.pollingInterval);
                clearTimeout(command.timeout);
                command.emit('complete');
                return;
            }
        }

        command.reschedulePolling.call(command);
    });
};

WaitForXHR.prototype.command = function () {
    var urlPattern = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var timeout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1000;
    var trigger = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};
    var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : function () {};

    var command = this;
    var api = this.api;

    this.callback = callback;
    this.urlPattern = urlPattern;

    // console.log('Verifying request ...');
    if (typeof urlPattern === 'string') {
        // throw new Error('urlPattern should be empty, string or regular expression');
    }
    if (typeof trigger !== 'function') {
        throw new Error('trigger should be a function');
    }
    if (typeof callback !== 'function') {
        throw new Error('callback should be a function');
    }

    // console.log('Setting up listening...');
    api.execute(_client.clientListen, [], function (res) {
        // console.warn('Listening XHR requests');
    });

    // console.log('Setting up polling interval ...');
    this.reschedulePolling();

    // console.log('Setting up timeout...');
    this.timeout = setTimeout(function () {
        console.log(util.format('[WaitForXHR TimeOut] %s ms, no XHR request for pattern : "%s"', timeout, urlPattern));
        clearInterval(command.pollingInterval);
        // callback(command.client.api, new Error());
        // his.fail({value:false}, 'not found', this.expectedValue, defaultMsg);
        command.client.assertion(false, 'Timed out', 'XHR Request', 'Timed out waiting for ' + urlPattern + ' XHR !');
        command.emit('complete');
    }, timeout);

    // console.log('Handling trigger ...');
    if (trigger) {
        if (typeof trigger === "function") trigger();else if (typeof trigger === "string") api.click(trigger);
    }
    // console.log('Done');
    return this;
};

module.exports = WaitForXHR;