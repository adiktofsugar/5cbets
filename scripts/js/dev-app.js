#!/usr/bin/env node
var path = require('path');
var spawn = require('child_process').spawn;

var projectRoot = path.resolve(__dirname, '../..');
var logPath = "/tmp/dev_appserver.logs";

var options = {
    cwd: projectRoot,
    stdio: 'inherit'
};

// kill previous server processes using port 8080

var devServer = spawn('bash', [
    '-c',
    'dev_appserver.py ' +
        '--port=3000 ' +
        '--enable_sendmail=yes ' +
        '--logs_path="' + logPath + '" ' +
        // '--host="dev.squaresplit.com" ' + 
        // '--port=8080 ' + 
        // '--admin_host="dev.squaresplit.com" ' + 
        // '--admin_port=8000 ' + 
        'appengine'], options)
.on('data', function (d) {
    console.log('data: ' + d);
})
.on('error', function (e) {
    console.error('error: ' + e);
})
.on('exit', function (code) {
    console.log('--- DONE ---', code);
});
