export const clientIMGListen = function () {
    //const getImages = id => window.imagesListen.find(xhr => xhr.id === id);

    window.imagesListen = [];

    if (!Image.customized) {
        Object.defineProperty(HTMLImageElement.prototype, "_src", Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, "src"));
        Object.defineProperty(HTMLImageElement.prototype, "src", {
            get: function () {
                return this._src;
            },
            set: function (url) {
                //if (url.indexOf("imprammp.taboola.com/st")>-1) {
                window.imagesListen.push(url);
                if(window.xhrListen){
                    window.xhrListen.push({
                        id: 'image',
                        method:'GET',
                        url,
                        openedTime: Date.now(),
                    });
                }
                console.log("*************** LOGGED A PIX ****************");
                //}
                this._src = url;
            }
        });
        Image.customized = true;
    }
};

export const clientImagesPoll = function () {
    return window.imagesListen || [];
};
