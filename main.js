const {
  app,
  BrowserView,
  BrowserWindow,
  webContents,
  dialog,
  ipcMain,
} = require("electron");
const path = require("path");
const url = require("url");
const fs = require("fs");
const db = require("electron-db");
const { initial } = require("lodash");
const { pathToFileURL } = require("node:url"); //pour les utilisateurs de windows...
const { exit } = require("process");
var view;
const audioCompatibility = [
  ".3gp",
  ".avi",
  ".mov",
  ".mp4",
  ".m4v",
  ".m4a",
  ".mp3",
  ".mkv",
  ".ogv",
  ".ogm",
  ".ogg",
  ".oga",
  ".webm",
  ".wav",
];
const imageCompatibility = [".bmp", ".gif", ".jpg", ".jpeg", ".png", ".webp"];

var books = Array();

const homePath = app.getPath("home");
var librariePath = path.join(homePath, "Mes Histoires");

function Element(name, audio, image, path, id, type) {
  this.name = name;
  this.audio = audio;
  this.image = image;
  this.path = path;
  this.id = id;
  this.type = type;
}

function Content(page, settings) {
  this.page = page;
  this.settings = settings;
}

currentContent = new Content("stories", false);

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    //kiosk: true, //fullscreen
    frame: false,
    icon: __dirname + "icon.ico",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
  win.maximize();
  //win.webContents.openDevTools()
  //win.setAlwaysOnTop(true, "screen-saver");
  process.env.MAIN_WINDOW_ID = win.id;
  win.loadFile("pages/base_interface.html");

  //Page du contenu
  view = new BrowserView({
    webPreferences: {
      //devTools: true,
      contextIsolation: true,
      preload: path.join(app.getAppPath(), "preload.js"),
    },
  });
  win.setBrowserView(view);
  process.env.VIEW_CONTENTS_ID = view.webContents.id;
  process.env.VIEW_WINDOW_ID = view.id;
  view.setBounds({
    x: 0,
    y: 90,
    width: win.getSize()[0],
    height: win.getSize()[1] - 90,
  });
  view.webContents.openDevTools();
  view.webContents.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.92 Safari/537.36"
  );
  getMainWindow().webContents.send("choose-content", currentContent.page);
  if (currentContent.page == "books") {
    view.webContents.loadFile("pages/books.html");
  } else {
    view.webContents.loadFile("pages/storiesAndMusics.html");
  }
  //nativeTheme.themeSource = 'light'
}

app.whenReady().then(() => {
  ipcMain.handle("openFile", handleFileOpen);
  ipcMain.handle("get-current-content", handleGetCurrentContent);
  ipcMain.on("set-current-content", handleSetCurrentContent);
  ipcMain.handle("get-elements", handleGetElements);
  ipcMain.on("show-diag-box", handleShowDiagBox);
  ipcMain.on("add-element", handleAddElement);
  ipcMain.on("delete-element", handleDeleteElement);
  ipcMain.on("require-init", init);
  ipcMain.on("close", handleClose);
  init();
  createWindow();
  getMainWindow().webContents.once("dom-ready", () => {
    getMainWindow().webContents.send("choose-content", currentContent.page);
  });
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});


function handleChooseStorie(event, id) {
  console.log(currentContent.page + id + " choosed");
}

function handleGetElements(event) {
  return initElements(currentContent.page);
}


async function handleFileOpen() {
  const { canceled, filePaths } = await dialog.showOpenDialog();
  if (canceled) {
    return;
  } else {
    return filePaths[0];
  }
}

function init() {
  if (fs.existsSync(librariePath)) {
    // Do something }
    let stories = initElements("stories");
    let musics = initElements("musics");
    console.log("\nLes histoires suivantes ont étés chargées :\n");
    console.log(stories);
    console.log("\nLes musiques suivantes ont étés chargées :\n");
    console.log(musics);
  } else {
    getMainWindow().setAlwaysOnTop(false);
    id = dialog.showMessageBoxSync(getMainWindow(), {
      type: "info",
      buttons: ["Créer la Bibliothèque", "Quitter Mes Histoires"],
      defaultId: 0,
      cancelId: 1,
      title: "Bibliothèque introuvable",
      message:
        'La Bibliothèque de Mes Histoires est introuvable. Voulez vous la créer dans \n "' +
        librariePath +
        '" ?',
    });
    if (id == 1) {
      exit(0);
    } else {
      createLibrary();
      dialog.showMessageBoxSync(getMainWindow(), {
        type: "info",
        buttons: ["Quitter Mes Histoires"],
        defaultId: 0,
        title: "Bibliothèque crée avec succès",
        message:
          "La Bibliothèque de Mes Histoires à été crée avec succès.\n Vous pouvez maintenant quitter l'application et ajouter vos fichiers dans \n \"" +
          librariePath +
          '"',
      });
      exit(0);
    }
  }
}

