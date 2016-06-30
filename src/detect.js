const async = require('async'),
    request = require('./request.js');


var socks5 = false;
var timeout = 10000;

var queue = async.queue(async.asyncify(async function (proxy) {
    if(proxy.indexOf('://')===-1) {
        if(socks5) {
            let [host, port=1080] = proxy.split(':');
            proxy = {
                socksHost: host,
                socksPort: port
            }
        } else {
            proxy = 'http://' + proxy;
        }
    }
    try {
        return await request.check({proxy, timeout});
    } catch (err) {
        return false;
    }
}), 10);


export function add(proxy, callback) {
    queue.push(proxy, callback);
}

export function concurrency(concurrency=10) {
    queue.concurrency = concurrency;
}

export function timeout(timeout=10) {
    timeout = timeout * 1000;
}

export function enable_socks5() {
    socks5 = true;
}

export function disable_socks5() {
    socks5 = false;
}