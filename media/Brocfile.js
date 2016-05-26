var path = require('path');
var babel = require('broccoli-babel-transpiler');
var mergeTrees = require('broccoli-merge-trees');
var Funnel = require('broccoli-funnel');
var writeFile = require('broccoli-file-creator');
var ESLinter = require('./broccoli-eslint');

var js = 'app/js';
js = new ESLinter(js);
js = babel(js, {
    modules: "amd",
    moduleIds: true,
    sourceMaps: 'inline'
});
js = new Funnel(js, {
    destDir: 'js'
});

function funnelForFile(filepath, outputFilename) {
    var relativeFilepath = path.relative(__dirname, filepath);
    return new Funnel(path.dirname(relativeFilepath), {
        files: [path.basename(relativeFilepath)],
        getDestinationPath: function (relativePath) {
            return outputFilename;
        }
    });
}
var bootstrap = new Funnel('bower_components/bootstrap/dist', {
    destDir: 'vendor/bootstrap'
});
var vendor = mergeTrees([
    bootstrap,
    funnelForFile('bower_components/jquery/dist/jquery.min.js', 'vendor/jquery.js'),
    funnelForFile('bower_components/require/index.js', 'vendor/require.js'),
    funnelForFile(require.resolve('react/dist/react'), 'vendor/react.js'),
    funnelForFile(require.resolve('react-dom/dist/react-dom'), 'vendor/react-dom.js')
]);

var requireConfig = writeFile('/js/require-config.js', 'window.require = ' +
    JSON.stringify({
        shim: {
            "bootstrap": ["jquery"],
            "gapi": {
                exports: "gapi"
            }
        },
        paths: {
            "bootstrap": "/media/vendor/bootstrap/js/bootstrap.min",
            "jquery": "/media/vendor/jquery",
            "react": "/media/vendor/react",
            "react-dom": "/media/vendor/react-dom",
            "gapi": "https://apis.google.com/js/platform"
        }
    }, null, 4));

module.exports = mergeTrees([js, vendor, requireConfig]);
