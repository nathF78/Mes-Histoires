var stories = [];
var storiesButton = document.getElementById("storiesButton");
var musicsButton = document.getElementById("musicsButton");
var booksButton = document.getElementById("booksButton");
const albums = document.getElementById("albums");
const closeButton = document.getElementById("confirmClose");
const counter = document.getElementById("counter");
var currentAlbum = -1;
const playButton =
  '<path id="playPauseButtonPath" d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>';
const pauseButton =
  '<path id="playPauseButtonPath" d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"/>';

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

// function placeUi() {
//   document.getElementsByClassName("rightBar")[0].style.top =
//     document.getElementById("header").offsetHeight + "px";
//   document.getElementsByClassName("rightBar")[0].style.height =
//     window.innerHeight - document.getElementById("header").offsetHeight + "px";
// }

window.electronAPI.onChooseContent((_event, value) => {
  console.log("onChooseContent");
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
