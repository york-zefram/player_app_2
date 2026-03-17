const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

// 設定ファイルの保存場所
const configPath = path.join(app.getPath('userData'), 'config.json');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 900,
    backgroundColor: '#080808',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      // オフライン動作を安定させるための設定
      webSecurity: false, // ローカルリソース（画像・音声）の制限を緩和
      devTools: true      // デバッグ用に有効化
    }
  });

  // メニューバーを非表示にする（ダンス練習に集中できるUIへ）
  win.setMenuBarVisibility(false);

  win.loadFile('index.html');

  // 起動時に保存されている設定を送信
  win.webContents.on('did-finish-load', () => {
    // 開発中のエラー確認用：オフライン時にどこで止まっているかコンソールで確認できます
    // win.webContents.openDevTools(); 

    if (fs.existsSync(configPath)) {
      try {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        win.webContents.send('load-config', config);
      } catch (err) {
        console.error("設定ファイルの読み込みに失敗しました:", err);
      }
    }
  });
}

// 設定の保存処理
ipcMain.on('save-config', (event, config) => {
  try {
    fs.writeFileSync(configPath, JSON.stringify(config));
  } catch (err) {
    console.error("設定の保存に失敗しました:", err);
  }
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
