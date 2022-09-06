const addressBook = [
  {
    name: "ALvin",
    "phone number": "21389123",
    address: "somewhere",
    email: "alvin@gmail.com",
    fav: "on",
  },
  {
    name: "Garvin",
    "phone number": "+28913",
    address: "woods",
    email: "woods@mail.com",
    fav: "",
  },
  {
    name: "John Doe",
    "phone number": "+28935823",
    address: "Malibu",
    email: "asopfgn@apfosn.com",
    fav: "",
  },
];

const clear = () => {
  const inputs = document.querySelectorAll("#address-form>input");
  inputs.forEach((x) => (x.value ? (x.value = null) : (x.checked = false)));
};
const render = () => {
  function createDiv(info) {
    const container = document.createElement("div");
    container.innerText = info;
    return container;
  }

  const output = document.querySelector("#output-container");

  addressBook.forEach((obj) => {
    // console.log(obj);
    const container = document.createElement("div");
    const checkbox = document.createElement("input");
    const edit = document.createElement("div");
    edit.innerHTML = ` <button type="button">🖊️</button>
    <button type="button">❌</button>`;
    container.className = "address";
    checkbox.type = "checkbox";
    checkbox.id = "selected";
    checkbox.name = "selected";
    container.appendChild(checkbox);
    for (let prop in obj) {
      const info = obj[prop];
      if (prop === "fav") {
        obj[prop] ? container.appendChild(createDiv("☆")) : container.appendChild(createDiv(""));
      } else {
        container.appendChild(createDiv(info));
      }
      output.appendChild(container);
    }
    container.appendChild(edit);
  });
};

document.querySelector("#address-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const fakeObj = {
    name: null,
    "phone number": "null",
    address: null,
    email: null,
    fav: null,
  };

  const formData = new FormData(e.target);
  let address = Object.fromEntries(formData);
  if (address.name && address["phone number"]) {
    address = Object.assign({}, fakeObj, address);
    console.log(address);
    addressBook.push(address);
    clear();
    if (document.querySelectorAll(".address")) {
      console.log(document.querySelectorAll(".address"));
      document.querySelectorAll(".address").forEach((x) => console.log(x.remove()));
    }

    render();
  }
});

document.querySelector("#clear").addEventListener("click", (e) => {
  clear();
});
render();
