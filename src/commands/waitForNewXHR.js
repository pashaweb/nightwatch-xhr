// @flow
import type {Callback, ListenedXHR} from "../types";

const util = require('util');
const events = require('events');

import {clientPoll} from '../client';

function waitForCountXHR() {
    // $FlowFixMe
    events.EventEmitter.call(this);
}

util.inherits(waitForCountXHR, events.EventEmitter);

waitForCountXHR.prototype.poll = function () {
    const command = this;
    this.api.execute(clientPoll, [], function ({value: xhrs}: { value: ?Array<ListenedXHR> }) {

        let filtered = [];
        if (xhrs && xhrs.length) {
            filtered = xhrs.filter(xhr => xhr.url.match(command.urlPattern));
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

waitForCountXHR.prototype.command = function (urlPattern: string = '', delay: ?number, count: ?number = 1, callback: Callback) {
    this.callback = callback;
    this.urlPattern = urlPattern;
    this.count = count;
    const command = this;
    this.reschedulePolling();
    this.timeout = setTimeout(() => {
        this.api.execute(clientPoll, [], function ({value: xhrs}: { value: ?Array<ListenedXHR> }) {

            let filtered = [];
            if (xhrs && xhrs.length) {
                filtered = xhrs.filter(xhr => xhr.url.match(command.urlPattern));
            }
                command.callback(filtered);
                clearInterval(command.pollingInterval);
                clearTimeout(command.timeout);
                command.emit('complete');
        });
    }, delay)

}

waitForCountXHR.prototype.reschedulePolling = function () {
    var command = this;
    this.pollingInterval = setInterval(function () {
        return command.poll.call(command);
    }, 300);
};

module.exports = waitForCountXHR;
