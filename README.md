# VSCode AEM Sync

This sync feature is ported from AEM Brackets Extension (https://github.com/adobe/aem-brackets-extension).

Not only files, but also folders, `.content.xml`, `dialog.xml`, etc., can be synced.

## Usage

Right-click on a file or a folder in Explorer or Editor, and execute
* `Export to AEM Server`
* `Import from AEM Server`

If auto-push feature is enabled, `Export to AEM Server` is executed automatically, when a file is saved.

## Settings

|Name|Description|Default|
|:-|:-|:-|
|aemsync.server|Server URL|http://localhost:4502|
|aemsync.user|Username|admin|
|aemsync.password|Password|admin|
|aemsync.autopush|Automitically synchronize file-system changes to server|false|
|aemsync.acceptSelfSignedCert|Accept self-signed certificates for HTTPs|false|