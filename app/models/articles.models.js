const db = require("../../db/connection");

exports.selectArticleById = (articleId) => {
	return db.query(`SELECT * FROM articles WHERE article_id = $1`, [articleId]).then(({ rows }) => {
		if (!rows.length) return Promise.reject({ status: 404, msg: "Not Found" });
		return rows[0];
	});
};

exports.selectAllArticles = () => {
	return db
		.query(
			`SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count
  FROM articles 
  LEFT JOIN comments 
  ON articles.article_id = comments.article_id
  GROUP BY articles.article_id
  ORDER BY articles.created_at DESC`
		)
		.then(({ rows }) => rows);
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
