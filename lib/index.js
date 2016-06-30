'use strict';

var commander = require('commander'),
    program = require('../package.json'),
    fs = require('fs'),
    detect = require('./detect.js');

commander.description('Verify proxy list').usage('--input <file ...> --output <file ...>').version(program.version).option('-i, --input <path>', 'proxy list txt file').option('-o, --output <path>', 'verified proxy list').option('-c, --concurrency <concurrency>', 'concurrency, default 10').option('-t, --timeout <n>', 'timeout(s), default 10s').option('-s, --socks5', 'default socks5,if ignore protocol').parse(process.argv);

if (commander.socks5) {
    detect.enable_socks5();
}

if (commander.input && !fs.existsSync(commander.input)) {
    console.error(commander.input + ' not exists');
    process.exit(1);
}

var stream;
if (commander.input) {
    stream = fs.createReadStream(commander.input);
} else {
    process.stdin.setEncoding('utf8');
    stream = process.stdin;
}

var lineReader = require('readline').createInterface({
    input: stream
});

var file = process.stdout;
if (commander.output) {
    file = fs.createWriteStream(commander.output, { flags: 'a' });
}

lineReader.on('line', function (line) {
    detect.add(line, function (err, result) {
        if (result) {
            file.write(line + '\r\n');
        }
    });
});