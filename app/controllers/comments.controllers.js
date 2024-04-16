const { selectArticleById } = require("../models/articles.models");
const { selectArticleComments, createComment } = require("../models/comments.models");

exports.getArticleComments = (req, res, next) => {
	const { article_id } = req.params;
	Promise.all([selectArticleComments(article_id), selectArticleById(article_id)])
		.then(([comments]) => {
			res.status(200).send({ comments });
		})
		.catch(next);
};

exports.postComment = (req, res, next) => {
	const { article_id } = req.params;
	const newComment = req.body;
	createComment(article_id, newComment)
		.then((postedComment) => {
			res.status(201).send({ postedComment });
		})
		.catch(next);
};
