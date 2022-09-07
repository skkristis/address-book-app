let addressBook = [];

document.querySelector("#address-form").addEventListener("click", (e) => {
  if (e.target.id === "clear") {
    document.querySelector("#address-form").reset();
  }

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
});

document.querySelector("#search-bar").addEventListener("keyup", (e) => {
  const renderArr = addressBook.filter((x) => {
    for (let key in x) {
      if (key !== "fav") {
        if (x[key].includes(e.target.value)) {
          return true;
        }
      } else if (key == "fav" && e.target.value == "favorites") {
        return x[key];
      }
    }
    return false;
  });
  render(renderArr);
});

document.querySelector("#output").addEventListener("click", (e) => {
  function selectedHandlers(remove, edit) {
    if (document.querySelector(".selectedHandlers")) {
      document.querySelector(".selectedHandlers").remove();
    }
    if (remove) {
      const item = document.createElement("button");
      item.type = "button";
      item.innerText = "Delete selected";
      item.className = "selectedHandlers";
      document.querySelector("#output").prepend(item);
    } else if (edit) {
      const item = document.createElement("button");
      item.type = "button";
      item.innerText = "Save edit";
      item.className = "selectedHandlers";
      document.querySelector("#output").prepend(item);
    }
  }

  if (e.target.id === "selected-handler") {
    if (e.target.checked) {
      document.querySelectorAll(".selected").forEach((x) => (x.checked = true));
      selectedHandlers(false, true);
    } else {
      document.querySelectorAll(".selected").forEach((x) => (x.checked = false));
      document.querySelector(".selectedHandlers").remove();
    }
  } else if (e.target.className === "delete") {
    const index = addressBook.findIndex((person) => person.customId === e.target.name);
    addressBook.splice(index, 1);
    e.target.parentNode.parentNode.remove();
    localStorage.setItem("addressBook", JSON.stringify(addressBook));
  } else if (e.target.className === "edit") {
    render(addressBook, true);
    selectedHandlers(false, true);
    document.querySelector("#output").prepend();
  } else if (e.target.tagName === "BUTTON" && e.target.name) {
    const index = addressBook.findIndex((person) => person.customId === e.target.name);
    addressBook[index].fav === "on" ? (addressBook[index].fav = false) : (addressBook[index].fav = "on");
    e.target.innerText === "" ? (e.target.innerText = "☆") : (e.target.innerText = "");
    localStorage.setItem("addressBook", JSON.stringify(addressBook));
  }
});

const render = (addressArray, edit) => {
  function createBlock(info, type = "div", customId) {
    const container = document.createElement(type);
    type === "input" ? (container.value = info) && (container.type = "text") : (container.innerText = info);
    container.name = customId;
    return container;
  }
  function handlers(obj, customId) {
    const container = document.createElement("div");
    const remove = document.createElement("button");
    const edit = document.createElement("button");
    remove.type = "button";
    edit.type = "button";
    remove.className = "delete";
    edit.className = "edit";
    remove.innerText = "❌";
    edit.innerText = "🖊️";
    remove.name = customId;
    edit.name = customId;
    obj.customId = customId;
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
    const customId = obj.name + obj.phoneNumber;

    container.className = "address";
    checkbox.type = "checkbox";
    checkbox.className = "selected";
    checkbox.name = "selected";
    container.appendChild(checkbox);

    for (let prop in obj) {
      const info = obj[prop];
      if (prop === "fav") {
        container.appendChild(createBlock(obj[prop] ? "☆" : "", "button", customId));
      } else if (prop !== "customId") {
        container.appendChild(createBlock(info, edit ? "input" : null));
      }
      output.appendChild(container);
    }
    container.appendChild(handlers(obj, customId));
  });
};

(function () {
  if (localStorage.addressBook) {
    addressBook = JSON.parse(localStorage.addressBook);
    render(addressBook);
  }
})();
