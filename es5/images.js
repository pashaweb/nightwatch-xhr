"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var clientIMGListen = exports.clientIMGListen = function clientIMGListen() {
    //const getImages = id => window.imagesListen.find(xhr => xhr.id === id);

    window.imagesListen = [];

    if (!Image.customized) {
        Object.defineProperty(HTMLImageElement.prototype, "_src", Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, "src"));
        Object.defineProperty(HTMLImageElement.prototype, "src", {
            get: function get() {
                return this._src;
            },
            set: function set(url) {
                //if (url.indexOf("imprammp.taboola.com/st")>-1) {
                window.imagesListen.push(url);
                console.log("*************** LOGGED A PIX ****************");
                //}
                this._src = url;
            }
        });
        Image.customized = true;
    }
};

var clientImagesPoll = exports.clientImagesPoll = function clientImagesPoll() {
    return window.imagesListen || [];
};