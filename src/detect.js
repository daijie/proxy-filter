const async = require('async'),
    request = require('./request.js');

var queue = async.queue(({proxy, timeout}, callback) => {
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

export function add({proxy, timeout=10000, concurrency=10}, callback) {
    queue.concurrency = concurrency;
    queue.push({proxy, timeout}, callback);
}