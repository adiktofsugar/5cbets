#!/usr/bin/env node
var usage = [
'dev [-h]',
'Starts dev-app.js and dev-media.js and dev-proxy.js'
].join("\n");

var argv = require('minimist')(process.argv.slice(2), {
    alias: {
        'h': 'help'
    },
    boolean: ['help']
});

if (argv.help) {
    console.log(usage);
    process.exit();
}

var path = require('path');
var spawn = require('child_process').spawn;
var projectRoot = path.resolve(__dirname, '../..');

var options = {
    cwd: projectRoot,
    stdio: 'inherit'
};
var processes = [
    path.join(projectRoot, 'scripts/js/dev-media.js'),
    path.join(projectRoot, 'scripts/js/dev-app.js')
    //path.join(projectRoot, 'scripts/js/dev-proxy.js')
].map(function (scriptPath) {
    var args = ['node', [scriptPath]];
    if (scriptPath instanceof Array) {
        args = scriptPath;
    }
    args.push(options);
    var child =  spawn.apply(null, args);
    child.on('close', onClose.bind(child))
    child.on('error', onError.bind(child));
    return child;
});

function onError(error) {
    var child = this;
    console.error("[DEV ERROR] child " + child);
    console.error(error);
    child.kill();
}
var processStatuses = [];
function ProcessStatus(pid) {
    this.isDead = false
    this.signalSent = false;
    this.pid = pid;
}
function onClose() {
    var child = this;
    console.log("[DEV CLOSE] pid " + child.pid, arguments);
    var deadProcesses = [];
    processes.forEach(function (p) {
        var pid = p.pid;
        var status = processStatuses.find(function (processStatus) {
            return (processStatus.pid == pid);
        });
        if (!status) {
            status = new ProcessStatus(pid);
            processStatuses.push(status);
        }
        if (pid == child.pid) {
            console.log("[DEV CLOSE] setting pid " + pid + " to completed");
            status.isDead = true;
        } else if (!status.signalSent) {
            console.log("[DEV CLOSE] killing child process with id " + pid);
            p.kill();
            status.signalSent = true;
        }
        if (status.isDead) {
            deadProcesses.push(p);
        }
    });
    if (deadProcesses.length == processes.length) {
        console.error("Exiting");
        process.exit(1);
    }
}
