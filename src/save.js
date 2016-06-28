const fs = require('fs'), 
    async = require('async');

var appender = async.queue(({file=null, line}, callback)=>{
    if(file) {
        fs.appendFile(file, line+'\r\n', callback);
    } else {
        console.log(line);
        callback();
    }
}, 10);

export function append({file=null, line}, callback) {
    appender.push({file, line}, callback);
};