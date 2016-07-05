'use strict';

var ss = require('shadowsocks/lib/shadowsocks/local');
//var ssUtils = require('shadowsocks/lib/shadowsocks/utils');
//ssUtils.config(ssUtils.ERROR);

process.on('message', function (_ref) {
    var server = _ref.server;
    var port = _ref.port;
    var password = _ref.password;
    var method = _ref.method;
    var timeout = _ref.timeout;

    var local = ss.createServer(server, port, 0, password, method, timeout);
    local.on("close", function () {
        process.send({
            errcode: 0,
            server: local.address()
        });
    });
    local.close();
    setTimeout(function () {
        process.send({ errcode: 1 });
    }, timeout);
});