// http://eslint.org/docs/developer-guide/nodejs-api
var fs       = require('fs-extra');
var path     = require('path');
var Plugin   = require('broccoli-plugin');
var chalk = require('chalk');
var glob = require('glob');
var CLIEngine = require('eslint').CLIEngine;

ESLinter.prototype = Object.create(Plugin.prototype);
ESLinter.prototype.constructor = ESLinter;
function ESLinter(inputNodes, options) {
    if (!(this instanceof ESLinter)) return new ESLinter(inputNode, options);
    if (!Array.isArray(inputNodes)) {
        inputNodes = [inputNodes];
    }
    options = options || {};
    Plugin.call(this, inputNodes, {
        annotation: options.annotation
    });
    this.options = options;
};

ESLinter.prototype.build = function () {
    var self = this;

    var errors = [];
    this.inputPaths.forEach(function (inputPath) {
        var parentDirectory = inputPath;
        var cli = new CLIEngine({
            cwd: parentDirectory,
            cacheLocation: this.cachePath
        });
        var files = glob.sync("**/**/*.js", {
            cwd: parentDirectory
        });
        var report = cli.executeOnFiles(files);
        var newErrors = [];

        report.results.forEach(function (result) {
            result.messages.forEach(function (message) {
                var relativePath = path.relative(process.cwd(), result.filePath);
                newErrors.push(
                    Object.assign(message, {
                        filePath: relativePath
                    })
                );
            });
        })
        errors = errors.concat(newErrors);
        fs.copySync(inputPath, self.outputPath);
    });
    // potentially throw an error if something fatal happened?
    if (errors.length) {
        this.logErrors(errors);
        console.log(chalk.yellow('===== ' + errors.length + 
            ' ESLinter Error' + (errors.length > 1 ? 's' : '') + '\n'));
    } else {
        console.log(chalk.green("====== ESLinter success"));
    }
    return this;
}

ESLinter.prototype.logErrors = function (errors) {
    errors.forEach(function (error) {
        console.log(
            error.filePath + 
            ' line ' + error.line +
            ' col ' + error.column +
            ' rule ' + error.ruleId +
            '\n' +
            chalk.red(error.message)
        );
    });
}

module.exports = ESLinter;
