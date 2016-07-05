const request = require('request');
const cp = require('child_process');

var Agent = require('socks5-http-client/lib/Agent');

var isString = (str) => {
    return (typeof str)=='string';
};

export function getProxy({protocol, proxy, timeout}) {
    return new Promise((resolve, reject) => {
        let options = {
            timeout: timeout,
            followRedirect: false
        };
        
        if(isString(proxy)) {
            options.proxy = proxy;
        } else {
            options.agent = new Agent(proxy);
        }
        request.get('http://baidu.com/', options, (error, response, body) => {
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

export function getSSProxy({protocol, proxy, timeout}) {    
    return new Promise((resolve, reject)=>{
        var ss = cp.fork('./lib/ss.js', {silent: true});
        let str, method, password, server, port;
        [, str] = proxy.split("://", 2);
        str = new Buffer(str, 'base64').toString('ascii');
        [method, str, port] = str.split(':');
        [password, server] = str.split('@', 2);
        ss.send({server, port, password, method, timeout});
        ss.on('message', (data)=>{
            if(data.errcode) {
                ss.kill();
                reject();
            } else {
                this.getProxy({
                    protocal: 'socks5',
                    proxy: {
                        socksHost: data.server.address,
                        socksPort: data.server.port
                    },
                    timeout: timeout
                }).then((state)=>{
                    ss.kill();
                }).then(resolve)
                .catch(reject);
                
            }
        });
    });
}

export function check({protocol, proxy, timeout=10000}) {
    if(protocol=='ss') {
        return this.getSSProxy({protocol, proxy, timeout});
    } else {
        return this.getProxy({protocol, proxy, timeout});
    }
}