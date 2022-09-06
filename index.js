let addressBook = [];

const render = (addressArray) => {
  function createBlock(info, type = "div") {
    const container = document.createElement(type);
    container.innerText = info;
    return container;
  }
  function handlers() {
    const container = document.createElement("div");
    const remove = document.createElement("button");
    const edit = document.createElement("button");
    remove.type = "button";
    edit.type = "button";
    remove.className = "delete";
    edit.className = "edit";
    remove.innerText = "❌";
    edit.innerText = "🖊️";
    container.appendChild(edit);
    container.appendChild(remove);

    return container;
  }
  if (document.querySelectorAll(".address")) {
    document.querySelector("#output-container").innerHTML = null;
  }

  const output = document.querySelector("#output-container");

  addressArray.forEach((obj) => {
    const container = document.createElement("div");
    const checkbox = document.createElement("input");

    container.className = "address";
    checkbox.type = "checkbox";
    checkbox.className = "selected";
    checkbox.name = "selected";
    container.appendChild(checkbox);

    for (let prop in obj) {
      const info = obj[prop];
      if (prop === "fav") {
        container.appendChild(createBlock(obj[prop] ? "☆" : "", "button"));
      } else {
        container.appendChild(createBlock(info));
      }
      output.appendChild(container);
    }
    container.appendChild(handlers());
  });
};

document.querySelector("#address-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const fakeObj = {
    name: null,
    phoneNumber: null,
    address: null,
    email: null,
    fav: false,
  };

  const formData = new FormData(e.target);
  let address = Object.fromEntries(formData);
  if (address.name && address["phoneNumber"]) {
    address = Object.assign({}, fakeObj, address);
    addressBook.push(address);
    document.querySelector("#address-form").reset();

    localStorage.setItem("addressBook", JSON.stringify(addressBook));
    render(addressBook);
  }
});

document.querySelector("#clear").addEventListener("click", (e) => {
  document.querySelector("#address-form").reset();
});

document.querySelector("#output").addEventListener("click", (e) => {
  if (e.target.id === "selected-handler") {
    if (e.target.checked) {
      document.querySelectorAll(".selected").forEach((x) => (x.checked = true));
    } else {
      document.querySelectorAll(".selected").forEach((x) => (x.checked = false));
    }
  } else if (e.target.className === "delete") {
    const index = addressBook.findIndex((person) => person.name === e.target.parentNode.parentNode.children[1].innerText && person.phoneNumber === e.target.parentNode.parentNode.children[2].innerText);
    addressBook.splice(index, 1);
    e.target.parentNode.parentNode.remove();
    localStorage.setItem("addressBook", JSON.stringify(addressBook));
  } else if (e.target.className === "edit") {
  } else if (e.target.tagName === "BUTTON") {
    const index = addressBook.findIndex((person) => person.name === e.target.parentNode.children[1].innerText && person.phoneNumber === e.target.parentNode.children[2].innerText);
    addressBook[index].fav === "on" ? (addressBook[index].fav = false) : (addressBook[index].fav = "on");
    e.target.innerText === "" ? (e.target.innerText = "☆") : (e.target.innerText = "");
    localStorage.setItem("addressBook", JSON.stringify(addressBook));
  }
});

(function () {
  if (localStorage.addressBook) {
    addressBook = JSON.parse(localStorage.addressBook);
    render(addressBook);
  }
})();

document.querySelector("#search-bar").addEventListener("keyup", (e) => {
  const renderArr = addressBook.filter((x) => {
    for (let key in x) {
      if (key !== "fav") {
        let snippet = x[key].slice(0, e.target.value.length);
        // console.log(snippet);
        // console.log(e.target.value);
        if (snippet == e.target.value) {
          return true;
        }
      } else if (key == "fav" && e.target.value == "favorites") {
        return x[key];
      }
    }
  });
  render(renderArr);
});
