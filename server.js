const express = require("express");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.set('views", "./views')
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

require('./routes/apiRoutes')(app)

app.listen(PORT, function() {
    console.log("Listening on port: " + PORT);
});
