'use strict'

import { app, BrowserWindow, session } from 'electron'
import * as path from 'path'
import { format as formatUrl, parse } from 'url'
import express from 'express'

const isDevelopment = process.env.NODE_ENV !== 'production'

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow

function createMainWindow() {
    const window = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            plugins: true,
            webSecurity: false,
        }
    })

    if (isDevelopment) {
        window.webContents.openDevTools()
    }

    if (isDevelopment) {
        window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`)
    }
    else {
        window.loadURL(formatUrl({
            pathname: path.join(__dirname, 'index.html'),
            protocol: 'file',
            slashes: true
        }))
    }

    window.on('closed', () => {
        mainWindow = null
    })

    window.webContents.on('devtools-opened', () => {
        window.focus()
        setImmediate(() => {
            window.focus()
        })
    })

    return window
}

// quit application when all windows are closed
app.on('window-all-closed', () => {
    // on macOS it is common for applications to stay open until the user explicitly quits
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
app.commandLine.appendSwitch('disable-site-isolation-trials')
app.on('activate', () => {
    // on macOS it is common to re-create a window even after all windows have been closed
    if (mainWindow === null) {
        mainWindow = createMainWindow()
    }
})

// create main BrowserWindow when electron is ready
app.on('ready', () => {
    // Clear x-guest-token for twitter saved on cookie
    session.defaultSession.clearStorageData({storages:['cookies']})
    
    mainWindow = createMainWindow()
})

//https://github.com/stomita/electron-salesforce-oauth2-example/blob/master/src/renderer.js
/**
 * Start express HTTP server and listen on the specified redirect URL
 */
export async function waitCallback(redirectUri, state, timeout = -1) {
    const { protocol, hostname, port, pathname } = parse(redirectUri);
    if (protocol !== 'http:' || hostname !== 'localhost') {
      throw new Error('redirectUri should be an http://localhost url');
    }
    return new Promise((resolve, reject) => {
      const callbackApp = express();
      callbackApp.get(pathname, async (req, res) => {
        if (req.query.state !== state){
            resolve(null)
            res.send('<html><body>failed: invalid state <script>window.close()</script></body></html>')
        }
        resolve(req.query);
        res.send('<html><body>success <script>window.close()</script></body></html>');
        setTimeout(shutdown, 100)
      });
      const server = callbackApp.listen(port);
      const shutdown = (reason) => {
        server.close();
        if (reason) {
          reject(new Error(reason));
        }
      };
      if (timeout >= 0) {
        setTimeout(() => shutdown('timeout'), timeout);
      }
    });
  }
