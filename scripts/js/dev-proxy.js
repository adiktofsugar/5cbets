#!/usr/bin/env node
var http = require('http');
var https = require('https');
var httpProxy = require('http-proxy');
var pem = require('pem');
var fs = require('fs');
var path = require('path');
var parseUrl = require('url').parse;
var formatUrl = require('url').format;

var projectRoot = path.resolve(__dirname, '../..');

var useSelfSigned = false;
function getKeys(callback) {
    if (useSelfSigned) {
        pem.createCertificate({selfSigned: true}, callback);
        return;
    }
    var csr = path.join(projectRoot, 'ssl/squaresplit_com.csr');
    var crt = path.join(projectRoot, 'ssl/__squaresplit_com.crt');
    var key = path.join(projectRoot, 'ssl/squaresplit_com.key');
    try {
        callback(null, {
            serviceKey: fs.readFileSync(key),
            certificate: fs.readFileSync(crt)
        });
    } catch (e) {
        callback(e);
    }
}

getKeys(function (error, keys) {
    if (error) {
        console.error(error);
        return process.exit(1);
    }
    

    var sslOptions = {
        key: keys.serviceKey,
        cert: keys.certificate
    };

    function onProxyError(error) {
        console.error('[PROXY ERROR]', error);
    }
    var proxy = httpProxy.createServer({
        ssl: sslOptions,
        target: 'http://localhost:8080',
        autoRewrite: true,
        changeOrigin: true
    })
    .on('error', onProxyError);

    function createServer(module) {
        var port = 80;
        var forwardedPort = 9080;
        if (module == https) {
            port = 443;
            forwardedPort = 9443;
        }
        
        var args = Array.prototype.slice.call(arguments, 1);
        module.createServer.apply(module, args)
        .listen(forwardedPort, function () {
            console.log("Listening on port " + port + ". It should show up as " +
                forwardedPort + " if you've run sq-dev-setup.");
        })
        .on('error', function (error) {
            console.error('[HTTP' + (module == https && 'S') + ' ERROR]', error);
            process.exit(1);
        });
    }
    createServer(https, sslOptions, function (request, response) {
        console.log("Got request for " + request.url);
        proxy.web(request, response);
    })
    createServer(http, function (request, response) {
        var url = parseUrl(request.url);
        var host = url.hostname || request.headers['host'];
        response.writeHead(301, {
            'Location': formatUrl(Object.assign(url, {
                hostname: host,
                protocol: 'https'
            }))
        });
        response.end();
    });
});
