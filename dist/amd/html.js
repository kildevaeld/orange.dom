"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define(["require", "exports", 'orange', './dom'], function (require, exports, orange_1, dom) {
    "use strict";

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
    var domEvents = new Map();

    var Html = function () {
        function Html(el) {
            _classCallCheck(this, Html);

            if (!Array.isArray(el)) el = [el];
            this._elements = el || [];
        }

        _createClass(Html, [{
            key: "get",
            value: function get(n) {
                n = n === undefined || n < 0 ? 0 : n;
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
            key: "toggleClass",
            value: function toggleClass(str) {
                this.forEach(function (m) {
                    dom.toggleClass(m, str);
                });
                return this;
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
            key: "on",
            value: function on(name, callback, useCap) {
                return this.forEach(function (e) {
                    var entries = domEvents.get(e);
                    if (!entries) {
                        entries = [];
                        domEvents.set(e, entries);
                    }
                    dom.addEventListener(e, name, callback, useCap);
                    entries.push({
                        event: name,
                        callback: callback
                    });
                });
            }
        }, {
            key: "once",
            value: function once(name, callback, useCap) {
                var _this = this;

                return this.on(name, function (e) {
                    callback(e);
                    setTimeout(function () {
                        return _this.off(name, callback);
                    });
                }, useCap);
            }
        }, {
            key: "off",
            value: function off(name, callback) {
                if (!name) {
                    return this.forEach(function (el) {
                        var entries = domEvents.get(el);
                        if (entries) {
                            entries.forEach(function (e) {
                                dom.removeEventListener(el, e.event, e.callback);
                            });
                            domEvents.delete(el);
                        }
                    });
                }
                return this.forEach(function (el) {
                    var entries = domEvents.get(el);
                    if (!entries) return;
                    entries.forEach(function (entry, index) {
                        if (entry.event === name && (callback ? callback === entry.callback : true)) {
                            domEvents.get(el).splice(index, 1);
                        }
                    });
                    if (!domEvents.get(el).length) domEvents.delete(el);
                });
            }
        }, {
            key: "animationEnd",
            value: function animationEnd(callback, timeout) {
                return this.forEach(function (el) {
                    dom.animationEnd(el, callback, null, timeout);
                });
            }
        }, {
            key: "transitionEnd",
            value: function transitionEnd(callback, timeout) {
                return this.forEach(function (el) {
                    dom.transitionEnd(el, callback, null, timeout);
                });
            }
            // Iterator

        }, {
            key: Symbol.iterator,
            value: function value() {
                var pointer = 0;
                var components = this._elements;
                var len = components.length;
                return {
                    next: function next() {
                        var done = pointer >= len;
                        return {
                            done: done,
                            value: done ? null : components[pointer++]
                        };
                    }
                };
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
        }, {
            key: "removeAllEventListeners",
            value: function removeAllEventListeners() {
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = domEvents.keys()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var el = _step.value;

                        var entries = domEvents.get(el);
                        var _iteratorNormalCompletion2 = true;
                        var _didIteratorError2 = false;
                        var _iteratorError2 = undefined;

                        try {
                            for (var _iterator2 = entries[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                                var entry = _step2.value;

                                dom.removeEventListener(el, entry.event, entry.callback);
                            }
                        } catch (err) {
                            _didIteratorError2 = true;
                            _iteratorError2 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                    _iterator2.return();
                                }
                            } finally {
                                if (_didIteratorError2) {
                                    throw _iteratorError2;
                                }
                            }
                        }

                        domEvents.delete(el);
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
            }
        }, {
            key: "_domEvents",
            value: function _domEvents() {
                return domEvents;
            }
        }]);

        return Html;
    }();

    exports.Html = Html;
    function html(query, context) {
        return Html.query(query, context);
    }
    exports.html = html;
});