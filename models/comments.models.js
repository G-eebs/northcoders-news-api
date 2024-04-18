const db = require("../db/connection");

exports.commentExists = (commentId) => {
	return db.query(`SELECT * FROM comments WHERE comment_id = $1`, [commentId]).then(({ rows }) => {
		if (!rows.length) return Promise.reject({ status: 404, msg: "Comment Not Found" });
	});
};

exports.removeComment = (commentId) => {
	return db.query(`DELETE FROM comments WHERE comment_id = $1`, [commentId]);
};
