const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");


const app = express();

// var items = ["Buy Food" , "Eat Food" , "Cook Food"];

let workItems = [];

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-harsh:admin123@cluster0.k0etonl.mongodb.net/todolistDB", {useNewUrlParser: true,});

const itemsSchema = {
  name: String,
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Welcome to your todolist",
});

const item2 = new Item({
  name: " hit + button to add new item",
});

const item3 = new Item({
  name: " --> hit to delete item",
});

const defaultItems = [item1, item2, item3];

const listSchema = {
  name : String,
  items : [itemsSchema]
};

const List = mongoose.model("List" , listSchema);

app.get("/", function (req, res) {
  var today = new Date();

  var options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };

  var day = today.toLocaleDateString("en-US", options);

  Item.find({}, function (err, foundItems) {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log(" added succesfully ");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", { listTitle: day, newListItems: foundItems });
    }
  });
});

// app.get("/:customListName" , function(req , res){
//   const customListName = req.params.customListName ;

//   List.findOne({name : customListName} , function(err , foundList){
//     if(!err){
//       if(!foundList){
//         //create new list
//         const list = new List({
//           name : customListName,
//           items : defaultItems 
//         });

//         list.save();
//         res.redirect("/" + customListName);
//       }
//       else{
//         //show existing list
//         res.render("list" , { listTitle: foundList.name, newListItems: foundList.items });
//       };
//     }

//   })

  

  

//})

// app.get("/work" , function(req , res){
//   res.render("list" , {listTitle: "Work List" , newListItems: workItems})
// });

app.post("/", function (req, res) {
  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item = new Item({
    name: itemName,
  });
  // var today = new Date();

  // var options = {
  //   weekday: "long",
  //   day: "numeric",
  //   month: "long",
  // };
  // var day = today.toLocaleDateString("en-US", options);
  // if(listName === day){
    item.save();

  res.redirect("/");

//}
  // else{
  //   List.findOne({name : listName} , function(err , foundList){
  //     foundList.items.push(item);
  //     foundList.save();
  //     res.redirect("/" + listName);
  //   })
  // }

  

  // if(req.body.list === "Work"){
  //   workItems.push(item);
  //   res.redirect("/work");
  // }
  // else{
  //   items.push(item);
  //   res.redirect("/");
  // }
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.post("/delete", function (req, res) {
  const checkedItemId = req.body.checkbox;

  Item.findByIdAndRemove(checkedItemId, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log(" deleted succesfully ");
      res.redirect("/");
    }
  });
});

// app.post("/work" , function(req , res){

//   let item = req.body.newItem;
//   workItems.push(item);
//   res.redirect("/work");

// });

app.listen(3000, function () {
  console.log("server started on port 3000");
});
