'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.check = check;
var request = require('request');

function check(_ref) {
    var proxy = _ref.proxy;
    var _ref$timeout = _ref.timeout;
    var timeout = _ref$timeout === undefined ? 10000 : _ref$timeout;


    return new Promise(function (resolve, reject) {
        request.get('http://baidu.com', {
            proxy: proxy,
            timeout: timeout
        }, function (error, response, body) {
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