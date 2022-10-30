var stories = [];
var storieButton;
const albums = document.getElementById('albums');
const closeButton = document.getElementById('confirmClose');
const downButton = document.getElementById('down')
const upButton = document.getElementById('up')
const counter = document.getElementById('counter')
var currentAlbum = -1;
const playButton = '<path id="playPauseButtonPath" d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>'
const pauseButton = '<path id="playPauseButtonPath" d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"/>'

function Storie(name, audio, image, path, id) {
  this.name = name;
  this.audio = audio;
  this.image = image;
  this.path = path;
  this.id = id;
}

placeUi()

window.electronAPI.getCurrentPath().then(value => {
  if (value == "musics") {
    musicsButton.classList.add('active');
  }
  else {
    storiesButton.classList.add('active');
  }
}).catch(err => {
  console.log(err);
});

window.addEventListener('scroll', () => {
  //console.log(scroll);
});

downButton.addEventListener('click', () => {
  window.scrollTo(0, window.scrollY + storieButton.offsetHeight); //ajout de la taille d'un album
});
upButton.addEventListener('click', () => {
  window.scrollTo(0, window.scrollY - storieButton.offsetHeight);
});

closeButton.addEventListener('click', () => {
  window.electronAPI.close();
});

storiesButton.addEventListener('click', () => {
  storiesButton.classList.add('active');
  musicsButton.classList.remove('active');
  /* const test = await getCurrentPath();
  console.log(test) */
  window.electronAPI.setCurrentPath("stories")
  cleanStories();
  window.electronAPI.init()
});

musicsButton.addEventListener('click', () => {
  storiesButton.classList.remove('active');
  musicsButton.classList.add('active');
  window.electronAPI.setCurrentPath("musics")
  cleanStories();
  window.electronAPI.init()
});


async function getCurrentPath() {
  return await window.electronAPI.getCurrentPath()
}

window.addEventListener('resize', placeUi);

closeButton.addEventListener('click', () => {
  window.electronAPI.close();
});

function placeUi() {
  document.getElementsByClassName("rightBar")[0].style.top = document.getElementById('header').offsetHeight + "px";
  document.getElementsByClassName("rightBar")[0].style.height = window.innerHeight - document.getElementById('header').offsetHeight + "px";
}
