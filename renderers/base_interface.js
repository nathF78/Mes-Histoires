var stories = [];
const storiesButton = document.getElementById("storiesButton");
const askToQuitButton = document.getElementById("closeButton");
const musicsButton = document.getElementById("musicsButton");
const booksButton = document.getElementById("booksButton");
const albums = document.getElementById("albums");
const cancelCloseButton = document.getElementById("cancelCloseButton");
const closeButton = document.getElementById("confirmClose");
const counter = document.getElementById("counter");
var currentAlbum = -1;

function Storie(name, audio, image, path, id) {
  this.name = name;
  this.audio = audio;
  this.image = image;
  this.path = path;
  this.id = id;
}

//placeUi();

//Les boutons sprincipaux 
musicsButton.addEventListener("click", () => {
  window.electronAPI.setContent("musics");
});

storiesButton.addEventListener("click", () => {
  window.electronAPI.setContent("stories");
});

booksButton.addEventListener("click", () => {
  window.electronAPI.setContent("books");
});

window.addEventListener("scroll", () => {
  //console.log(scroll);
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
  window.electronAPI.askToQuit(true);
});

cancelCloseButton.addEventListener("click", () => {
  window.electronAPI.askToQuit(false);
});

// function placeUi() {
//   document.getElementsByClassName("rightBar")[0].style.top =
//     document.getElementById("header").offsetHeight + "px";
//   document.getElementsByClassName("rightBar")[0].style.height =
//     window.innerHeight - document.getElementById("header").offsetHeight + "px";
// }

window.electronAPI.onChooseContent((_event, value) => {
  if (value == "stories") {
    storiesButton.classList.add("active");
    musicsButton.classList.remove("active");
    booksButton.classList.remove("active");
  } else if (value == "musics") {
    storiesButton.classList.remove("active");
    musicsButton.classList.add("active");
    booksButton.classList.remove("active");
  }
  else {
    storiesButton.classList.remove("active");
    musicsButton.classList.remove("active");
    booksButton.classList.add("active");
  }
});
