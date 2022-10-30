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
    setContent: (content) => ipcRenderer.send('set-content', content),
    chooseStorie: (id) => ipcRenderer.send('choose-storie', id),
    close : () => ipcRenderer.send('close'),
    openFile: () => ipcRenderer.invoke('openFile'),
    getCurrentPath: () => ipcRenderer.invoke('get-current-path'),
    getElements: () => ipcRenderer.invoke('get-elements'),
    getTest: () => ipcRenderer.invoke('get-test'),
    getMusics: () => ipcRenderer.invoke('get-musics'),
    getTest: () => ipcRenderer.invoke('get-test'),
    onChooseContent: (callback) => ipcRenderer.on('choose-content', callback),
    onAddStorie: (callback) => ipcRenderer.on('add-storie', callback),

})
