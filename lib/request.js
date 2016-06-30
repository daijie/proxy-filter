'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.check = check;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var request = require('request');
var Agent = require('socks5-http-client/lib/Agent');

var isString = function isString(str) {
    return typeof str == 'string';
};

function check(_ref) {
    var proxy = _ref.proxy;
    var _ref$timeout = _ref.timeout;
    var timeout = _ref$timeout === undefined ? 10000 : _ref$timeout;


    return new _promise2.default(function (resolve, reject) {
        var options = {
            timeout: timeout,
            followRedirect: false
        };

        if (isString(proxy)) {
            options.proxy = proxy;
        } else {
            options.agentClass = Agent;
            options.agentOptions = proxy;
        }

        request.get('http://baidu.com', options, function (error, response, body) {
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