"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define(["require", "exports", 'orange'], function (require, exports, orange_1) {
    "use strict";

    var ElementProto = typeof Element !== 'undefined' && Element.prototype || {};
    var matchesSelector = ElementProto.matches || ElementProto.webkitMatchesSelector || ElementProto.mozMatchesSelector || ElementProto.msMatchesSelector || ElementProto.oMatchesSelector || function (selector) {
        var nodeList = (this.parentNode || document).querySelectorAll(selector) || [];
        return !!~orange_1.indexOf(nodeList, this);
    };
    var elementAddEventListener = ElementProto.addEventListener || function (eventName, listener) {
        return this.attachEvent('on' + eventName, listener);
    };
    var elementRemoveEventListener = ElementProto.removeEventListener || function (eventName, listener) {
        return this.detachEvent('on' + eventName, listener);
    };
    var transitionEndEvent = function transitionEnd() {
        var el = document.createElement('bootstrap');
        var transEndEventNames = {
            'WebkitTransition': 'webkitTransitionEnd',
            'MozTransition': 'transitionend',
            'OTransition': 'oTransitionEnd otransitionend',
            'transition': 'transitionend'
        };
        for (var name in transEndEventNames) {
            if (el.style[name] !== undefined) {
                return transEndEventNames[name];
            }
        }
        return null;
    };
    var animationEndEvent = function animationEnd() {
        var el = document.createElement('bootstrap');
        var transEndEventNames = {
            'WebkitAnimation': 'webkitAnimationEnd',
            'MozAnimation': 'animationend',
            'OAnimation': 'oAnimationEnd oanimationend',
            'animation': 'animationend'
        };
        for (var name in transEndEventNames) {
            if (el.style[name] !== undefined) {
                return transEndEventNames[name];
            }
        }
        return null;
    };
    function matches(elm, selector) {
        return matchesSelector.call(elm, selector);
    }
    exports.matches = matches;
    function addEventListener(elm, eventName, listener) {
        var useCap = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];

        elementAddEventListener.call(elm, eventName, listener, useCap);
    }
    exports.addEventListener = addEventListener;
    function removeEventListener(elm, eventName, listener) {
        elementRemoveEventListener.call(elm, eventName, listener);
    }
    exports.removeEventListener = removeEventListener;
    var unbubblebles = 'focus blur change load error'.split(' ');
    var domEvents = [];
    function delegate(elm, selector, eventName, callback, ctx) {
        var root = elm;
        var handler = function handler(e) {
            var node = e.target || e.srcElement;
            // Already handled
            if (e.delegateTarget) return;
            for (; node && node != root; node = node.parentNode) {
                if (matches(node, selector)) {
                    e.delegateTarget = node;
                    callback(e);
                }
            }
        };
        var useCap = !!~unbubblebles.indexOf(eventName);
        addEventListener(elm, eventName, handler, useCap);
        domEvents.push({ eventName: eventName, handler: handler, listener: callback, selector: selector });
        return handler;
    }
    exports.delegate = delegate;
    function undelegate(elm, selector, eventName, callback) {
        /*if (typeof selector === 'function') {
            listener = <Function>selector;
            selector = null;
          }*/
        var handlers = domEvents.slice();
        for (var i = 0, len = handlers.length; i < len; i++) {
            var item = handlers[i];
            var match = item.eventName === eventName && (callback ? item.listener === callback : true) && (selector ? item.selector === selector : true);
            if (!match) continue;
            removeEventListener(elm, item.eventName, item.handler);
            domEvents.splice(orange_1.indexOf(handlers, item), 1);
        }
    }
    exports.undelegate = undelegate;
    function addClass(elm, className) {
        if (elm.classList) {
            var split = className.split(' ');
            for (var i = 0, ii = split.length; i < ii; i++) {
                if (elm.classList.contains(split[i].trim())) continue;
                elm.classList.add(split[i].trim());
            }
        } else {
            elm.className = orange_1.unique(elm.className.split(' ').concat(className.split(' '))).join(' ');
        }
    }
    exports.addClass = addClass;
    function removeClass(elm, className) {
        if (elm.classList) {
            var split = className.split(' ');
            for (var i = 0, ii = split.length; i < ii; i++) {
                elm.classList.remove(split[i].trim());
            }
        } else {
            var _split = elm.className.split(' '),
                classNames = className.split(' '),
                tmp = _split,
                index = void 0;
            for (var _i = 0, _ii = classNames.length; _i < _ii; _i++) {
                index = _split.indexOf(classNames[_i]);
                if (!!~index) _split = _split.splice(index, 1);
            }
        }
    }
    exports.removeClass = removeClass;
    function hasClass(elm, className) {
        if (elm.classList) {
            return elm.classList.contains(className);
        }
        var reg = new RegExp('\b' + className);
        return reg.test(elm.className);
    }
    exports.hasClass = hasClass;
    function selectionStart(elm) {
        if ('selectionStart' in elm) {
            // Standard-compliant browsers
            return elm.selectionStart;
        } else if (document.selection) {
            // IE
            elm.focus();
            var sel = document.selection.createRange();
            var selLen = document.selection.createRange().text.length;
            sel.moveStart('character', -elm.value.length);
            return sel.text.length - selLen;
        }
    }
    exports.selectionStart = selectionStart;
    var _events = {
        animationEnd: null,
        transitionEnd: null
    };
    function transitionEnd(elm, fn, ctx, duration) {
        var event = _events.transitionEnd || (_events.transitionEnd = transitionEndEvent());
        var callback = function callback(e) {
            removeEventListener(elm, event, callback);
            fn.call(ctx, e);
        };
        addEventListener(elm, event, callback);
    }
    exports.transitionEnd = transitionEnd;
    function animationEnd(elm, fn, ctx, duration) {
        var event = _events.animationEnd || (_events.animationEnd = animationEndEvent());
        var callback = function callback(e) {
            removeEventListener(elm, event, callback);
            fn.call(ctx, e);
        };
        addEventListener(elm, event, callback);
    }
    exports.animationEnd = animationEnd;
    exports.domReady = function () {
        var fns = [],
            _listener,
            doc = document,
            hack = doc.documentElement.doScroll,
            domContentLoaded = 'DOMContentLoaded',
            loaded = (hack ? /^loaded|^c/ : /^loaded|^i|^c/).test(doc.readyState);
        if (!loaded) {
            doc.addEventListener(domContentLoaded, _listener = function listener() {
                doc.removeEventListener(domContentLoaded, _listener);
                loaded = true;
                while (_listener = fns.shift()) {
                    _listener();
                }
            });
        }
        return function (fn) {
            loaded ? setTimeout(fn, 0) : fns.push(fn);
        };
    }();
    function createElement(tag, attr) {
        var elm = document.createElement(tag);
        if (attr) {
            for (var key in attr) {
                elm.setAttribute(key, attr[key]);
            }
        }
        return elm;
    }
    exports.createElement = createElement;

    var LoadedImage = function () {
        function LoadedImage(img) {
            _classCallCheck(this, LoadedImage);

            this.img = img;
        }

        _createClass(LoadedImage, [{
            key: "check",
            value: function check(fn) {
                this.fn = fn;
                var isComplete = this.getIsImageComplete();
                if (isComplete) {
                    // report based on naturalWidth
                    this.confirm(this.img.naturalWidth !== 0, 'naturalWidth');
                    return;
                }
                this.img.addEventListener('load', this);
                this.img.addEventListener('error', this);
            }
        }, {
            key: "confirm",
            value: function confirm(loaded, msg, err) {
                this.isLoaded = loaded;
                if (this.fn) this.fn(err);
            }
        }, {
            key: "getIsImageComplete",
            value: function getIsImageComplete() {
                return this.img.complete && this.img.naturalWidth !== undefined && this.img.naturalWidth !== 0;
            }
        }, {
            key: "handleEvent",
            value: function handleEvent(e) {
                var method = 'on' + event.type;
                if (this[method]) {
                    this[method](event);
                }
            }
        }, {
            key: "onload",
            value: function onload(e) {
                this.confirm(true, 'onload');
                this.unbindEvents();
            }
        }, {
            key: "onerror",
            value: function onerror(e) {
                this.confirm(false, 'onerror', new Error(e.error));
                this.unbindEvents();
            }
        }, {
            key: "unbindEvents",
            value: function unbindEvents() {
                this.img.removeEventListener('load', this);
                this.img.removeEventListener('error', this);
                this.fn = void 0;
            }
        }]);

        return LoadedImage;
    }();

    function imageLoaded(img) {
        return new orange_1.Promise(function (resolve, reject) {
            var i = new LoadedImage(img);
            i.check(function (err) {
                if (err) return reject(err);
                resolve(i.isLoaded);
            });
        });
    }
    exports.imageLoaded = imageLoaded;
});