//create a tab with the requested elements (stories,musics or books)
function initElements(element) {
  //génération du tableau des histoires

  if (element == "books") {
    books = readFileToObject("books.json");
    console.log(books);
    return books;
  } else {
    try {
      var elements = readDirectory(element);
      for (let i = 0; i < elements.length; i++) {
        var elementName = elements[i];
        elements[i] = new Element();
        elements[i].name = elementName;
        elements[i].path = path.join(librariePath, element, elementName);
        elements[i].id = i;
        elements[i].type = "storyMusic";
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
}

function readDirectory(directory) {
  //lit les histoires
  completePath = path.join(librariePath, directory);
  if (fs.existsSync(completePath)) {
    //Do something }
    let files = fs.readdirSync(completePath);
    files = files.filter(function (f) {
      return f !== ".DS_Store";
    }); //delete macOS useless file
    return files;
  } else {
    throw "DirectoryError";
  }
}

function findImg(directory) {
  //give the audio file stored in a storie absolute path
  let files = fs.readdirSync(directory);
  files = files.filter(function (f) {
    for (const extension of imageCompatibility) {
      //est ce qu'une extension image est reconnue
      if (f.includes(extension)) {
        return f;
      }
    }
  });
  if (files[0] == undefined) {
    throw "No compatible image file found";
  }
  return pathToFileURL(path.join(directory, files[0])).href;
}

function findAudio(directory) {
  //give the audio file stored in a storie absolute path
  let files = fs.readdirSync(directory);
  files = files.filter(function (f) {
    for (const extension of audioCompatibility) {
      //est ce qu'une extension audio est reconnue
      if (f.includes(extension)) {
        return f;
      }
    }
  });
  if (files[0] == undefined) {
    throw "No compatible audio file found";
  }
  return pathToFileURL(path.join(directory, files[0])).href;
}

function createLibrary() {
  try {
    fs.mkdirSync(librariePath);
    fs.mkdirSync(path.join(librariePath, "stories"));
    fs.mkdirSync(path.join(librariePath, "musics"));
  } catch (err) {
    if (err.code !== "EEXIST") throw err;
  }
}

const getMainWindow = () => {
  const ID_MW = process.env.MAIN_WINDOW_ID * 1;
  return BrowserWindow.fromId(ID_MW);
};

const getViewContent = () => {
  const ID_VC = process.env.VIEW_CONTENTS_ID * 1;
  return webContents.fromId(ID_VC);
};

function handleClose() {
  exit(0);
}

function handleSetContent(event, content) {
  if (content == "booksSettings") {
    getViewContent().loadFile("pages/booksSettings.html");
  } else if (content == "books") {
    getViewContent().loadFile("pages/books.html");
    currentContent.page = content;
  } else {
    view.webContents.loadFile("pages/storiesAndMusics.html");
    currentContent.page = content;
  }
  getMainWindow().webContents.send("choose-content", currentContent.page);
}

function handleShowDiagBox(event, value) {
  if (value) {
    getMainWindow().setBrowserView(null);
  } else {
    getMainWindow().setBrowserView(view);
  }
}

function handleAddElement(event, element) {
  if (element.type == "book") {
    for (i = 0; i < books.length; i++) {
      books[i].id = i;
    }
    element.id = books.length;
    books.push(element);
    writeObjectToFile("books.json", books);
  } else {
    console.log("you should not be here yet ?!");
  }
}

function handleDeleteElement(event, type, id) {
  if (type == "book") {
    books.splice(id, 1);
    for (i = 0; i < books.length; i++) {
      books[i].id = i;
    }
    writeObjectToFile("books.json", books);
  } else {
    console.log("you should not be here yet ?!");
  }
}

function handleGetCurrentContent() {
  return currentContent;
}

function handleSetCurrentContent(event, content) {
  currentContent = content;
  console.log(
    "current content is now : " +
      currentContent.page +
      " with settings : " +
      currentContent.settings
  );
  if (currentContent.settings) {
    if (currentContent.page == "books") {
      getViewContent().loadFile("pages/booksSettings.html");
    } else if (
      currentContent.page == "stories" ||
      currentContent.page == "musics"
    ) {
      getViewContent().loadFile("pages/storiesAndMusicsSettings.html");
    }
  } else {
    if (currentContent.page == "books") {
      getViewContent().loadFile("pages/books.html");
    } else if (currentContent.page == "stories" || currentContent.page == "musics") {
      getViewContent().loadFile("pages/storiesAndMusics.html");
    }
  }
  getMainWindow().webContents.send("update-current-content", currentContent);
}

 function readFileToObject(file) {
  return JSON.parse(fs.readFileSync(file));
}

function writeObjectToFile(file, object) {
  fs.writeFileSync(file, JSON.stringify(object));
}