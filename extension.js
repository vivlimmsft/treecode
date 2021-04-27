// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const install = require('install-package');
var npmi = require('npmi');
var options = {
	name: 'tree-sitter',	// your module name
	version: 'latest',		// expected version [default: 'latest']
	path: '~/treebuild',				// installation path [default: '.']
	forceInstall: true,	// force install if set to true (even if already installed, it will do a reinstall) [default: false]
	npmLoad: {				// npm.load(options, callback): this is the "options" given to npm.load()
		loglevel: 'verbose'	// [default: {loglevel: 'silent'}]
	}
};

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "treecode" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('treecode.helloWorld', function () {
		// The code you place here will be executed every time your command is executed
		console.log("Doing build");

		// Display a message box to the user
		vscode.window.showInformationMessage('starting build ' + npmi.NPM_VERSION);
		npmi(options, function (err, result) {
			if (err) {
				if 		(err.code === npmi.LOAD_ERR) 	console.log('npm load error');
				else if (err.code === npmi.INSTALL_ERR) console.log('npm install error');
				vscode.window.showInformationMessage('error '+ err.message);
				return console.log(err.message);
			}

			// installed
			vscode.window.showInformationMessage('done build');
			console.log(options.name+'@'+options.version+' installed successfully in '+path.resolve(options.path));
		});
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
