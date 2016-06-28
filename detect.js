'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.add = add;
exports.concurrency = concurrency;
exports.timeout = timeout;
var async = require('async'),
    request = require('./request.js');

var timeout = 10000;
var queue = async.queue(function (proxy, callback) {
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

function add(proxy, callback) {
    queue.push(proxy, callback);
}

function concurrency() {
    var concurrency = arguments.length <= 0 || arguments[0] === undefined ? 10 : arguments[0];

    queue.concurrency = concurrency;
}
function timeout() {
    var timeout = arguments.length <= 0 || arguments[0] === undefined ? 10 : arguments[0];

    timeout = timeout * 1000;
}