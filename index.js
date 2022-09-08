let addressBook = [];
let selectedArrIndexes = [];

function render(addressArray = addressBook) {
  addressArray.sort((a, b) => a.name.localeCompare(b.name));
  selectedArrIndexes = [];

  function icons(bool, given) {
    const container = document.createElement("div");
    const paramArr = [
      {
        tag: "i",
        id: `phone`,
        className: "fa-solid fa-mobile-screen-button",
      },
      {
        tag: "i",
        id: `at`,
        className: given ? "fa-solid fa-at" : "not-given fa-solid fa-at",
      },
      {
        favorite: bool,
        tag: "i",
        id: `star`,
        className: "fa-regular fa-star",
        favClassName: "fa-solid fa-star",
      },
      {
        tag: "i",
        id: `menu`,
        className: "fa-solid fa-ellipsis-vertical",
      },
    ];

    container.className = "icons";

    paramArr.forEach((x) => {
      const tag = document.createElement(x.tag);

      if (x.favorite) {
        tag.className = x.favClassName;
      } else {
        tag.className = x.className;
      }

      tag.id = x.id;
      container.appendChild(tag);
    });

    return container;
  }

  localStorage.setItem("addressBook", JSON.stringify(addressBook));
  const output = document.querySelector("#output-container");

  if (document.querySelectorAll(".address")) {
    document.querySelector("#output-container").innerHTML = null;
  }

  addressArray.forEach((obj, i) => {
    const container = document.createElement("div");
    const innerContainer = document.createElement("div");
    const name = document.createElement("p");

    name.innerText = `${obj.name} ${obj.surname}`;
    container.className = "address";
    innerContainer.className = "innerContainer";

    if (addressArray.length - 1 === i) {
      innerContainer.appendChild(name);
      innerContainer.appendChild(icons(obj.favorite, obj.email));
      container.appendChild(innerContainer);
      output.appendChild(container);
    } else {
      innerContainer.appendChild(name);
      innerContainer.appendChild(icons(obj.favorite, obj.email));
      container.appendChild(innerContainer);
      output.appendChild(container);
    }
  });
}

(function () {
  if (localStorage.addressBook) {
    addressBook = JSON.parse(localStorage.addressBook);
  }
  render();
})();

