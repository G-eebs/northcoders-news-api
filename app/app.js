const express = require("express");
const { invalidEndpoint } = require("./errors");
const { getAllTopics } = require("./controllers/topics.controllers");

const app = express();

app.get("/api/topics", getAllTopics);

app.use("*", invalidEndpoint);

module.exports = app;
