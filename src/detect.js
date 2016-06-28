const async = require('async'),
    request = require('./request.js');

var timeout = 10000;
var queue = async.queue((proxy, callback) => {
    if(proxy.indexOf('://')===-1) {
        proxy = 'http://' + proxy;
    }
    let check = request.check({proxy, timeout});
    check.then(()=>{
        callback(null, true);
    }).catch(()=>{
        callback(null, false);
    });
}, 10);


export function add(proxy, callback) {
    queue.push(proxy, callback);
}

export function concurrency(concurrency=10) {
    queue.concurrency = concurrency;
}
export function timeout(timeout=10) {
    timeout = timeout * 1000;
}