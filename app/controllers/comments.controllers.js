const { selectArticleById } = require("../models/articles.models");
const { selectArticleComments } = require("../models/comments.models");

exports.getArticleComments = (req, res, next) => {
	const { article_id } = req.params;
	Promise.all([selectArticleComments(article_id),selectArticleById(article_id)])
		.then(([comments]) => {
			res.status(200).send({ comments });
		})
	.catch(next);
};
