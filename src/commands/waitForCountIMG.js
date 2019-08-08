// @flow
import type {Callback, ListenedXHR} from "../types";

const util = require('util');
const events = require('events');

import {clientImagesPoll} from '../images';

function waitForCountIMG() {
    // $FlowFixMe
    events.EventEmitter.call(this);
}

util.inherits(waitForCountIMG, events.EventEmitter);

waitForCountIMG.prototype.poll = function () {
    const command = this;
    this.api.execute(clientImagesPoll, [], function ({value: imgs}: { value: ?[] }) {

        let filtered = [];
        if (imgs && imgs.length) {
            filtered = imgs.filter(img => img.match(command.urlPattern));
        }
        if (command.count && filtered.length >= command.count) {
            command.callback(filtered);
            clearInterval(command.pollingInterval);
            clearTimeout(command.timeout);
            command.emit('complete');
        }else if(!command.count && filtered.length>0){

            command.callback(filtered);
            clearInterval(command.pollingInterval);
            clearTimeout(command.timeout);
            command.emit('complete');
        }


    });
};

waitForCountIMG.prototype.command = function (urlPattern: string = '', delay: ?number, count: ?number = 0, callback: Callback) {
    this.callback = callback;
    this.urlPattern = urlPattern;
    this.count = count;
    const command = this;
    this.reschedulePolling();
    this.timeout = setTimeout(() => {
        this.api.execute(clientImagesPoll, [], function ({value: imgs}: { value: ?Array[] }) {

            let filtered = [];
            if (imgs && imgs.length) {
                filtered = imgs.filter(img => img.match(command.urlPattern));
            }
                command.callback(filtered);
                clearInterval(command.pollingInterval);
                clearTimeout(command.timeout);
                command.emit('complete');
        });
    }, delay)

}

waitForCountIMG.prototype.reschedulePolling = function () {
    var command = this;
    this.pollingInterval = setInterval(function () {
        return command.poll.call(command);
    }, 300);
};

module.exports = waitForCountIMG;
