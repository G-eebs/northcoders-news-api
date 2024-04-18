const db = require("../db/connection");

exports.selectArticleById = (articleId) => {
	return db
		.query(
			`SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.body, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id)::INT AS comment_count 
			FROM articles
			LEFT JOIN comments
			ON articles.article_id = comments.article_id 
			WHERE articles.article_id = $1
			GROUP BY articles.article_id`,
			[articleId]
		)
		.then(({ rows }) => {
			if (!rows.length) return Promise.reject({ status: 404, msg: "Not Found" });
			return rows[0];
		});
};

exports.selectArticles = (topic) => {
	const queries = [];

	let sqlString = `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id)::INT AS comment_count
  FROM articles 
	LEFT JOIN comments 
  ON articles.article_id = comments.article_id `;

	if (topic) {
		sqlString += `WHERE topic = $1 `;
		queries.push(topic);
	}

	sqlString += `GROUP BY articles.article_id
	ORDER BY articles.created_at DESC`;

	return db.query(sqlString, queries).then(({ rows }) => rows);
};

exports.updateArticle = (articleId, { inc_votes }) => {
	return db
		.query(
			`UPDATE articles
	SET votes = votes + $1
	WHERE article_id = $2
	RETURNING *`,
			[inc_votes, articleId]
		)
		.then(({ rows: { 0: updatedArticle } }) => {
			return updatedArticle;
		});
};
