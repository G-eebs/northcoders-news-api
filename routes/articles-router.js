const {
	getArticles,
	getArticleById,
	patchArticle,
	getArticleComments,
	postComment,
} = require("../controllers/articles.controllers");

const articlesRouter = require("express").Router();

articlesRouter.route("/").get(getArticles);

articlesRouter.route("/:article_id").get(getArticleById).patch(patchArticle);

articlesRouter.route("/:article_id/comments").get(getArticleComments).post(postComment);

module.exports = articlesRouter;
