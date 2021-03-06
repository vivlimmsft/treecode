// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const install = require('install-package');
var npmi = require('npmi');
var options = {
	name: 'tree-sitter',
	version: 'latest',
	path: __dirname, // NOTE: this will write to the *current project's* package.json, you will probably want to be careful to make sure that doesn't get committed (or if it does, that it is excluded from npm pack?)
	forceInstall: true,	// force install if set to true (even if already installed, it will do a reinstall) [default: false]
	npmLoad: {				// npm.load(options, callback): this is the "options" given to npm.load()
		loglevel: 'verbose',	// [default: {loglevel: 'silent'}]
		/* this did not work, but leaving it here for now. setting env vars did work, maybe I was missing something here.
		target: process.versions.electron,
		arch: 'x64',
		'dist-url': 'https://electronjs.org/headers',
		*/
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
	let disposable = vscode.commands.registerCommand('treecode.dobuild', function () {
		// The code you place here will be executed every time your command is executed
		console.log("building tree-sitter");

		// Set environment variables on this process so that we build for the current version of electron.
		// todo: revert to original values, or lack thereof, afterward
		// https://www.electronjs.org/docs/tutorial/using-native-node-modules
		process.env['npm_config_target'] = process.versions.electron;
		process.env['npm_config_arch'] = "x64";
		process.env['npm_config_target_arch'] = "x64";
		process.env['npm_config_disturl'] = "https://electronjs.org/headers";
		process.env['npm_config_runtime'] = "electron";
		process.env['npm_config_build_from_source'] = true;

		// Display a message box to the user
		vscode.window.showInformationMessage('tree-sitter: starting build for node ' + process.version + ' using npm ' + npmi.NPM_VERSION);
		npmi(options, function (err, result) {
			if (err) {
				if 		(err.code === npmi.LOAD_ERR) 	console.log('npm load error');
				else if (err.code === npmi.INSTALL_ERR) console.log('npm install error');
				vscode.window.showInformationMessage('error '+ err.message);
				return console.log(err.message);
			}

			// installed
			vscode.window.showInformationMessage('tree-sitter: done build');

			// ugly: patch options with other package name
			options.name = 'tree-sitter-javascript';
			vscode.window.showInformationMessage('tree-sitter-javascript: starting build using npm ' + npmi.NPM_VERSION);
			npmi(options, function (err, result) {
				if (err) {
					if 		(err.code === npmi.LOAD_ERR) 	console.log('npm load error');
					else if (err.code === npmi.INSTALL_ERR) console.log('npm install error');
					vscode.window.showInformationMessage('error '+ err.message);
					return console.log(err.message);
				}

				// installed
				vscode.window.showInformationMessage('tree-sitter-javascript: done build');
			});
		});
	});

	let disposable2 = vscode.commands.registerCommand('treecode.invoke', function () {
		try {
			/*
			if mismatch, get this error msg
invoke failed: Error: The module '/home/vivlim/tmp/tree/treecode/node_modules/tree-sitter/build/Release/tree_sitter_runtime_binding.node'
was compiled against a different Node.js version using
NODE_MODULE_VERSION 83. This version of Node.js requires
NODE_MODULE_VERSION 80. Please try re-compiling or re-installing
the module (for instance, using `npm rebuild` or `npm install`).
*/
		const Parser = require('tree-sitter');
		const JavaScript = require('tree-sitter-javascript');

		const parser = new Parser();
		parser.setLanguage(JavaScript);
		const sourceCode = 'let x = 1; console.log(x);';
		const tree = parser.parse(sourceCode);
		console.log(tree.rootNode.toString());

		// (program
		//   (lexical_declaration
		//     (variable_declarator (identifier) (number)))
		//   (expression_statement
		//     (call_expression
		//       (member_expression (identifier) (property_identifier))
		//       (arguments (identifier)))))

		const callExpression = tree.rootNode.child(1).firstChild;
		console.log(callExpression);
		vscode.window.showInformationMessage(callExpression.toString());

		// { type: 'call_expression',
		//   startPosition: {row: 0, column: 16},
		//   endPosition: {row: 0, column: 30},
		//   startIndex: 0,
		//   endIndex: 30 }
		}
		catch (e)
		{
			vscode.window.showErrorMessage('invoke failed: ' + e);
		}
	});

	context.subscriptions.push(disposable);
	context.subscriptions.push(disposable2);
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
