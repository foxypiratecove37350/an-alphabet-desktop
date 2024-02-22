const { Menu, app, BrowserWindow } = require('electron');
const path = require('path')

function createWindow () {
	const win = new BrowserWindow({
		width: 800,
		height: 600,
		icon: path.join(__dirname, '/res/images/icon.png'),
		webPreferences: {
			devTools: true, // false,
			nodeIntegration: true,
			preload: path.join(__dirname, "/res/javascript/conversion.js")
		}
	});

	// Menu.setApplicationMenu(null)

	win.loadFile(path.join(__dirname, './res/index.html'));
}

app.whenReady().then(() => {
	createWindow();

	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow();
		}
	});
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});