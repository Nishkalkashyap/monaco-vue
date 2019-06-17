'use strict';
import * as worker from 'monaco-editor/esm/vs/editor/editor.worker';
import { VueWorker } from './vueWorker';
self.onmessage = function () {
    // ignore the first message
    worker.initialize(function (ctx, createData) {
        return new VueWorker(ctx, createData);
    });
};
