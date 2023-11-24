window.onload = function () {
    // click on table row
    document
        .querySelector("#items")
        .addEventListener("click", handleTableClick);

    document.querySelector("#addButton").addEventListener("click", prepareAdd);
    document
        .querySelector("#updateButton")
        .addEventListener("click", prepareUpdate);
    document.querySelector("#deleteButton").addEventListener("click", doDelete);
    document
        .querySelector("#doneButton")
        .addEventListener("click", doAddOrUpdate);
    document
        .querySelector("#cancelButton")
        .addEventListener("click", hideInputPanel);

    setUpdateDeleteButtonState(false);

    refreshTable();
};

function refreshTable() {
    let url = "http://localhost:8000/api/menuitems";
    let method = "GET";
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            let response = JSON.parse(xhr.responseText);
            if (xhr.status === 200) {
                buildTable(response.data);
                setUpdateDeleteButtonState(false);
            } else {
                alert(response.err);
            }
        }
    };
    xhr.open(method, url, true);
    xhr.send();
}

function buildTable(data) {
    let elem = document.querySelector("#items");
    let html = "<table>";
    html +=
        "<tr><th>ID</th><th>Category</th><th>Description</th><th>Price</th><th>Vegetarian</th></tr>";
    data.forEach((item) => {
        html += "<tr>";
        html += `<td>${item.id}</td>`;
        html += `<td>${item.category}</td>`;
        html += `<td>${item.description}</td>`;
        html += `<td>${item.price}</td>`;
        html += `<td>${item.vegetarian}</td>`;
        html += "</tr>";
    });
    html += "</table>";
    elem.innerHTML = html;
}

function prepareAdd() {
    document.querySelector("#idInput").removeAttribute("disabled");
    clearInputs();
    showInputPanel();
}

function prepareUpdate() {
    document.querySelector("#idInput").setAttribute("disabled", "disabled");
    populateInputPanel();
    showInputPanel();
}

function doDelete() {
    let id = Number(
        document.querySelector(".selected").querySelector("td").innerHTML
    );
    let url = "http://localhost:8000/api/menuitems/" + id;
    let method = "DELETE";

    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                let resp = JSON.parse(xhr.responseText);
                if (resp.data) {
                    alert("delete successful");
                } else {
                    alert(xhr.responseText);
                }
                refreshTable();

            }
        }
    };
    xhr.open(method, url, true);
    xhr.send(); // no body for delete
}

function doAddOrUpdate() {
    let addOrUpdate = document
        .querySelector("#idInput")
        .getAttribute("disabled")
        ? "update"
        : "add";

    let id = Number(document.querySelector("#idInput").value);
    let category = document.querySelector("#categoryInput").value;
    let description = document.querySelector("#descriptionInput").value;
    let price = Number(document.querySelector("#priceInput").value);
    let vegetarian = document.querySelector("#vegetarianInput").checked;
    let newObj = {
        id: id,
        category: category,
        description: description,
        price: price,
        vegetarian: vegetarian,
    };

    let inputCheck = checkInputs(newObj);
    if (!inputCheck.ok) {
        alert(inputCheck.message);
        return;
    }

    let url = "http://localhost:8000/api/menuitems/" + id;
    let method = addOrUpdate === "add" ? "POST" : "PUT";

    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            let resp = JSON.parse(xhr.responseText);
            if (xhr.status === (addOrUpdate === "add" ? 201 : 200)) {
                if (resp.data) {
                    alert(addOrUpdate + " successful");
                } else {
                    alert(xhr.responseText);
                }
                refreshTable();
                clearInputs();
                hideInputPanel();
            } else {
                alert("Error: " + resp.err);
            }
        }
    };
    xhr.open(method, url, true);
    xhr.setRequestHeader("Content-Type", "application/json"); // IMPORTANT
    xhr.send(JSON.stringify(newObj));
}

function handleTableClick(evt) {
    let elem = evt.target;
    if (elem.nodeName !== "TD") return;
    clearSelections();
    let row = elem.parentElement;
    row.classList.add("selected");

    setUpdateDeleteButtonState(true);
}

function populateInputPanel() {
    let row = document.querySelector(".selected");
    let tds = row.querySelectorAll("td");
    let id = Number(tds[0].innerHTML);
    let category = tds[1].innerHTML;
    let description = tds[2].innerHTML;
    let price = Number(tds[3].innerHTML);
    let vegetarian = tds[4].innerHTML === "true";
    document.querySelector("#idInput").value = id;
    document.querySelector("#categoryInput").value = category;
    document.querySelector("#descriptionInput").value = description;
    document.querySelector("#priceInput").value = price;
    document.querySelector("#vegetarianInput").checked = vegetarian;
}

function clearInputs() {
    document.querySelector("#idInput").value = "";
    document.querySelector("#categoryInput").value = "";
    document.querySelector("#descriptionInput").value = "";
    document.querySelector("#priceInput").value = "";
    document.querySelector("#vegetarianInput").checked = false;
}

function clearSelections() {
    let rows = document.querySelectorAll("tr");
    for (let i = 0; i < rows.length; i++) {
        rows[i].classList.remove("selected");
    }
}

function setUpdateDeleteButtonState(state) {
    if (state) {
        document.querySelector("#updateButton").removeAttribute("disabled");
        document.querySelector("#deleteButton").removeAttribute("disabled");
    } else {
        document
            .querySelector("#updateButton")
            .setAttribute("disabled", "disabled");
        document
            .querySelector("#deleteButton")
            .setAttribute("disabled", "disabled");
    }
}

function showInputPanel() {
    document.querySelector("#inputPanel").classList.remove("hidden");
}

function hideInputPanel() {
    document.querySelector("#inputPanel").classList.add("hidden");
}

function checkInputs(obj) {
    let res = { ok: true, message: "" };
    if (obj.id < 100 || obj.id > 999) {
        res.ok = false;
        res.message = "Error: ID must be in the range [100,999].";
    } else if (obj.price <= 0) {
        res.ok = false;
        res.message = "Error: price must be greater than 0.";
    }
    return res;
}
