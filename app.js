const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
var items = ["Buy food", "Cook food", "Eat food"];

app.get("/", function (req, res) {
    var today = new Date();  // 获得具体时间 2022-01-10T03:39:51.702Z
    var currentDay = today.getDay(); // 或者编号 Sunday ==> 0
    var day = "";

    var options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };

    var day = today.toLocaleDateString("en-Us", options);

    res.render("list", {kindOfDay: day, newListItems: items});
});

app.post("/", function (req,res) {
    var item = req.body.newItem;
    items.push(item);
    res.redirect("/");
});

app.listen(3000, function () {
    console.log("Server started at port 3000");
});