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

