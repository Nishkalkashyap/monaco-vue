const webpack = require('webpack');

module.exports = {
    mode: 'development',
    entry: {
        vue: './out/vue.worker'
    },
    output: {
        path: require('path').resolve(__dirname, './webpack-build'),
        filename: 'vue.worker.js'
    },
    target: 'electron-renderer',
    plugins: [
        new webpack.ContextReplacementPlugin(
            /monaco-editor(\\|\/)esm(\\|\/)vs(\\|\/)editor(\\|\/)common(\\|\/)services/,
            __dirname
        )
    ]
}