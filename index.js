let addressBook = [];

document.querySelector("#address-form").addEventListener("click", (e) => {
  if (e.target.id === "clear") {
    document.querySelector("#address-form").reset();
  }

  document.querySelector("#address-form").addEventListener("submit", (e) => {
    e.preventDefault();

    // stucture object
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
    //loops through all info tabs until finds

    for (let key in x) {
      if (key !== "fav") {
        if (x[key].includes(e.target.value)) {
          return true;
        }
      } else if (key == "fav" && e.target.value == "favorites") {
        // checks if fav is true
        return x[key];
      }
    }

    //default if wasn't found in ANY tab

    return false;
  });

  render(renderArr);
});

document.querySelector("#output").addEventListener("click", (e) => {
  function selectedHandlers(remove, edit) {
    if (document.querySelector(".selectedHandlers")) {
      document.querySelector(".selectedHandlers").remove();
    }
    const item = document.createElement("button");
    if (remove) {
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
    [customIdName, customIdPhone] = e.target.name.split(",");

    const index = addressBook.findIndex((person) => person.name === customIdName && person.phoneNumber === customIdPhone);
    addressBook.splice(index, 1);

    render(addressBook);
    localStorage.setItem("addressBook", JSON.stringify(addressBook));
  } else if (e.target.className === "edit") {
    [customIdName, customIdPhone] = e.target.name.split(",");

    const index = addressBook.findIndex((person) => person.name === customIdName && person.phoneNumber === customIdPhone);
    document.querySelectorAll("[type]").forEach((x) => (x.disabled = true));
    render([addressBook[index]], true);

    selectedHandlers(false, true);

    document.querySelector(".selectedHandlers").addEventListener("click", () => {
      const newObj = {
        name: document.querySelector(".address").children[1].value,
        phoneNumber: document.querySelector(".address").children[2].value,
        address: document.querySelector(".address").children[3].value,
        email: document.querySelector(".address").children[4].value,
        fav: document.querySelector(".address").children[5].value,
      };

      addressBook.splice(index, 1, newObj);
      render(addressBook);
      localStorage.setItem("addressBook", JSON.stringify(addressBook));
    });
  } else if (e.target.tagName === "BUTTON" && e.target.name) {
    [customIdName, customIdPhone] = e.target.name.split(",");

    const index = addressBook.findIndex((person) => person.name === customIdName && person.phoneNumber === customIdPhone);
    if (addressBook[index].fav === "on") {
      addressBook[index].fav = false;
      e.target.innerText = " ";
    } else {
      addressBook[index].fav = "on";
      e.target.innerText = "☆";
    }

    localStorage.setItem("addressBook", JSON.stringify(addressBook));
  }
});

const render = (addressArray, edit) => {
  const output = document.querySelector("#output-container");

  if (document.querySelectorAll(".address")) {
    document.querySelector("#output-container").innerHTML = null;
  }

  function createBlock(info, type = "div", name = "") {
    const container = document.createElement(type);
    type === "input" ? (container.value = info) && (container.type = "text") : (container.innerText = info);
    container.name = name;
    return container;
  }

  function handlers(name) {
    const container = document.createElement("div");
    const remove = document.createElement("button");
    const edit = document.createElement("button");

    remove.type = "button";
    edit.type = "button";
    remove.className = "delete";
    edit.className = "edit";
    remove.innerText = "❌";
    edit.innerText = "🖊️";
    remove.name = name;
    edit.name = name;

    container.appendChild(edit);
    container.appendChild(remove);

    return container;
  }

  addressArray.forEach((obj) => {
    const container = document.createElement("div");
    const checkbox = document.createElement("input");
    const customId = `${obj.name},${obj.phoneNumber}`;

    container.className = "address";
    checkbox.type = "checkbox";
    checkbox.className = "selected";
    checkbox.name = "selected";

    container.appendChild(checkbox);

    for (let prop in obj) {
      const info = obj[prop];

      if (prop === "fav") {
        container.appendChild(createBlock(obj[prop] ? "☆" : "", "button", customId));
      } else {
        container.appendChild(createBlock(info, edit ? "input" : "div"));
      }

      output.appendChild(container);
    }

    container.appendChild(handlers(customId));
  });
};

(function () {
  if (localStorage.addressBook) {
    addressBook = JSON.parse(localStorage.addressBook);
    render(addressBook);
  }
})();
