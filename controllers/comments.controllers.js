const { removeComment, commentExists, updateComment } = require("../models/comments.models");

exports.deleteComment = (req, res, next) => {
	const { comment_id } = req.params;
	Promise.all([removeComment(comment_id), commentExists(comment_id)])
		.then(() => {
			res.status(204).send();
		})
		.catch(next);
};

exports.patchComment = (req, res, next) => {
	const { comment_id } = req.params;
	const newVote = req.body;
	Promise.all([updateComment(comment_id, newVote), commentExists(comment_id)])
		.then(([updatedComment]) => {
			res.status(200).send({ updatedComment });
		})
		.catch(next);
};
