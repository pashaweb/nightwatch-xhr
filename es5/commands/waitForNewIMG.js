'use strict';

var _images = require('../images');

var util = require('util');

var events = require('events');

function waitForNewIMG() {
    // $FlowFixMe
    events.EventEmitter.call(this);
}

util.inherits(waitForNewIMG, events.EventEmitter);

waitForNewIMG.prototype.poll = function () {
    var command = this;
    this.api.execute(_images.clientImagesPoll, [], function (_ref) {
        var imgs = _ref.value;


        var filtered = [];
        if (imgs && imgs.length) {
            filtered = imgs.filter(function (img) {
                return img.match(command.urlPattern);
            });
        }

        if (!command.initCount && command.initCount !== 0) {
            command.initCount = filtered.length;
        }

        if (command.count && filtered.length === command.count) {
            command.callback(filtered);
            clearInterval(command.pollingInterval);
            clearTimeout(command.timeout);
            command.emit('complete');
        } else if (!command.count && filtered.length > 0 && filtered.length > command.initCount) {

            command.callback(filtered);
            clearInterval(command.pollingInterval);
            clearTimeout(command.timeout);
            command.emit('complete');
        }
    });
};

waitForNewIMG.prototype.command = function () {
    var urlPattern = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var delay = arguments[1];

    var _this = this;

    var count = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var callback = arguments[3];

    this.callback = callback;
    this.urlPattern = urlPattern;
    this.count = count;
    var command = this;
    this.reschedulePolling();
    this.timeout = setTimeout(function () {
        _this.api.execute(_images.clientImagesPoll, [], function (_ref2) {
            var imgs = _ref2.value;


            var filtered = [];
            if (imgs && imgs.length) {
                filtered = imgs.filter(function (img) {
                    return img.match(command.urlPattern);
                });
            }
            command.callback(filtered);
            clearInterval(command.pollingInterval);
            clearTimeout(command.timeout);
            command.emit('complete');
        });
    }, delay);
};

waitForNewIMG.prototype.reschedulePolling = function () {
    var command = this;
    this.pollingInterval = setInterval(function () {
        return command.poll.call(command);
    }, 300);
};

module.exports = waitForNewIMG;