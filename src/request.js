const request = require('request');
var Agent = require('socks5-http-client/lib/Agent');

var isString = (str) => {
    return (typeof str)=='string';
};

export function check({proxy, timeout=10000}) {
    
    return new Promise((resolve, reject) => {
        let options = {
            timeout: timeout
        };
        
        if(isString(proxy)) {
            options.proxy = proxy;
        } else {
            options.agentClass = Agent;
            options.agentOptions = proxy;
        }
        
        request.get('http://baidu.com', options, (error, response, body) => {
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