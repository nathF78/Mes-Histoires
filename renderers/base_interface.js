var stories = [];
const storiesButton = document.getElementById("storiesButton");
const askToQuitButton = document.getElementById("closeButton");
const musicsButton = document.getElementById("musicsButton");
const booksButton = document.getElementById("booksButton");
const albums = document.getElementById("albums");
const cancelCloseButton = document.getElementById("cancelCloseButton");
const accessSettingsButton = document.getElementById("accesSettingsButton");
const cancelSettingsButton = document.getElementById("cancelSettingsButton");
const settingsCodeLabel = document.getElementById("settingsCodeLabel");
const settingsCodeInput = document.getElementById("settingsCodeInput");
const closeButton = document.getElementById("confirmClose");
const counter = document.getElementById("counter");
const settingsButton = document.getElementById("settingsButton");
const settingsCode =
  getRandomInt() +
  "" +
  getRandomInt() +
  "" +
  getRandomInt() +
  "" +
  getRandomInt();
const textCode = [
  "zero",
  "un",
  "deux",
  "trois",
  "quatre",
  "cinq",
  "six",
  "sept",
  "huit",
  "neuf",
];

function Content(page, settings) {
  this.page = page;
  this.settings = settings;
}

var currentContent = new Promise((resolve, reject) => {
  resolve(window.electronAPI.getCurrentContent());
});

currentContent.then((value) => {
  if (value.page == "stories") {
    storiesButton.classList.add("active");
    musicsButton.classList.remove("active");
    booksButton.classList.remove("active");
    settingsButton.disabled = false;
  } else if (value.page == "musics") {
    storiesButton.classList.remove("active");
    musicsButton.classList.add("active");
    booksButton.classList.remove("active");
    settingsButton.disabled = false;
  } else if (value.page == "books") {
    storiesButton.classList.remove("active");
    musicsButton.classList.remove("active");
    booksButton.classList.add("active");
    settingsButton.disabled = false;
  }
  currentContent = value;
});

settingsCodeLabel.innerHTML =
  textCode[settingsCode[0]] +
  " " +
  textCode[settingsCode[1]] +
  " " +
  textCode[settingsCode[2]] +
  " " +
  textCode[settingsCode[3]];


//Les boutons sprincipaux
musicsButton.addEventListener("click", () => {
  console.log("musics clicked");
  window.electronAPI.setCurrentContent(new Content("musics", false));
});

storiesButton.addEventListener("click", () => {
  console.log("stories clicked");
  window.electronAPI.setCurrentContent(new Content("stories", false));
});

booksButton.addEventListener("click", () => {
  console.log("books clicked");
  window.electronAPI.setCurrentContent(new Content("books", false));
});

closeButton.addEventListener("click", () => {
  window.electronAPI.close();
});

async function getCurrentPath() {
  return await window.electronAPI.getCurrentPath();
}

//window.addEventListener("resize", placeUi);

closeButton.addEventListener("click", () => {
  window.electronAPI.close();
});

askToQuitButton.addEventListener("click", () => {
  window.electronAPI.showDiagBox(true);
});

cancelCloseButton.addEventListener("click", () => {
  window.electronAPI.showDiagBox(false);
});

cancelSettingsButton.addEventListener("click", () => {
  window.electronAPI.showDiagBox(false);
});

// function placeUi() {
//   document.getElementsByClassName("rightBar")[0].style.top =
//     document.getElementById("header").offsetHeight + "px";
//   document.getElementsByClassName("rightBar")[0].style.height =
//     window.innerHeight - document.getElementById("header").offsetHeight + "px";
// }

settingsButton.addEventListener("click", () => {
  settingsCodeInput.value = "";
  accessSettingsButton.disabled = true;
  window.electronAPI.showDiagBox(true);
});

accessSettingsButton.addEventListener("click", () => {
  window.electronAPI.showDiagBox(false);
  settingsButton.disabled = true;
  window.electronAPI.setCurrentContent(new Content(currentContent.page, true));
});

// window.electronAPI.onChooseContent((_event, value) => {
//   if (value == "stories") {
//     storiesButton.classList.add("active");
//     musicsButton.classList.remove("active");
//     booksButton.classList.remove("active");
//     settingsButton.disabled = false;
//   } else if (value == "musics") {
//     storiesButton.classList.remove("active");
//     musicsButton.classList.add("active");
//     booksButton.classList.remove("active");
//     settingsButton.disabled = false;
//   } else {
//     storiesButton.classList.remove("active");
//     musicsButton.classList.remove("active");
//     booksButton.classList.add("active");
//     settingsButton.disabled = false;
//   }
// });

window.electronAPI.onUpdateContent((_event, content) => {
  currentContent = content;
  if (content.page == "stories") {
    console.log("content changed to stories");
    storiesButton.classList.add("active");
    musicsButton.classList.remove("active");
    booksButton.classList.remove("active");
  } else if (content.page == "musics") {
    console.log("content changed to musics");
    storiesButton.classList.remove("active");
    musicsButton.classList.add("active");
    booksButton.classList.remove("active");
  } else if (content.page == "books") {
    console.log("content changed to books");
    storiesButton.classList.remove("active");
    musicsButton.classList.remove("active");
    booksButton.classList.add("active");
  }
  if (content.settings) {
    settingsButton.disabled = true;
  } else {
    settingsButton.disabled = false;
  }
});

function getRandomInt() {
  return Math.floor(Math.random() * 9);
}

settingsCodeInput.addEventListener("input", (updateValue) => {
  if (settingsCodeInput.value == settingsCode) {
    console.log("code is correct");
    accessSettingsButton.disabled = false;
  } else {
    accessSettingsButton.disabled = true;
  }
});
