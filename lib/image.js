"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var orange_1 = require('orange');
var dom_1 = require('./dom');

var LoadedImage = function () {
    function LoadedImage(img) {
        var timeout = arguments.length <= 1 || arguments[1] === undefined ? 200 : arguments[1];
        var retries = arguments.length <= 2 || arguments[2] === undefined ? 10 : arguments[2];

        _classCallCheck(this, LoadedImage);

        this.img = img;
        this.timeout = timeout;
        this.retries = retries;
        this.__resolved = false;
    }

    _createClass(LoadedImage, [{
        key: 'check',
        value: function check(fn) {
            var _this = this;

            this.fn = fn;
            var isComplete = this.getIsImageComplete();
            if (isComplete) {
                // report based on naturalWidth
                this.confirm(this.img.naturalWidth !== 0, 'naturalWidth');
                return;
            }
            var retries = this.retries;
            var retry = function retry() {
                setTimeout(function () {
                    if (_this.__resolved) return;
                    if (_this.getIsImageComplete()) {
                        _this.__resolved = true;
                        return _this.onload(null);
                    } else if (retries > 0) {
                        retries--;
                        retry();
                    }
                }, _this.timeout);
            };
            retry();
            dom_1.addEventListener(this.img, 'load', this);
            dom_1.addEventListener(this.img, 'error', this);
        }
    }, {
        key: 'confirm',
        value: function confirm(loaded, msg, err) {
            this.__resolved = true;
            this.isLoaded = loaded;
            if (this.fn) this.fn(err);
        }
    }, {
        key: 'getIsImageComplete',
        value: function getIsImageComplete() {
            return this.img.complete && this.img.naturalWidth !== undefined && this.img.naturalWidth !== 0;
        }
    }, {
        key: 'handleEvent',
        value: function handleEvent(e) {
            var method = 'on' + event.type;
            if (this[method]) {
                this[method](event);
            }
        }
    }, {
        key: 'onload',
        value: function onload(e) {
            this.confirm(true, 'onload');
            this.unbindEvents();
        }
    }, {
        key: 'onerror',
        value: function onerror(e) {
            this.confirm(false, 'onerror', new Error(e.error));
            this.unbindEvents();
        }
    }, {
        key: 'unbindEvents',
        value: function unbindEvents() {
            dom_1.removeEventListener(this.img, 'load', this);
            dom_1.removeEventListener(this.img, 'error', this);
            this.fn = void 0;
        }
    }]);

    return LoadedImage;
}();

function imageLoaded(img, timeout, retries) {
    return new orange_1.Promise(function (resolve, reject) {
        var i = new LoadedImage(img, timeout, retries);
        i.check(function (err) {
            if (err) return reject(err);
            resolve(i.isLoaded);
        });
    });
}
exports.imageLoaded = imageLoaded;