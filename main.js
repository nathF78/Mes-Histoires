const { app, BrowserView, BrowserWindow, webContents, dialog, ipcMain, Menu } = require('electron')
const path = require('path')
const url = require('url')
const fs = require('fs');
const db = require('electron-db');
const { initial } = require('lodash');
const { pathToFileURL } = require('node:url'); //pour les utilisateurs de windows...
const { exit } = require('process');

const audioCompatibility = ['.3gp', '.avi', '.mov', '.mp4', '.m4v', '.m4a', '.mp3', '.mkv', '.ogv', '.ogm', '.ogg', '.oga', '.webm', '.wav']
const imageCompatibility = ['.bmp', '.gif', '.jpg', '.jpeg', '.png', '.webp']

var currentPath = "stories";

const homePath = app.getPath('home');
var librariePath = path.join(homePath, 'Mes Histoires');

function Element(name, audio, image, path, id) {
  this.name = name;
  this.audio = audio;
  this.image = image;
  this.path = path;
  this.id = id;
}

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    icon: __dirname + "icon.ico",
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  win.maximize();
  win.setAlwaysOnTop(true, 'screen-saver');
  process.env.MAIN_WINDOW_ID = win.id;
  //win.webContents.openDevTools();
  //Pour utiliser BookCreator
  win.webContents.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.92 Safari/537.36");
  win.loadFile('pages/base_interface.html')
  //Page du contenu 
  const view = new BrowserView({
    webPreferences: { 
      devTools: true, 
      //contextIsolation: true, 
      preload: path.join(app.getAppPath(), 'preload.js') 
    }
  });
  win.setBrowserView(view)
  process.env.VIEW_WINDOW_ID = view.webContents.id;
  view.setBounds({ x: 0, y: 90, width: win.getSize()[0], height: win.getSize()[1] - 90 })
  view.webContents.openDevTools();
  getMainWindow().webContents.send('choose-content', currentPath);
 if (currentPath == "books") {
    view.webContents.loadFile('pages/books.html')
  }
  else {
    view.webContents.loadFile('pages/storiesAndMusics.html')
  }
  //nativeTheme.themeSource = 'light'
}



