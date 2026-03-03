const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

// 設定ファイルの保存場所（ユーザーのPC内に自動作成されます）
const configPath = path.join(app.getPath('userData'), 'config.json');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 900,
    backgroundColor: '#080808',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadFile('index.html');

  // 起動時に、保存されている「フォルダのパス」を画面（HTML）に送る
  win.webContents.on('did-finish-load', () => {
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      win.webContents.send('load-config', config);
    }
  });
}

// 画面側から「このフォルダを覚えておいて！」と言われた時の処理
ipcMain.on('save-config', (event, config) => {
  fs.writeFileSync(configPath, JSON.stringify(config));
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});