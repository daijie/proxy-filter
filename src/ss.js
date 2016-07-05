var ss = require('shadowsocks/lib/shadowsocks/local');
//var ssUtils = require('shadowsocks/lib/shadowsocks/utils');
//ssUtils.config(ssUtils.ERROR);


process.on('message', ({server, port, password, method, timeout}) => {    
    let local = ss.createServer(server, port, 0, password, method, timeout);
    local.on("close", function() {
        process.send({
            errcode:0, 
            server: local.address()
        });
    });
    local.close();
    setTimeout(function() {
        process.send({errcode:1});
    }, timeout);
});

