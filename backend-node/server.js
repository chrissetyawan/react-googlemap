const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

// Create express app
const app = express();
// Set the port to use
const port = 3001;

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// parse  requests of content-type - application/json
app.use(bodyParser.json());
// activate CORS
app.use(cors());

// Configuring the database
const dbConfig = require("./config/database.config.js");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

// Connecting to the database
mongoose
  .connect(
    dbConfig.url,
    {
      useNewUrlParser: true
    }
  )
  .then(() => {
    console.log("Successfully connected to the database");
  })
  .catch(err => {
    console.log("Could not connect to the database. Exiting now...");
    process.exit();
  });

// define a simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Crud API" });
});

// Require the appointments routes
require("./routes/place.routes.js")(app);

// Listen for requests
app.listen(port, () => {
  console.log("Server is listening on port " + port);
});
