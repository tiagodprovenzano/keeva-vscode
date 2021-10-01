// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {Component} from '@tiagodprovenzano/react-keeva/'
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "react-keeva-vs" is now active!');
	
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('react-keeva-vs.helloWorld', (uri: vscode.Uri) => {
		console.log("uri.fsPath", uri.fsPath)
		console.log('uri.path', uri.path)
		console.log('uri.fragment', uri.fragment);
		console.log('uri.scheme', uri);
		const inputBox = vscode.window.createInputBox()
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInputBox(inputBox).then((componentName: string | undefined) => {
			console.log(componentName);
			if(componentName){
				try {
					
					new Component(componentName, uri.fsPath).create()
				} catch (error) {
					console.log('====================================');
					console.log(error);
					console.log('====================================');
				}
			}
		});
		// vscode.window.showInformationMessage('Hello World from React Keeva!');
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
