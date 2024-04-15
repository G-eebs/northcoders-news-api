const express = require("express");
const { invalidEndpoint } = require("./errors");
const { getAllTopics } = require("./controllers/topics.controllers");
const { getEndpoints } = require("./controllers/api.controllers");

const app = express();

app.get("/api/topics", getAllTopics);

app.get("/api", getEndpoints);

app.use("*", invalidEndpoint);

module.exports = app;
