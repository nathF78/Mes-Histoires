const { contextBridge, ipcRenderer } = require('electron')
const { readSync } = require('original-fs')

window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
      const element = document.getElementById(selector)
      if (element) element.innerText = text
    }
  
    for (const dependency of ['chrome', 'node', 'electron']) {
      replaceText(`${dependency}-version`, process.versions[dependency])
    }
  })
  
contextBridge.exposeInMainWorld('electronAPI', {
    setTitle: (title) => ipcRenderer.send('set-title', title),
    init: () => ipcRenderer.send('require-init'),
    setCurrentPath: (newPath) => ipcRenderer.send('set-current-path', newPath),
    chooseStorie: (id) => ipcRenderer.send('choose-storie', id),
    close : () => ipcRenderer.send('close'),
    openFile: () => ipcRenderer.invoke('openFile'),
    getCurrentPath: () => ipcRenderer.invoke('get-current-path'),
    getStories: () => ipcRenderer.invoke('get-stories'),
    getTest: () => ipcRenderer.invoke('get-test'),
    onUpdateCounter: (callback) => ipcRenderer.on('update-counter', callback),
    onAddStorie: (callback) => ipcRenderer.on('add-storie', callback),

})
