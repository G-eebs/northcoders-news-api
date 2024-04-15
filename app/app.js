const express = require("express");
const { handleInvalidEndpoint, handleCustomErrors, handlePsqlErrors } = require("./errors");
const { getAllTopics } = require("./controllers/topics.controllers");
const { getEndpoints } = require("./controllers/api.controllers");
const { getArticleById } = require("./controllers/articles.controllers");

const app = express();


app.get("/api/topics", getAllTopics);

app.get("/api", getEndpoints);

app.get("/api/articles/:article_id", getArticleById);


app.use(handleInvalidEndpoint);

app.use(handleCustomErrors);

app.use(handlePsqlErrors);

module.exports = app;
