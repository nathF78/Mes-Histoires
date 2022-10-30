var stories = [];
var player = document.getElementById('player');
var storieButton;
const albums = document.getElementById('albums');
const closeButton = document.getElementById('confirmClose');
const downButton = document.getElementById('down')
const upButton = document.getElementById('up')
const storiesButton = document.getElementById('storiesButton')
const musicsButton = document.getElementById('musicsButton')
const counter = document.getElementById('counter')
//const albumName = document.getElementsByClassName("player__song")[0];
const playerBg = document.getElementsByClassName("player__bg")[0];
const playerUI = document.getElementsByClassName("player")[0];
const volUp = document.getElementsByClassName("player__volup")[0];
const volDown = document.getElementsByClassName("player__voldown")[0];
const controlsBg = document.getElementsByClassName("player__controls-bg")[0];
var currentAlbum = -1;
const playPauseButton = document.getElementById('playPauseButton')
const PlayPauseHolder = document.getElementById('playPauseHolder')
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

playPauseButton.innerHTML = playButton;

player.volume = 0.5;

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


//ajout des histoires
window.electronAPI.onAddStorie(async (_event, storie) => {
  album = '<div class="album" id=' + storie.id + '><img src="' + storie.image + '"></img><div class="text">' + storie.name + '</div></div>';
  albums.insertAdjacentHTML('beforeend', album);
  stories.push(storie);
  //ajout des évènements
  storieButton = document.getElementById(storie.id)

  storieButton.addEventListener('click', () => {
    document.getElementById(storie.id).classList.add('active');
    if (currentAlbum != -1 && currentAlbum != storie.id) {
    document.getElementById(currentAlbum).classList.remove('active');
    }
    currentAlbum = storie.id;
    player.pause();
    player.src = stories[storie.id].audio;
    window.electronAPI.chooseStorie(storie.id)
    player.load();
    player.play();
  });
})

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

player.addEventListener('timeupdate', async () => {
  //console.log(player.currentTime);
})

player.addEventListener('pause', () => {
  playPauseButton.innerHTML=playButton;
})

player.addEventListener('play', () => {
  playPauseButton.innerHTML=pauseButton;
})

player.addEventListener('playing', async () => {
  playerUI.style.display = "block";
  console.log("playing " + stories[currentAlbum].name)
  //albumName.innerHTML = stories[currentAlbum].name;
  playerBg.style.backgroundImage = 'url(\"' + stories[currentAlbum].image + '\")';
  controlsBg.style.backgroundImage = 'url(\"' + stories[currentAlbum].image + '\")';
  window.scrollTo(0, 0); //revenir en haut
})

playPauseHolder.addEventListener('click', () => {
  if (player.paused) {
    player.play()
  }
  else {
    player.pause()
  }
})

volUp.addEventListener('click', () => {

  if (player.volume < 0.9) {
    player.volume += 0.1;
  }
  else {
    player.volume = 1;
  }
})

volDown.addEventListener('click', () => {

  if (player.volume > 0.1) {
    player.volume -= 0.1;
  }
  else {
    player.volume = 0;
  }
})

async function getCurrentPath() {
  return await window.electronAPI.getCurrentPath()
}

window.addEventListener('resize', placeUi);

function placeUi() {
  document.getElementsByClassName("rightBar")[0].style.top = document.getElementById('header').offsetHeight + "px";
  document.getElementsByClassName("rightBar")[0].style.height = window.innerHeight - document.getElementById('header').offsetHeight + "px";
}

function cleanStories() {
  console.log(stories.length)
  player.pause();
  playerUI.style.display = "none";
  if (stories.length > 0) {
    for (let i = 0; i < stories.length; i++) {
      document.getElementById(stories[i].id).remove()
    }
    stories = [];
    currentAlbum = -1;
  }
}