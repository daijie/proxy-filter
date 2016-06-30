'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.append = append;
var fs = require('fs'),
    async = require('async');

var appender = async.queue(function (_ref, callback) {
    var _ref$file = _ref.file;
    var file = _ref$file === undefined ? null : _ref$file;
    var line = _ref.line;

    if (file) {
        fs.appendFile(file, line + '\r\n', callback);
    } else {
        console.log(line);
        callback();
    }
}, 10);

function append(_ref2, callback) {
    var _ref2$file = _ref2.file;
    var file = _ref2$file === undefined ? null : _ref2$file;
    var line = _ref2.line;

    appender.push({ file: file, line: line }, callback);
};