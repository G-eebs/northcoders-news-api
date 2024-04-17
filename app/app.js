const express = require("express");
const { handleInvalidEndpoint, handleCustomErrors, handlePsqlErrors, handleServerErrors } = require("./errors");
const { getAllTopics } = require("./controllers/topics.controllers");
const { getEndpoints } = require("./controllers/api.controllers");
const { getArticleById, getAllArticles, patchArticle } = require("./controllers/articles.controllers");
const { getArticleComments, postComment, deleteComment } = require("./controllers/comments.controllers");

const app = express();

app.use(express.json());

app.get("/api/topics", getAllTopics);

app.get("/api", getEndpoints);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id/comments", getArticleComments);

app.post("/api/articles/:article_id/comments", postComment);

app.patch("/api/articles/:article_id", patchArticle);

app.delete("/api/comments/:comment_id", deleteComment);

app.use(handleInvalidEndpoint);

app.use(handleCustomErrors);

app.use(handlePsqlErrors);

app.use(handleServerErrors);

module.exports = app;
