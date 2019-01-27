module.exports = {
    mode : 'development',
    entry: {
        vue: './out/monaco.contribution.js'
    },
    output: {
        path: require('path').resolve(__dirname, './webpack-build'),
        filename: 'vue.worker.js'
    },
    target: 'electron-renderer',
    // externals : {
    //     "monaco-editor-core/esm/vs/editor/editor.worker" : "monaco-editor-core/esm/vs/editor/editor.worker"
    // }
}