const request = require('request');

export function check({proxy, timeout=10000}) {
    
    return new Promise((resolve, reject) => {
        request.get('http://baidu.com', {
            proxy: proxy,
            timeout: timeout
        }, (error, response, body) => {
            if(error) {
                reject(0);
                return;
            }
            if(body.indexOf('www.baidu.com') > -1) {
                resolve(1);
                return;
            }
            reject(0);
        });
    });
}