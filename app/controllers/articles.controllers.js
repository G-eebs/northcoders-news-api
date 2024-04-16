const { selectArticleById, selectAllArticles, updateArticle } = require("../models/articles.models");

exports.getArticleById = (req, res, next) => {
	const { article_id } = req.params;
	selectArticleById(article_id)
		.then((article) => {
			res.status(200).send({ article });
		})
		.catch(next);
};

exports.getAllArticles = (req, res, next) => {
	selectAllArticles()
		.then((articles) => {
			res.status(200).send({ articles });
		})
		.catch(next);
};

exports.patchArticle = (req, res, next) => {
	const { article_id } = req.params;
	const newVote = req.body;
	Promise.all([updateArticle(article_id, newVote), selectArticleById(article_id)])
		.then(([updatedArticle]) => {
			res.status(200).send({ updatedArticle });
		})
		.catch(next);
};