document.addEventListener("click", (e) => {
  function menuDropDown() {
    const container = document.createElement("div");
    const menuComp = ["Edit", "Select", "Delete"];
    const arrowUp = document.createElement("div");

    arrowUp.className = "arrow-up";
    container.className = "menu-drop-down";

    container.appendChild(arrowUp);

    menuComp.forEach((x, i) => {
      const btn = document.createElement("button");
      btn.innerText = menuComp[i];
      container.appendChild(btn);
    });

    return container;
  }

  function findIndex(target, index) {
    const arr = Array.from(document.querySelectorAll(".address"));

    if (target.className === "address") {
      index = arr.indexOf(target);
    } else {
      while (target.className !== "address") {
        target = target.parentNode;
      }
      index = arr.indexOf(target);
    }

    return index;
  }

  switch (e.target.id) {
    case "Add":
      document.querySelector("body").classList.toggle("darken");

      function formPopUp() {
        const createItem = (labelText, type, name, placeholder = "", required = "true") => {
          const containerInput = document.createElement("div");
          const input = document.createElement("input");
          const label = document.createElement("h3");

          containerInput.className = "inputContainer";
          input.type = type;
          input.name = name;
          input.placeholder = placeholder;
          input.required = required;
          label.innerText = labelText;

          containerInput.appendChild(label);
          containerInput.appendChild(input);

          return containerInput;
        };

        const createButton = (text) => {
          const button = document.createElement("button");
          button.type = "submit";
          button.innerText = text;
          button.id = "saveBtn";
          return button;
        };

        const container = document.createElement("form");
        container.className = "clicked-container";

        container.appendChild(createItem("Name", "text", "name", "fields are required"));
        container.appendChild(createItem("Surname", "text", "surname", "", false));
        container.appendChild(createItem("Phone", "tel", "phone", "fields are required"));
        container.appendChild(createItem("Email", "email", "email", "", false));
        container.appendChild(createButton("Save"));

        document.querySelector("#app").appendChild(container);
      }

      formPopUp();
      break;
    case "Remove":
      selectedArrIndexes.sort((a, b) => b - a);
      selectedArrIndexes.forEach((index) => addressBook.splice(index, 1));

      render(addressBook);
      break;
    case "saveBtn":
      e.preventDefault();

      function saveData() {
        const form = document.querySelector("form");
        const formData = new FormData(form);
        let address = Object.fromEntries(formData);

        if (address.name && address.phone) {
          address.favorite = false;
          addressBook.push(address);

          document.querySelector(".clicked-container").remove();
          document.querySelector("body").classList.toggle("darken");
        }

        render();
      }

      saveData();
      break;
    case "selected":
      const index = selectedArrIndexes.indexOf(findIndex(e.target));

      e.target.remove();
      selectedArrIndexes.splice(index, 1);
      break;
    case "star":
      addressBook[findIndex(e.target)].favorite = !addressBook[findIndex(e.target)].favorite;
      render();
      break;
    case "menu":
      const arr = Array.from(document.querySelectorAll(".innerContainer"));
      arr[findIndex(e.target)].appendChild(menuDropDown());
      break;
    case "saveEdit":
      e.preventDefault();

      const form = document.querySelector("form");
      const formData = new FormData(form);
      let address = Object.fromEntries(formData);

      if (address.name && address.phone) {
        address.favorite = false;
        addressBook.splice(findIndex(e.target), 1, address);

        document.querySelectorAll(".edit-container").forEach((x) => x.remove());
        render();
      }

      break;
  }

  switch (e.target.className) {
    case "darken":
      document.querySelector(".clicked-container").remove();
      document.querySelector("body").classList.toggle("darken");
      break;
  }

  switch (e.target.innerText) {
    case "Select":
      function select(target) {
        const selectedIcon = document.createElement("i");
        selectedIcon.id = "selected";
        selectedIcon.className = "fa-solid fa-circle-check";
        if (!selectedArrIndexes.includes(findIndex(target))) {
          selectedArrIndexes.push(findIndex(target));
          document.querySelectorAll(".icons")[findIndex(target)].prepend(selectedIcon);
        }
      }

      select(e.target);
      document.querySelectorAll(".menu-drop-down").forEach((x) => x.remove());

      break;
    case "Delete":
      addressBook.splice(findIndex(e.target), 1);

      document.querySelectorAll(".address")[findIndex(e.target)].remove();
      document.querySelectorAll(".menu-drop-down").forEach((x) => x.remove());

      localStorage.setItem("addressBook", JSON.stringify(addressBook));
      break;
    case "Edit":
      const targetObj = addressBook[findIndex(e.target)];

      function formEdit(target, obj) {
        const createItem = (type, name, required = "true") => {
          const input = document.createElement("input");

          input.type = type;
          input.name = name;
          input.placeholder = name;
          input.value = obj[name];
          input.required = required;

          return input;
        };

        const createButton = (text) => {
          const button = document.createElement("button");

          button.type = "submit";
          button.innerText = text;
          button.id = "saveEdit";

          return button;
        };

        const container = document.createElement("form");
        container.className = "edit-container";

        container.appendChild(createItem("text", "name"));
        container.appendChild(createItem("text", "surname", false));
        container.appendChild(createItem("tel", "phone"));
        container.appendChild(createItem("email", "email", false));
        container.appendChild(createButton("Save"));

        document.querySelectorAll(".address")[findIndex(target)].appendChild(container);
      }

      formEdit(e.target, targetObj);

      document.querySelectorAll(".menu-drop-down").forEach((x) => x.remove());
      break;
  }

  if (document.querySelectorAll(".menu-drop-down") && e.target.id !== "menu") {
    document.querySelectorAll(".menu-drop-down").forEach((x) => x.remove());
  }
  selectedArrIndexes.length > 0 ? (document.querySelector("#Remove").style.display = "inline-block") : (document.querySelector("#Remove").style.display = "none");
});
