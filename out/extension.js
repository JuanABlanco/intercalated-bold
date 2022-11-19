"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const crypto_1 = require("crypto");
const vscode = require("vscode");
// this method is called when vs code is activated
function activate(context) {
    console.log('decorator sample is activated');
    let timeout = undefined;
    // create a decorator type that we use to decorate small numbers
    const wordDecorationType = vscode.window.createTextEditorDecorationType({
        fontWeight: "1000",
    });
    let activeEditor = vscode.window.activeTextEditor;
    function updateDecorations() {
        if (!activeEditor) {
            return;
        }
        const regEx = /\w+/g;
        const text = activeEditor.document.getText();
        const words = [];
        let match;
        while ((match = regEx.exec(text))) {
            const startPos = activeEditor.document.positionAt(match.index);
            let positionParam = Math.round(match.index + match[0].length / 2 + (0, crypto_1.randomInt)(2));
            let endPos = activeEditor.document.positionAt(positionParam);
            console.log(positionParam);
            if (match[0].length < 6) {
                endPos = activeEditor.document.positionAt(match.index + match[0].length / 2);
            }
            const decoration = { range: new vscode.Range(startPos, endPos) };
            words.push(decoration);
            activeEditor.setDecorations(wordDecorationType, words);
        }
    }
    function triggerUpdateDecorations(throttle = false) {
        if (timeout) {
            clearTimeout(timeout);
            timeout = undefined;
        }
        if (throttle) {
            timeout = setTimeout(updateDecorations, 500);
        }
        else {
            updateDecorations();
        }
    }
    if (activeEditor) {
        triggerUpdateDecorations();
    }
    vscode.window.onDidChangeActiveTextEditor(editor => {
        activeEditor = editor;
        if (editor) {
            triggerUpdateDecorations();
        }
    }, null, context.subscriptions);
    vscode.workspace.onDidChangeTextDocument(event => {
        if (activeEditor && event.document === activeEditor.document) {
            triggerUpdateDecorations(true);
        }
    }, null, context.subscriptions);
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map