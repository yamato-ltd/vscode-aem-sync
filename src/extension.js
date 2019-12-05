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
	vscode.workspace.onDidSaveTextDocument(function (document) {
		const autopush = vscode.workspace.getConfiguration('aemsync').get('autopush');
		const path = document.uri.fsPath;
		if (path.includes('jcr_root') && autopush) {
			SyncManager.push(path);
		}
	});

	context.subscriptions.push(vscode.commands.registerCommand('extension.aempush', (filePath) => {
		SyncManager.push(filePath.fsPath);
	}));

	context.subscriptions.push(vscode.commands.registerCommand('extension.aempull', (filePath) => {
		SyncManager.pull(filePath.fsPath);
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
	static push(path) {
		if (!path.includes('jcr_root')) {
			vscode.window.showErrorMessage(`path not under jcr_root folder: ${path}`);
			return;
		}
		const server = SyncManager.getServer();
		const acceptSelfSignedCert = SyncManager.getAcceptSelfSignedCert();
		const user = SyncManager.getUser();
		const password = SyncManager.getPassword();
		const filterPath = SyncManager.getFilterPath(path);
		VaultSyncManager.sync(server, acceptSelfSignedCert, user, password,
			path, filterPath, VaultSyncManager.PUSH).then(() => {
				vscode.window.showInformationMessage(`Successfully exported: ${SyncManager.getRemotePath(path)}`);
			}, (err) => {
				vscode.window.showErrorMessage(`Failed to export: ${SyncManager.getRemotePath(path)} ${err}`);
			});
	}
	
	static pull(path) {
		if (!path.includes('jcr_root')) {
			vscode.window.showErrorMessage(`path not under jcr_root folder: ${path}`);
			return;
		}
		const server = this.getServer();
		const acceptSelfSignedCert = this.getAcceptSelfSignedCert();
		const user = this.getUser();
		const password = this.getPassword();
		const filterPath = SyncManager.getFilterPath(path);
		VaultSyncManager.sync(server, acceptSelfSignedCert, user, password,
			path, filterPath, VaultSyncManager.PULL).then(() => {
				vscode.window.showInformationMessage(`Successfully Imported: ${SyncManager.getRemotePath(path)}`);
			}, (err) => {
				vscode.window.showErrorMessage(`Failed to import: ${SyncManager.getRemotePath(path)} ${err}`);
			});
	}

	static getServer() {
		return vscode.workspace.getConfiguration('aemsync').get('server');
	}

	static getAcceptSelfSignedCert() {
		return vscode.workspace.getConfiguration('aemsync').get('acceptSelfSignedCert');
	}

	static getUser() {
		return vscode.workspace.getConfiguration('aemsync').get('user');
	}

	static getPassword() {
		return vscode.workspace.getConfiguration('aemsync').get('password');
	}

	static getFilterPath(path) {
		// pathに最も近いfilter.xmlを取得する
		const root = path.substring(0, path.indexOf('jcr_root') - 1)
		const filterPath = Path.join(root, 'META-INF', 'vault', 'filter.xml');
		return filterPath;
	}

	static getRemotePath(path) {
		return path.substring(path.indexOf('jcr_root') + 8);
	}
}

module.exports = {
	activate,
	deactivate
}
