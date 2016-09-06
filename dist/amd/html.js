"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define(["require", "exports", 'orange', './dom'], function (require, exports, orange_1, dom) {
    "use strict";

    var domEvents;
    var singleTag = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;
    function parseHTML(html) {
        var parsed = singleTag.exec(html);
        if (parsed) {
            return document.createElement(parsed[0]);
        }
        var div = document.createElement('div');
        div.innerHTML = html;
        var element = div.firstChild;
        return element;
    }

    var Html = function () {
        function Html(el) {
            _classCallCheck(this, Html);

            if (!Array.isArray(el)) el = [el];
            this._elements = el || [];
        }

        _createClass(Html, [{
            key: "get",
            value: function get(n) {
                n = n === undefined ? 0 : n;
                return n >= this.length ? undefined : this._elements[n];
            }
        }, {
            key: "addClass",
            value: function addClass(str) {
                return this.forEach(function (e) {
                    dom.addClass(e, str);
                });
            }
        }, {
            key: "removeClass",
            value: function removeClass(str) {
                return this.forEach(function (e) {
                    dom.removeClass(e, str);
                });
            }
        }, {
            key: "hasClass",
            value: function hasClass(str) {
                return this._elements.reduce(function (p, c) {
                    return dom.hasClass(c, str);
                }, false);
            }
        }, {
            key: "attr",
            value: function attr(key, value) {
                var attr = void 0;
                if (typeof key === 'string' && value) {
                    attr = _defineProperty({}, key, value);
                } else if (typeof key == 'string') {
                    if (this.length) return this.get(0).getAttribute(key);
                } else if (orange_1.isObject(key)) {
                    attr = key;
                }
                return this.forEach(function (e) {
                    for (var k in attr) {
                        e.setAttribute(k, attr[k]);
                    }
                });
            }
        }, {
            key: "text",
            value: function text(str) {
                if (arguments.length === 0) {
                    return this.length > 0 ? this.get(0).textContent : null;
                }
                return this.forEach(function (e) {
                    return e.textContent = str;
                });
            }
        }, {
            key: "html",
            value: function html(_html) {
                if (arguments.length === 0) {
                    return this.length > 0 ? this.get(0).innerHTML : null;
                }
                return this.forEach(function (e) {
                    return e.innerHTML = _html;
                });
            }
        }, {
            key: "css",
            value: function css(attr, value) {
                if (arguments.length === 2) {
                    return this.forEach(function (e) {
                        if (attr in e.style) e.style[attr] = String(value);
                    });
                } else {
                    return this.forEach(function (e) {
                        for (var k in attr) {
                            if (k in e.style) e.style[k] = String(attr[k]);
                        }
                    });
                }
            }
        }, {
            key: "parent",
            value: function parent() {
                var out = [];
                this.forEach(function (e) {
                    if (e.parentElement) {
                        out.push(e.parentElement);
                    }
                });
                return new Html(out);
            }
        }, {
            key: "remove",
            value: function remove() {
                return this.forEach(function (e) {
                    if (e.parentElement) e.parentElement.removeChild(e);
                });
            }
        }, {
            key: "clone",
            value: function clone() {
                return new Html(this.map(function (m) {
                    return m.cloneNode();
                }));
            }
        }, {
            key: "find",
            value: function find(str) {
                var out = [];
                this.forEach(function (e) {
                    out = out.concat(orange_1.slice(e.querySelectorAll(str)));
                });
                return new Html(out);
            }
        }, {
            key: "map",
            value: function map(fn) {
                var out = new Array(this.length);
                this.forEach(function (e, i) {
                    out[i] = fn(e, i);
                });
                return out;
            }
        }, {
            key: "forEach",
            value: function forEach(fn) {
                this._elements.forEach(fn);
                return this;
            }
        }, {
            key: "length",
            get: function get() {
                return this._elements.length;
            }
        }], [{
            key: "query",
            value: function query(_query, context) {
                if (typeof context === 'string') {
                    context = document.querySelectorAll(context);
                }
                var html = void 0;
                var els = void 0;
                if (typeof _query === 'string') {
                    if (_query.length > 0 && _query[0] === '<' && _query[_query.length - 1] === ">" && _query.length >= 3) {
                        return new Html([parseHTML(_query)]);
                    }
                    if (context) {
                        if (context instanceof HTMLElement) {
                            els = orange_1.slice(context.querySelectorAll(_query));
                        } else {
                            html = new Html(orange_1.slice(context));
                            return html.find(_query);
                        }
                    } else {
                        els = orange_1.slice(document.querySelectorAll(_query));
                    }
                } else if (_query && _query instanceof Element) {
                    els = [_query];
                } else if (_query && _query instanceof NodeList) {
                    els = orange_1.slice(_query);
                }
                return new Html(els);
            }
        }]);

        return Html;
    }();

    exports.Html = Html;
});