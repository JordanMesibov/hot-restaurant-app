//This is where I will add functionality.
var express = require("express");
var path = require("path");
var connection = require("./database/connection");
var app = express();
var PORT = process.env.PORT || 3000;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Saving a new table:
app.post("/api/tables", function(req, res) {
  connection.query("SELECT COUNT(IF(isWaiting = FALSE, 1, NULL)) 'count' FROM tables", function(err, dbSeated) {
    if (err) throw err;
    // Set isWaiting = true if 5 or more tables are already seated.
    if (dbSeated[0].count > 4) {
        req.body.isWaiting = true;
    }

    connection.query("INSERT INTO tables SET ?", req.body, function(err, result) {
      if (err) throw err;

      connection.query("SELECT * FROM tables WHERE id = ?", [result.insertId], function(err, dbTables) {
        res.json(dbTables[0]);
      });
    });
  });
});

// get tables that have their isWaiting value set equal to true (AKA the waiting list)
app.get ("/api/waitlist", function(req, res) {
  connection.query("SELECT * FROM tables WHERE isWaiting = TRUE", function(err, dbTables) {
    res.json(dbTables);
  });
});

// Clear all of the existing tables
app.delete("/api/tables", function(req, res) {
  connection.query("DELETE FROM tables", function(err, result) {
    if (err) throw err;
    res.json(result);
  });
});

// send my tables.html file at the path "/tables"
app.get("/tables", function(req, res) {
  res.sendFile(path.join(__dirname, "./public/tables.html"));
});

// send my reserve.html file at the path "/reserve"
app.get("/reserve", function(req, res) {
  res.sendFile(path.join(__dirname, "./public/reserve.html"));
});

// set it up so that any other path will serve my home.html page
app.get("*", function(req, res) {
  res.sendFile(path.join(__dirnamem, "./public/home.html"));
});

app.listen(PORT, function() {
  console.log("The app is now listening on PORT: " + PORT);
});