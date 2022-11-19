var express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  flash = require("connect-flash"),
  //passport    = require("passport"),
  methodOverride = require("method-override")

//requiring routes
var indexRoutes = require("./routes/index")

app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB(); //seed the database

app.use("/", indexRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, process.env.IP, function(){
   console.log("Who's Who Server Started");
});