app.whenReady().then(() => {
  ipcMain.on('set-title', handleSetTitle)
  ipcMain.handle('openFile', handleFileOpen)
  ipcMain.handle('get-current-path', handleGetCurrentPath)
  ipcMain.handle('get-elements', handleGetElements)
  ipcMain.handle('get-test', handleGetTest)
  ipcMain.on('set-current-path', handleSetCurrentPath)
  ipcMain.on('set-content', handleSetContent)
  ipcMain.on('require-init', init)
  ipcMain.on('close', handleClose)
  init()
  createWindow()
  getMainWindow().webContents.once('dom-ready', () => {
    getMainWindow().webContents.send('choose-content', currentPath);
  });
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

function handleSetTitle(event, title) {
  const webContents = event.sender
  const win = BrowserWindow.fromWebContents(webContents)
  win.setTitle(title)
}

function handleChooseStorie(event, id) {
  console.log(currentPath + id + " choosed");
}

function handleGetCurrentPath(event) {
  return currentPath;
}

function handleGetElements(event) {
  return initElements(currentPath);
}

function handleGetTest(event) {
  console.log("test");
}
function handleSetCurrentPath(event, newPath) {
  currentPath = newPath;
  console.log("currentPath changed to " + currentPath);
}

async function handleFileOpen() {
  const { canceled, filePaths } = await dialog.showOpenDialog()
  if (canceled) {
    return
  } else {
    return filePaths[0]
  }
}

function init() {

  if (fs.existsSync(librariePath)) { // Do something }
    let stories = initElements("stories");
    let musics = initElements("musics");
    console.log("\nLes histoires suivantes ont étés chargées :\n");
    console.log(stories);
    console.log("\nLes musiques suivantes ont étés chargées :\n");
    console.log(musics);
    
    // for (let i = 0; i < stories.length; i++) {
    //   console.log("loading " + stories[i].name)
    //   //getMainWindow().webContents.send('add-storie', stories[i])
    // }
  }
  else {
    getMainWindow().setAlwaysOnTop(false);
    id = dialog.showMessageBoxSync(getMainWindow(),{
      type: "info",
      buttons: ["Créer la Bibliothèque", "Quitter Mes Histoires"],
      defaultId: 0,
      cancelId: 1,
      title: "Bibliothèque introuvable",
      message: "La Bibliothèque de Mes Histoires est introuvable. Voulez vous la créer dans \n \"" + librariePath + "\" ?"
    })
    if (id == 1) {
      exit(0);
    }
    else {
      createLibrary();
      dialog.showMessageBoxSync(getMainWindow(),{
        type: "info",
        buttons: ["Quitter Mes Histoires"],
        defaultId: 0,
        title: "Bibliothèque crée avec succès",
        message: "La Bibliothèque de Mes Histoires à été crée avec succès.\n Vous pouvez maintenant quitter l'application et ajouter vos fichiers dans \n \"" + librariePath + "\""
      })
      exit(0);
    }
  }

}

//create a tab with the requested elements (stories or musics)
function initElements(element) {
  //génération du tableau des histoires
  try {
    var elements = readDirectory(element);
    for (let i = 0; i < elements.length; i++) {
      var elementName = elements[i];
      elements[i] = new Element;
      elements[i].name = elementName;
      elements[i].path = path.join(librariePath, element, elementName);
      elements[i].id = i;

      try {
        elements[i].audio = findAudio(elements[i].path);
      } catch (e) {
        console.error(e);
      }

      try {
        elements[i].image = findImg(elements[i].path);
      } catch (e) {
        console.error(e);
      }

    }
    return elements;
  } catch (e) {
    console.error(e);
  }

}


function readDirectory(directory) { //lit les histoires
  completePath = path.join(librariePath, directory);
  if (fs.existsSync(completePath)) { // Do something }
    let files = fs.readdirSync(completePath);
    files = files.filter(function (f) { return f !== '.DS_Store' }) //delete macOS useless file 
    return files;
  }
  else {
    throw "DirectoryError"
  }
}

function findImg(directory) { //give the audio file stored in a storie absolute path 
  let files = fs.readdirSync(directory);
  files = files.filter(function (f) {

    for (const extension of imageCompatibility) { //est ce qu'une extension image est reconnue 
      if (f.includes(extension)) {
        return f
      }
    }
  })
  if (files[0] == undefined) {
    throw 'No compatible image file found'
  }
  return pathToFileURL(path.join(directory, files[0])).href;
}

function findAudio(directory) { //give the audio file stored in a storie absolute path 
  let files = fs.readdirSync(directory);
  files = files.filter(function (f) {

    for (const extension of audioCompatibility) { //est ce qu'une extension audio est reconnue 
      if (f.includes(extension)) {
        return f
      }
    }

  })
  if (files[0] == undefined) {
    throw 'No compatible audio file found'
  }
  return pathToFileURL(path.join(directory, files[0])).href;
}

function createLibrary() {
  try {
    fs.mkdirSync(librariePath)
    fs.mkdirSync(path.join(librariePath,"stories"))
    fs.mkdirSync(path.join(librariePath,"musics"))
  } catch (err) {
    if (err.code !== 'EEXIST') throw err
  }
}

const getMainWindow = () => {
  const ID = process.env.MAIN_WINDOW_ID * 1;
  return BrowserWindow.fromId(ID)
}

const getViewContent = () => {
  const ID = process.env.VIEW_WINDOW_ID * 1;
  return webContents.fromId(ID)
}

function handleClose()
 {
  exit(0);
 }

function handleSetContent(event, content) {
  console.log("so far so good")
  currentPath = content;
  getMainWindow().webContents.send('choose-content', currentPath);
  getViewContent().loadFile('pages/storiesAndMusics.html');
  
}