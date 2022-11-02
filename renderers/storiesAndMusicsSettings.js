const testB = document.getElementById("imageInput");
const addButton = document.getElementById("addButton");
const cancelButton = document.getElementById("cancelButton");
const selectElement = document.getElementById("selectElement");
const delButton = document.getElementById("delButton");

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

var currentContent = new Promise((resolve, reject) => {
  resolve(window.electronAPI.getCurrentContent());
});

currentContent.then((value) => {
  let type;
  if (value.page == "stories") {
    type = "histoire";
  } else if (value.page == "musics") {
    type = "musique";
  }
  document.getElementById("title").innerHTML = "Ajouter une " + type;
  document.getElementById("nameLabel").innerHTML = "Nom de la/l' " + type;
  document.getElementById("imageLabel").innerHTML = "Choisissez une image pour la/l' " + type;
  document.getElementById("audioLabel").innerHTML = "Choisissez un fichier audio pour la/l' " + type;
  document.getElementById("delTitle").innerHTML = "Supprimer une " + type;
  document.getElementById("delLabel").innerHTML = "Sélectionnez une " + type + " à supprimer";


  currentContent = value;
});

var elements = new Promise((resolve, reject) => {
  resolve(window.electronAPI.getElements());
});

elements.then((value) => {
  for (let i = 0; i < value.length; i++) {
    console.log("Elements trouvés :" + value[i].name)
    selectElement.insertAdjacentHTML("beforeend", "<option value="+value[i].id+">"+value[i].name+"</option>");
  }
});

addButton.addEventListener("click", () => {
  if (
    document.getElementById("imageInput").files[0] != null &&
    document.getElementById("audioInput").value != "" &&
    document.getElementById("nameInput").value != ""
  ) {
    element = new Element(
      document.getElementById("nameInput").value,
      document.getElementById("audioInput").files[0].path,
      document.getElementById("imageInput").files[0].path,
      "",
      -1,
      "element"
    );
    console.log(element);
    window.electronAPI.addElement(element);
    window.electronAPI.setCurrentContent(new Content(currentContent.page, true));
  } else {
    alert("Veuillez remplir tous les champs");
  }
});

cancelButton.addEventListener("click", () => {
  window.electronAPI.setCurrentContent(new Content(currentContent.page, fale));
});

selectElement.addEventListener("change", () => {
  console.log("Selected element :" + selectElement.value);
});

delButton.addEventListener("click", () => {
    if (selectElement.value != -1) {
        window.electronAPI.deleteElement(selectElement.value);
        window.electronAPI.setCurrentContent(new Content(currentContent.page, true));
    } else {
        alert("Veuillez sélectionner un élément");
    }
    });