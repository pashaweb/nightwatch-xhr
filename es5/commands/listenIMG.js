'use strict';

var _images = require('../images');

var util = require('util');
var events = require('events');

function ListenIMG() {
    // $FlowFixMe
    events.EventEmitter.call(this);
}

util.inherits(ListenIMG, events.EventEmitter);

ListenIMG.prototype.command = function () {
    var command = this;
    this.api.execute(_images.clientIMGListen, [], function () {
        command.emit('complete');
    });
};

module.exports = ListenIMG;