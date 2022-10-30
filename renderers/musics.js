var player = document.getElementById('player');
var storieButton;
const albums = document.getElementById('albums');
const counter = document.getElementById('counter')
const playerBg = document.getElementsByClassName("player__bg")[0];
const playerUI = document.getElementsByClassName("player")[0];
const volUp = document.getElementsByClassName("player__volup")[0];
const volDown = document.getElementsByClassName("player__voldown")[0];
const controlsBg = document.getElementsByClassName("player__controls-bg")[0];
var currentElement = null;
const playPauseButton = document.getElementById('playPauseButton')
const PlayPauseHolder = document.getElementById('playPauseHolder')
const playButton = '<path id="playPauseButtonPath" d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>'
const pauseButton = '<path id="playPauseButtonPath" d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"/>'

function Element(name, audio, image, path, id) {
  this.name = name;
  this.audio = audio;
  this.image = image;
  this.path = path;
  this.id = id;
}

const stories = new Promise((resolve, reject) => {
  resolve(window.electronAPI.getStories());
});

stories.then((value) => {
  for (let i = 0; i < value.length; i++) {
    initStories(value[i]);
  }
});

playPauseButton.innerHTML = playButton;
player.volume = 0.5;

//ajout des histoires
function initStories(storie) {
  album = '<div class="album" id=' + storie.id + '><img src="' + storie.image + '"></img><div class="text">' + storie.name + '</div></div>';
  albums.insertAdjacentHTML('beforeend', album);
  storiesValue.push(storie);
  //ajout des évènements
  storieButton = document.getElementById(storie.id)


  storieButton.addEventListener('click', () => {
    document.getElementById(storie.id).classList.add('active');
    if (currentElement != null && currentElement.id != storie.id) {
    document.getElementById(currentElement.id).classList.remove('active');
    }
    currentAlbum = storie.id;
    currentElement = storie;
    console.log(storie.id)
    player.pause();
    player.src = storie.audio;
    window.electronAPI.chooseStorie(storie.id)
    player.load();
    player.play();
  });
}

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
  console.log(currentElement)
  console.log("playing " + currentElement.name)
  //albumName.innerHTML = stories[currentAlbum].name;
  playerBg.style.backgroundImage = 'url(\"' + currentElement.image + '\")';
  controlsBg.style.backgroundImage = 'url(\"' + currentElement.image + '\")';
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