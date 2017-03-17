"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function unique(array) {
    var seen = new Map();
    return array.filter(function (e, i) {
        if (seen.has(e)) return false;
        seen.set(e, true);
        return true;
    });
}
exports.unique = unique;
function indexOf(array, item) {
    for (var i = 0, len = array.length; i < len; i++) {
        if (array[i] === item) return i;
    }return -1;
}
exports.indexOf = indexOf;
function isObject(obj) {
    return obj === Object(obj);
}
exports.isObject = isObject;
var _slice = Array.prototype.slice;
function slice(array, begin, end) {
    return _slice.call(array, begin, end);
}
exports.slice = slice;