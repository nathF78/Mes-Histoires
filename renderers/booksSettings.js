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

var books = new Promise((resolve, reject) => {
  resolve(window.electronAPI.getElements());
});

books.then((value) => {
  for (let i = 0; i < value.length; i++) {
    console.log("Liens trouvés :" + value[i].name)
    selectElement.insertAdjacentHTML("beforeend", "<option value="+value[i].id+">"+value[i].name+"</option>");
  }
});

addButton.addEventListener("click", () => {
  if (
    document.getElementById("imageInput").files[0] != null &&
    document.getElementById("linkInput").value != "" &&
    document.getElementById("nameInput").value != ""
  ) {
    element = new Element(
      document.getElementById("nameInput").value,
      "",
      document.getElementById("imageInput").files[0].path,
      document.getElementById("linkInput").value,
      -1,
      "book"
    );
    console.log(element);
    window.electronAPI.addElement(element);
    window.electronAPI.setCurrentContent(new Content("books", false));
  } else {
    alert("Veuillez remplir tous les champs");
  }
});

cancelButton.addEventListener("click", () => {
  window.electronAPI.setCurrentContent(new Content("books", false));
});

selectElement.addEventListener("change", () => {
  console.log("Selected element :" + selectElement.value);
});

delButton.addEventListener("click", () => {
    if (selectElement.value != -1) {
        window.electronAPI.deleteElement("book",selectElement.value);
        window.electronAPI.setCurrentContent(new Content("books", false));
    } else {
        alert("Veuillez sélectionner un élément");
    }
    });