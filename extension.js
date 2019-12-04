// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const Path = require('path');
const VaultSyncManager = require('./sync/VaultSyncManager');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	const syncManager = new SyncManager();

	vscode.workspace.onDidSaveTextDocument(function (document) {
		const autopush = vscode.workspace.getConfiguration('aemsync').get('autopush');
		if (autopush) {
			const path = document.uri.fsPath;
			if (path.includes('jcr_root')) {
				syncManager.push(path);
			}
		}
	});

	context.subscriptions.push(vscode.commands.registerCommand('extension.aempush', (filePath) => {
		syncManager.push(filePath.fsPath);
	}));

	context.subscriptions.push(vscode.commands.registerCommand('extension.aempull', (filePath) => {
		syncManager.pull(filePath.fsPath);
		// Importしたファイルを更新する
		for (var editor of vscode.window.visibleTextEditors) {
			if (!editor.document.isDirty) {
				vscode.commands.executeCommand('workbench.action.files.revert', editor.document.uri);
			}
		}
	}));
}

// this method is called when your extension is deactivated
function deactivate() {}

class SyncManager {
	constructor() {
		this.setFilterPath();
	}
	
	push(path) {
		const server = this.getServer();
		const acceptSelfSignedCert = this.getAcceptSelfSignedCert();
		const user = this.getUser();
		const password = this.getPassword();
		VaultSyncManager.sync(server, acceptSelfSignedCert, user, password,
			path, this.filterPath, VaultSyncManager.PUSH).then(() => {
				vscode.window.showInformationMessage(`Successfully exported: ${SyncManager.getRemotePath(path)}`);
			}, (err) => {
				vscode.window.showErrorMessage(`Failed to export: ${SyncManager.getRemotePath(path)} ${err}`);
			});
	}
	
	pull(path) {
		const server = this.getServer();
		const acceptSelfSignedCert = this.getAcceptSelfSignedCert();
		const user = this.getUser();
		const password = this.getPassword();
		VaultSyncManager.sync(server, acceptSelfSignedCert, user, password,
			path, this.filterPath, VaultSyncManager.PULL).then(() => {
				vscode.window.showInformationMessage(`Successfully Imported: ${SyncManager.getRemotePath(path)}`);
			}, (err) => {
				vscode.window.showErrorMessage(`Failed to import: ${SyncManager.getRemotePath(path)} ${err}`);
			});
	}

	getServer() {
		return vscode.workspace.getConfiguration('aemsync').get('server');
	}

	getAcceptSelfSignedCert() {
		return vscode.workspace.getConfiguration('aemsync').get('acceptSelfSignedCert');
	}

	getUser() {
		return vscode.workspace.getConfiguration('aemsync').get('user');
	}

	getPassword() {
		return vscode.workspace.getConfiguration('aemsync').get('password');
	}

	async setFilterPath() {
		const PATH = Path.join('**', 'src', 'main', 'content', 'META-INF', 'vault', 'filter.xml');
		const filterFiles = await vscode.workspace.findFiles(PATH);
		const filterPath = filterFiles[0].fsPath;
		this.filterPath = filterPath;
	}

	static getRemotePath(path) {
		return path.substring(path.indexOf('jcr_root') + 8);
	}
}

module.exports = {
	activate,
	deactivate
}
