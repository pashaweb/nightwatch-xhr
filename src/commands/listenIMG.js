// @flow

const util = require('util');
const events = require('events');

import { clientIMGListen } from '../images';

function ListenIMG() {
    // $FlowFixMe
    events.EventEmitter.call(this);
}

util.inherits(ListenIMG, events.EventEmitter);

ListenIMG.prototype.command = function () {
    const command = this;
    this.api.execute(clientIMGListen, [], function () {
        command.emit('complete');
    });
};

module.exports = ListenIMG;
