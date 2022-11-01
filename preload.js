const { contextBridge, ipcRenderer } = require("electron");
const { readSync } = require("original-fs");

window.addEventListener("DOMContentLoaded", () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const dependency of ["chrome", "node", "electron"]) {
    replaceText(`${dependency}-version`, process.versions[dependency]);
  }
});

contextBridge.exposeInMainWorld("electronAPI", {
  setTitle: (title) => ipcRenderer.send("set-title", title),
  init: () => ipcRenderer.send("require-init"),
  setCurrentContent: (content) => ipcRenderer.send("set-current-content", content),
  onUpdateContent : (callback) => ipcRenderer.on('update-current-content', callback),
  addElement: (element) => ipcRenderer.send("add-element", element),
  deleteElement: (type, id) => ipcRenderer.send("delete-element", type, id),
  //setContent: (content) => ipcRenderer.send("set-content", content),
  chooseStorie: (id) => ipcRenderer.send("choose-storie", id),
  close: () => ipcRenderer.send("close"),
  showDiagBox: (value) => ipcRenderer.send("show-diag-box", value),
  openFile: () => ipcRenderer.invoke("openFile"),
  getCurrentPath: () => ipcRenderer.invoke("get-current-path"),
  getCurrentContent: () => ipcRenderer.invoke("get-current-content"),
  getElements: () => ipcRenderer.invoke("get-elements"),
  getMusics: () => ipcRenderer.invoke("get-musics"),
  onChooseContent: (callback) => ipcRenderer.on("choose-content", callback),
  onSendCurrentContent: (callback) => ipcRenderer.on("send-current-content", callback),
  onAddStorie: (callback) => ipcRenderer.on("add-storie", callback)
});
