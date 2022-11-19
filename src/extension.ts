import { randomInt } from 'crypto';
import * as vscode from 'vscode';

// this method is called when vs code is activated
export function activate(context: vscode.ExtensionContext) {

	console.log('decorator sample is activated');

	let timeout: NodeJS.Timer | undefined = undefined;

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
		const words: vscode.DecorationOptions[] = [];
		let match;
		while ((match = regEx.exec(text))) {
			const startPos = activeEditor.document.positionAt(match.index);

			let positionParam = Math.round(match.index + match[0].length/2 + randomInt(2));
			let endPos = activeEditor.document.positionAt(positionParam);
			console.log(positionParam);
			if(match[0].length < 6){
				endPos = activeEditor.document.positionAt(match.index + match[0].length/2);
			} 
			const decoration = { range: new vscode.Range(startPos, endPos)};
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
		} else {
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