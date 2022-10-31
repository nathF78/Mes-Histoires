const albums = document.getElementById("albums");
const downButton = document.getElementById("down");
const upButton = document.getElementById("up");
var currentElement = null;

function Element(name, audio, image, path, id) {
  this.name = name;
  this.audio = audio;
  this.image = image;
  this.path = path;
  this.id = id;
}

const books = new Promise((resolve, reject) => {
  resolve(window.electronAPI.getElements());
});

books.then((value) => {
  for (let i = 0; i < value.length; i++) {
    console.log(value[i]);
    initStories(value[i]);
  }
});

//ajout des histoires
function initStories(storie) {
  album =
    '<div class="album" href=' +
    storie.path +
    " id=" +
    storie.id +
    '><img src="' +
    storie.image +
    '"></img><div class="text">' +
    storie.name +
    "</div></div>";
  albums.insertAdjacentHTML("beforeend", album);
  //ajout des évènements
  storieButton = document.getElementById(storie.id);

  storieButton.addEventListener("click", () => {
    document.getElementById(storie.id).classList.add("active");
    if (currentElement != null && currentElement.id != storie.id) {
      document.getElementById(currentElement.id).classList.remove("active");
    }
    currentAlbum = storie.id;
    currentElement = storie;
    console.log(storie.id);
    player.pause();
    player.src = storie.audio;
    window.electronAPI.chooseStorie(storie.id);
    player.load();
    player.play();
  });
}

function cleanStories() {
  console.log(stories.length);
  player.pause();
  playerUI.style.display = "none";
  if (stories.length > 0) {
    for (let i = 0; i < stories.length; i++) {
      document.getElementById(stories[i].id).remove();
    }
    stories = [];
    currentAlbum = -1;
  }
}

downButton.addEventListener("click", () => {
  window.scrollTo(0, window.scrollY + storieButton.offsetHeight); //ajout de la taille d'un album
});
upButton.addEventListener("click", () => {
  window.scrollTo(0, window.scrollY - storieButton.offsetHeight);
});

// window.addEventListener('resize', placeUi);

// function placeUi() {
//   document.getElementsByClassName("rightBar")[0].style.top = document.getElementById('header').offsetHeight + "px";
//   document.getElementsByClassName("rightBar")[0].style.height = window.innerHeight - document.getElementById('header').offsetHeight + "px";
// }
