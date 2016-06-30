'use strict';

var commander = require('commander'),
    program = require('../package.json'),
    fs = require('fs'),
    detect = require('./detect.js'),
    save = require('./save.js');

commander.description('Verify proxy list').usage('--input <file ...> --output <file ...>').version(program.version).option('-i, --input <path>', 'proxy list txt file').option('-o, --output <path>', 'verified proxy list').option('-c, --concurrency <concurrency>', 'concurrency, default 10').option('-t, --timeout <n>', 'timeout(s), default 10s').option('-s, --socks5', 'default socks5,if ignore protocol').parse(process.argv);

if (!commander.input) {
    console.error('please provide --input proxy list');
    process.exit(1);
}
if (commander.socks5) {
    detect.enable_socks5();
}

if (!fs.existsSync(commander.input)) {
    console.error(commander.input + ' not exists');
    process.exit(1);
}

var lineReader = require('readline').createInterface({
    input: fs.createReadStream(commander.input)
});

var file = null;
if (commander.output) {
    file = commander.output;
}

lineReader.on('line', function (line) {
    detect.add(line, function (err, result) {
        if (result) {
            save.append({ file: file, line: line }, function () {});
        }
    });
});