'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

exports.add = add;
exports.concurrency = concurrency;
exports.timeout = timeout;
exports.enable_socks5 = enable_socks5;
exports.disable_socks5 = disable_socks5;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var async = require('async'),
    request = require('./request.js');

var socks5 = false;
var timeout = 10000;

var queue = async.queue(async.asyncify(function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(proxy) {
        var _proxy$split, _proxy$split2, host, _proxy$split2$, port;

        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        if (proxy.indexOf('://') === -1) {
                            if (socks5) {
                                _proxy$split = proxy.split(':');
                                _proxy$split2 = (0, _slicedToArray3.default)(_proxy$split, 2);
                                host = _proxy$split2[0];
                                _proxy$split2$ = _proxy$split2[1];
                                port = _proxy$split2$ === undefined ? 1080 : _proxy$split2$;

                                proxy = {
                                    socksHost: host,
                                    socksPort: port
                                };
                            } else {
                                proxy = 'http://' + proxy;
                            }
                        }
                        _context.prev = 1;
                        _context.next = 4;
                        return request.check({ proxy: proxy, timeout: timeout });

                    case 4:
                        return _context.abrupt('return', _context.sent);

                    case 7:
                        _context.prev = 7;
                        _context.t0 = _context['catch'](1);
                        return _context.abrupt('return', false);

                    case 10:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this, [[1, 7]]);
    }));

    return function (_x) {
        return _ref.apply(this, arguments);
    };
}()), 10);

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

function enable_socks5() {
    socks5 = true;
}

function disable_socks5() {
    socks5 = false;
}