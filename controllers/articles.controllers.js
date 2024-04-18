const { selectArticleById, selectArticles, updateArticle } = require("../models/articles.models");
const { topicExists } = require("../models/topics.models");

exports.getArticleById = (req, res, next) => {
	const { article_id } = req.params;
	selectArticleById(article_id)
		.then((article) => {
			res.status(200).send({ article });
		})
		.catch(next);
};

exports.getArticles = (req, res, next) => {
	const { topic, sort_by, order } = req.query;
	Promise.all([selectArticles(topic, sort_by, order), topicExists(topic)])
		.then(([articles]) => {
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
