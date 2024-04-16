const express = require("express");
const { handleInvalidEndpoint, handleCustomErrors, handlePsqlErrors, handleServerErrors } = require("./errors");
const { getAllTopics } = require("./controllers/topics.controllers");
const { getEndpoints } = require("./controllers/api.controllers");
const { getArticleById, getAllArticles } = require("./controllers/articles.controllers");
const { getArticleComments } = require("./controllers/comments.controllers");

const app = express();

app.get("/api/topics", getAllTopics);

app.get("/api", getEndpoints);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id/comments", getArticleComments)

app.use(handleInvalidEndpoint);

app.use(handleCustomErrors);

app.use(handlePsqlErrors);

app.use(handleServerErrors);

module.exports = app;
