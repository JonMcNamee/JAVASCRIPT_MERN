const express = require("express");
const cors = require("cors");
const path = require("path");

const acc = require("./db/MenuItemAccessor");
const { MenuItem } = require("./entity/MenuItem");
const { Constants } = require("./utils/Constants");

const app = express();

// one line of code replaces the whole static module
app.use(express.static(Constants.PUBLIC_FOLDER));

// automatically sets request.body to JSON.parse of JSON data sent
app.use(express.json());

// enable cors
app.use(cors());

//*** API Routing - define the rules one at a time ***//

// get all items
app.get("/api/menuitems", async function (request, response) {
    try {
        let data = await acc.getAllItems();
        response.status(200).json({ err: null, data: data });
    } catch (err) {
        response
            .status(500)
            .json({ err: "could not read data" + err, data: null });
    }
});

// delete a menu item
app.delete("/api/menuitems/:id(\\d{3})", async function (request, response) {
    let id = Number(request.params.id); // parameter is a string!

    try {
        let dummyItem = new MenuItem(id, "ENT", "some desc", 99, false);

        try {
            let ok = await acc.deleteItem(dummyItem);
            if (ok) {
                response.status(200).json({ err: null, data: true });
            } else {
                response.status(404).json({
                    err: `item ${dummyItem.id} does not exist`,
                    data: null,
                });
            }
        } catch (err) {
            response
                .status(500)
                .json({ err: "delete aborted" + err, data: null });
        }
    } catch (err) {
        response.status(400).json({ err: err.message, data: null });
        return;
    }
});

// insert a menu item
app.post("/api/menuitems/:id(\\d{3})", async function (request, response) {
    try {
        let rawitem = request.body;
        let menuitem = new MenuItem(
            rawitem.id,
            rawitem.category,
            rawitem.description,
            rawitem.price,
            rawitem.vegetarian
        );

        try {
            let ok = await acc.addItem(menuitem);
            if (ok) {
                response.status(201).json({ err: null, data: true });
            } else {
                response.status(409).json({
                    err: `item ${menuitem.id} already exists`,
                    data: null,
                });
            }
        } catch (err) {
            console.log(">>>", err);
            response
                .status(500)
                .json({ err: "insert aborted" + err, data: null });
        }
    } catch (err) {
        response.status(400).json({ err: err.message, data: null });
    }
});

// update a menu item
app.put("/api/menuitems/:id(\\d{3})", async function (request, response) {
    try {
        let rawitem = request.body;
        let menuitem = new MenuItem(
            rawitem.id,
            rawitem.category,
            rawitem.description,
            rawitem.price,
            rawitem.vegetarian
        );

        try {
            let ok = await acc.updateItem(menuitem);
            if (ok) {
                response.status(200).json({ err: null, data: true });
            } else {
                response.status(404).json({
                    err: `item ${menuitem.id} does not exist`,
                    data: null,
                });
            }
        } catch (err) {
            response
                .status(500)
                .json({ err: "update aborted" + err, data: null });
        }
    } catch (err) {
        response.status(400).json({ err: err.message, data: null });
    }
});

//*** Invalid URLs ***//

app.get("/api/menuitems/:id(\\d{3})", function (request, response) {
    response.status(405).json({ err: "Single GETs not supported", data: null });
});

app.delete("/api/menuitems", function (request, response) {
    response
        .status(405)
        .json({ err: "Bulk deletes not supported", data: null });
});

app.post("/api/menuitems", function (request, response) {
    response
        .status(405)
        .json({ err: "Bulk inserts not supported", data: null });
});

app.put("/api/menuitems", function (request, response) {
    response
        .status(405)
        .json({ err: "Bulk updates not supported", data: null });
});

//*** After defining all API routes, do this: ***//

// 404
app.use(function (request, response, next) {
    response
        .status(404)
        .sendFile(path.join(__dirname, Constants.PUBLIC_FOLDER, "404.html"));
});

// start the server - should be last step
app.listen(Constants.PORT_NUM, function () {
    console.log(`Example app listening on port ${Constants.PORT_NUM}!`);
});
