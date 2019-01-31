//This is where I will add functionality.
var express = require("express");
var path = require("path");
var connection = require("connection");
var app = express();
var PORT = process.env.PORT || 3000;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());