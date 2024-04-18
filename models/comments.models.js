const db = require("../db/connection");

exports.selectArticleComments = (articleId) => {
	return db
		.query(`SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`, [articleId])
		.then(({ rows }) => {
			return rows;
		});
};

exports.createComment = (articleId, { username, body }) => {
	return db
		.query(
			`INSERT INTO comments
	(body, article_id, author, votes)
	VALUES
	($1, $2, $3, 0)
	RETURNING *`,
			[body, articleId, username]
		)
		.then(({ rows: { 0: postedComment } }) => postedComment);
};

exports.commentExists = (commentId) => {
	return db.query(`SELECT * FROM comments WHERE comment_id = $1`, [commentId]).then(({ rows }) => {
		if (!rows.length) return Promise.reject({ status: 404, msg: "Comment Not Found" });
	});
};

exports.removeComment = (commentId) => {
	return db.query(`DELETE FROM comments WHERE comment_id = $1`, [commentId]);
};
