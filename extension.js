// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const VaultSyncManager = require('./sync/VaultSyncManager');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	var config = vscode.workspace.getConfiguration('aemsync');
	var	autopush = config.get('autopush');
	var currentFile = vscode.window.activeTextEditor.document.fileName.replace(/\//g, '\\');

	if (autopush) {
		vscode.workspace.onDidSaveTextDocument(function(document) {
			push(document.uri.fsPath.replace(/\//g, '\\'));
		});
	}

	context.subscriptions.push(vscode.commands.registerCommand('extension.aempush', function () {
		push(currentFile);
	}));

	context.subscriptions.push(vscode.commands.registerCommand('extension.aempull', function () {
		pull(currentFile)
		for (var editor of vscode.window.visibleTextEditors) {
			if (!editor.document.isDirty) {
				vscode.commands.executeCommand('workbench.action.files.revert', editor.document.uri);
			}
		}
	}));
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

function getFilterFiles() {
	return vscode.workspace.findFiles('**/src/main/content/META-INF/vault/filter.xml');
}

function push(path) {
	if (!path.includes('jcr_root')) {
		return;
	}
	var config = vscode.workspace.getConfiguration('aemsync');
	var server = config.get('server'),
		acceptSelfSignedCert = true,
		user = config.get('username'),
		password = config.get('password');

	if (path.endsWith('.content.xml')) {
		path = path.substring(0, path.length - 13);
	}
	getFilterFiles().then((filterFiles) => {
		var filterFile = filterFiles[0].fsPath.replace(/\//g, '\\');
		VaultSyncManager.sync(server, acceptSelfSignedCert, user, password, path, filterFile, VaultSyncManager.PUSH);
	}, () => {
		vscode.window.showInformationMessage("filterFileの取得に失敗しました");
	});
}

function pull(path) {
	if (!path.includes('jcr_root')) {
		return;
	}
	var config = vscode.workspace.getConfiguration('aemsync');
	var server = config.get('server'),
		acceptSelfSignedCert = true,
		user = config.get('username'),
		password = config.get('password');

	if (path.endsWith('.content.xml')) {
		path = path.substring(0, path.length - 13);
	}
	getFilterFiles().then((filterFiles) => {
		var filterFile = filterFiles[0].fsPath.replace(/\//g, '\\');
		VaultSyncManager.sync(server, acceptSelfSignedCert, user, password, path, filterFile, VaultSyncManager.PULL);
	}, () => {
		vscode.window.showInformationMessage("filterFileの取得に失敗しました");
	});
}

module.exports = {
	activate,
	deactivate
}
