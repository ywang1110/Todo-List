const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");
let items = ["Buy food", "Cook food", "Eat food"];
let workItems = [];

app.get("/", function (req, res) {

    let day = date.getDate();
    res.render("list", {listTitle: day, itemsList: items});
});

app.post("/", function (req, res) {
    console.log(req.body);
    let item = req.body.itemName;

    if (req.body.list === "Work List") {
        workItems.push(item);
        res.redirect("/work");
    } else {
        items.push(item);
        res.redirect("/");
    }
});

app.get("/work", function (req, res) {
    res.render("list", {listTitle: "Work List", itemsList: workItems});
});

app.get("/about", function (req, res) {
    res.render("about");
});

// app.post("/work", function (req, res) {
//     // let item = req.body.newItem;
//     // workItems.push(item);
//     // res.redirect("/work");
// });

app.listen(3000, function () {
    console.log("Server started at port 3000");
});