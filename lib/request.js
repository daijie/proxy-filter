'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.getProxy = getProxy;
exports.getSSProxy = getSSProxy;
exports.check = check;
var request = require('request');
var cp = require('child_process');

var Agent = require('socks5-http-client/lib/Agent');

var isString = function isString(str) {
    return typeof str == 'string';
};

function getProxy(_ref) {
    var protocol = _ref.protocol;
    var proxy = _ref.proxy;
    var timeout = _ref.timeout;

    return new Promise(function (resolve, reject) {
        var options = {
            timeout: timeout,
            followRedirect: false
        };

        if (isString(proxy)) {
            options.proxy = proxy;
        } else {
            options.agent = new Agent(proxy);
        }
        request.get('http://baidu.com/', options, function (error, response, body) {
            if (error) {
                reject(0);
                return;
            }
            if (body.indexOf('www.baidu.com') > -1) {
                resolve(1);
                return;
            }
            reject(0);
        });
    });
}

function getSSProxy(_ref2) {
    var _this = this;

    var protocol = _ref2.protocol;
    var proxy = _ref2.proxy;
    var timeout = _ref2.timeout;

    return new Promise(function (resolve, reject) {
        var ss = cp.fork('./lib/ss.js', { silent: true });
        var str = void 0,
            method = void 0,
            password = void 0,
            server = void 0,
            port = void 0;

        var _proxy$split = proxy.split("://", 2);

        var _proxy$split2 = _slicedToArray(_proxy$split, 2);

        str = _proxy$split2[1];

        str = new Buffer(str, 'base64').toString('ascii');

        var _str$split = str.split(':');

        var _str$split2 = _slicedToArray(_str$split, 3);

        method = _str$split2[0];
        str = _str$split2[1];
        port = _str$split2[2];

        var _str$split3 = str.split('@', 2);

        var _str$split4 = _slicedToArray(_str$split3, 2);

        password = _str$split4[0];
        server = _str$split4[1];

        ss.send({ server: server, port: port, password: password, method: method, timeout: timeout });
        ss.on('message', function (data) {
            if (data.errcode) {
                ss.kill();
                reject();
            } else {
                _this.getProxy({
                    protocal: 'socks5',
                    proxy: {
                        socksHost: data.server.address,
                        socksPort: data.server.port
                    },
                    timeout: timeout
                }).then(function (state) {
                    ss.kill();
                }).then(resolve).catch(reject);
            }
        });
    });
}

function check(_ref3) {
    var protocol = _ref3.protocol;
    var proxy = _ref3.proxy;
    var _ref3$timeout = _ref3.timeout;
    var timeout = _ref3$timeout === undefined ? 10000 : _ref3$timeout;

    if (protocol == 'ss') {
        return this.getSSProxy({ protocol: protocol, proxy: proxy, timeout: timeout });
    } else {
        return this.getProxy({ protocol: protocol, proxy: proxy, timeout: timeout });
    }
}