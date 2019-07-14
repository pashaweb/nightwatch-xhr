'use strict';

String.prototype.trunc = String.prototype.trunc || function (n) {
    return this.length > n ? this.substr(0, n - 3) + '...' : this;
};

exports.assertion = function XHRSuccess() {
    var listenedXhrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    var xhrs = Array.isArray(listenedXhrs) ? listenedXhrs : [listenedXhrs];
    this.message = xhrs && xhrs[0] && xhrs[0].url ? 'Expected ' + xhrs[0].url.trunc(30) + ' be to called successfully' : 'Expected unknown url to be called successfully';
    this.expected = 'success';
    this.pass = function (value) {
        return value === this.expected;
    };
    this.value = function (result) {
        return result;
    };
    this.command = function command(callback) {
        var self = this;
        setImmediate(function () {
            return callback.call(self, xhrs && xhrs[0] ? xhrs[0].status : '');
        });
        return this;
    };
};