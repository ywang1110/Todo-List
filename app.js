const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const _ = require("lodash");
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");
// let items = ["Buy food", "Cook food", "Eat food"];
// let workItems = [];
mongoose.connect("mongodb+srv://admin-nan:1234@cluster0.n1jia.mongodb.net/todolistDB?retryWrites=true&w=majority");

const itemsSchema = {
    name: String
};
const Item = mongoose.model("Item", itemsSchema);

// defaults items
const item1 = new Item({name: "Welcome to your todolist"});
const item2 = new Item({name: "Hit the + button to add a new item"});
const item3 = new Item({name: "<-- Hit this to delete an item"});
const defaultItems = [item1, item2, item3];

const listSchema = {
    name: String,
    items: [itemsSchema]
};
const List = mongoose.model("List", listSchema);

app.get("/", function (req, res) {
    // 避免 重复 添加入数据库
    Item.find({}, function (err, foundItems) {
        // console.log(foundItems); // foundItems -> array
        if (foundItems.length===0) {
            Item.insertMany(defaultItems, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Successfully saved all items");
                }
            });
            res.redirect("/");
        } else {
            res.render("list", {listTitle: "Today", itemsList: foundItems});
        }
    });

    // let day = date.getDate();
    // res.render("list", {listTitle: "Today", itemsList: foundItems});
});

app.post("/", function (req, res) {
    // console.log(req.body); // { itemName: 'Coding', list: 'Today' } form的 name定义
    const item = req.body.itemName;
    const listName = req.body.list;

    const todo = new Item({
        name: item
    });

    if (listName === 'Today') {
        todo.save();  // persist in db.items
        res.redirect("/"); // display the most recent to-do list
    } else {
        List.findOne({name: listName}, function (err, foundList) {
            // console.log(foundList);
            // { "_id" : ObjectId("61defcc26503225dbaf7a006"), "name" : "work",
            // "items" : [ { "name" : "Welcome to your todolist", "_id" : ObjectId("61defcbe6503225dbaf7a002") }, { "name" : "Hit the + button to add a new item", "_id" : ObjectId("61defcbe6503225dbaf7a003") }, { "name" : "<-- Hit this to delete an item", "_id" : ObjectId("61defcbe6503225dbaf7a004") } ], "__v" : 0 }
            foundList.items.push(todo);
            foundList.save();
            res.redirect("/"+listName);
        });
    }
});

app.post("/delete", function (req, res) {
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

    if (listName === 'Today') {
        Item.findByIdAndRemove(checkedItemId, function (err) {
            if (!err) {
                console.log("Successfully removed!")
                res.redirect("/");
            }
        });
    } else {
        List.findOneAndUpdate(
            {name: listName},
            {$pull: {items: {_id: checkedItemId}}},
            function (err, results) {
                if (!err) {
                    res.redirect("/" + listName);
                }
            });
    }
});

app.get("/:customerListName", function (req, res) {
     const customerListName = _.capitalize(req.params.customerListName);

     // 避免重复添加
     List.findOne({name: customerListName}, function (err, foundList) {
         if (err) {
             console.log(err);
         } else {
             if (!foundList) {
                 // Create a new list
                 // console.log("Doesn't exist!");
                 const list = new List({
                     name: customerListName,
                     items: defaultItems
                 });
                 list.save();
                 res.redirect("/");
             } else {
                 // show an existing list
                 // console.log(foundList);
                 res.render("list", {listTitle: foundList.name, itemsList: foundList.items});
             }
         }
     });
});


app.get("/about", function (req, res) {
    res.render("about");
});

// app.post("/work", function (req, res) {
//     // let item = req.body.newItem;
//     // workItems.push(item);
//     // res.redirect("/work");
// });

let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}
app.listen(3000, function () {
    console.log("Server has started successfully.");
});