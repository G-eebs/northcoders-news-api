const db = require("../db/connection");

exports.commentExists = (commentId) => {
	return db.query(`SELECT * FROM comments WHERE comment_id = $1`, [commentId]).then(({ rows }) => {
		if (!rows.length) return Promise.reject({ status: 404, msg: "Comment Not Found" });
	});
};

exports.removeComment = (commentId) => {
	return db.query(`DELETE FROM comments WHERE comment_id = $1`, [commentId]);
};

exports.updateComment = (commentId, { inc_votes }) => {
	return db
		.query(
			`UPDATE comments
	SET votes = votes + $1
	WHERE comment_id = $2
	RETURNING *`,
			[inc_votes, commentId]
		)
		.then(({ rows: { 0: updatedComment } }) => updatedComment);
};
