'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.add = add;
exports.concurrency = concurrency;
exports.timeout = timeout;
exports.enable_socks5 = enable_socks5;
exports.disable_socks5 = disable_socks5;
var async = require('async'),
    request = require('./request.js');

var socks5 = false;
var timeout = 10000;

var queue = async.queue(function (proxy, callback) {
    var protocol = void 0,
        uri = void 0;
    if (proxy.indexOf('://') === -1) {
        if (socks5) {
            protocol = 'socks5';

            var _proxy$split = proxy.split(':');

            var _proxy$split2 = _slicedToArray(_proxy$split, 2);

            var host = _proxy$split2[0];
            var _proxy$split2$ = _proxy$split2[1];
            var port = _proxy$split2$ === undefined ? 1080 : _proxy$split2$;

            proxy = {
                socksHost: host,
                socksPort: port
            };
        } else {
            protocol = 'http';
            proxy = 'http://' + proxy;
        }
    } else {
        var _proxy$split3 = proxy.split('://');

        var _proxy$split4 = _slicedToArray(_proxy$split3, 2);

        protocol = _proxy$split4[0];
        uri = _proxy$split4[1];
    }
    var check = request.check({ protocol: protocol, proxy: proxy, timeout: timeout });
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
    var t = arguments.length <= 0 || arguments[0] === undefined ? 10 : arguments[0];

    exports.timeout = timeout = t * 1000;
}

function enable_socks5() {
    socks5 = true;
}

function disable_socks5() {
    socks5 = false;
}