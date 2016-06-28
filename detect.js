'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.add = add;
var async = require('async'),
    request = require('./request.js');

var queue = async.queue(function (_ref, callback) {
    var proxy = _ref.proxy;
    var timeout = _ref.timeout;

    if (proxy.indexOf('://') === -1) {
        proxy = 'http://' + proxy;
    }
    var check = request.check({ proxy: proxy, timeout: timeout });
    check.then(function () {
        callback(null, true);
    }).catch(function () {
        callback(null, false);
    });
}, 10);

function add(_ref2, callback) {
    var proxy = _ref2.proxy;
    var _ref2$timeout = _ref2.timeout;
    var timeout = _ref2$timeout === undefined ? 10000 : _ref2$timeout;
    var _ref2$concurrency = _ref2.concurrency;
    var concurrency = _ref2$concurrency === undefined ? 10 : _ref2$concurrency;

    queue.concurrency = concurrency;
    queue.push({ proxy: proxy, timeout: timeout }, callback);
}