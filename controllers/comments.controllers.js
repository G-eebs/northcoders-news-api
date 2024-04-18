const { removeComment, commentExists } = require("../models/comments.models");

exports.deleteComment = (req, res, next) => {
	const { comment_id } = req.params;
	Promise.all([removeComment(comment_id), commentExists(comment_id)])
		.then(() => {
			res.status(204).send();
		})
		.catch(next);
};
