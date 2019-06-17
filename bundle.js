const requirejs = require('requirejs');
const path = require('path');
const fs = require('fs');
const UglifyJS = require("uglify-js");
const helpers = require('monaco-plugin-helpers');

const REPO_ROOT = path.resolve(__dirname);

const sha1 = helpers.getGitVersion(REPO_ROOT);
const semver = require('./package.json').version;
const headerVersion = semver + '(' + sha1 + ')';

var uriLocation = getDependencyLocation('vscode-uri', 'lib', 'vscode-html-languageservice').replace(/\\/g, '//');

const BUNDLED_FILE_HEADER = [
    '/*!-----------------------------------------------------------------------------',
    ' * Copyright (c) Microsoft Corporation. All rights reserved.',
    ' * monaco-css version: ' + headerVersion,
    ' * Released under the MIT license',
    ' * https://github.com/Microsoft/monaco-css/blob/master/LICENSE.md',
    ' *-----------------------------------------------------------------------------*/',
    ''
].join('\n');

bundleOne('monaco.contribution', ['vs/language/vue/vueMode']);
bundleOne('lib/typescriptServices');
bundleOne('vueMode', ['vs/language/vue/lib/typescriptServices']);
bundleOne('vueWorker', ['vs/language/vue/lib/typescriptServices']);

function bundleOne(moduleId, exclude) {
    requirejs.optimize({
        baseUrl: '/out/',
        name: 'vs/language/vue/' + moduleId,
        out: 'release/' + moduleId + '.js',
        exclude: exclude,
        paths: {
            'vs/language/vue': path.join(__dirname + '/out')
        },
        packages: [{
            name: 'vscode-html-languageservice',
            location: path.join(__dirname, '/node_modules/vscode-html-languageservice/lib').replace(/\\/g, '//'),
            main: 'htmlLanguageService'
        }, {
            name: 'vscode-languageserver-types',
            location: path.join(__dirname, '/node_modules/vscode-languageserver-types/lib').replace(/\\/g, '//'),
            main: 'main'
        }, {
            name: 'vscode-css-languageservice',
            location: path.join(__dirname, '/node_modules/vscode-css-languageservice/lib').replace(/\\/g, '//'),
            main: 'cssLanguageService'
        }, {
            name: 'vscode-uri',
            location: uriLocation,
            main: 'index'
        }, {
            name: 'vscode-nls',
            location: path.join(__dirname, '/out/fillers').replace(/\\/g, '//'),
            main: 'vscode-nls'
        }]
    }, function (buildResponse) {
        console.log(`Minifying ${devFilePath}...`);
        const devFilePath = path.join(REPO_ROOT, 'release/dev/' + moduleId + '.js');
        const minFilePath = path.join(REPO_ROOT, 'release/min/' + moduleId + '.js');
        const fileContents = fs.readFileSync(devFilePath).toString();
        console.log(`Minifying ${devFilePath}...`);
        const result = UglifyJS.minify(fileContents, {
            output: {
                comments: 'some'
            }
        });
        console.log(`Done.`);
        try {
            fs.mkdirSync(path.join(REPO_ROOT, 'release/min'))
        } catch (err) {
            console.log(err);
        }
        console.log(`Writing : ${minFilePath}`);
        fs.writeFileSync(minFilePath, BUNDLED_FILE_HEADER + result.code);
    })
}


function getDependencyLocation(name, libLocation, container) {
    var location = __dirname + '/node_modules/' + name + '/' + libLocation;
    if (!fs.existsSync(location)) {
        var oldLocation = __dirname + '/node_modules/' + container + '/node_modules/' + name + '/' + libLocation;
        if (!fs.existsSync(oldLocation)) {
            console.error('Unable to find ' + name + ' node module at ' + location + ' or ' + oldLocation);
            return;
        }
        return oldLocation;
    }
    return location;
}