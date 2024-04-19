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
			if (!rows.length) return Promise.reject({ status: 404, msg: "Article Not Found" });
			return rows[0];
		});
};

exports.selectArticles = (topic, sortBy = "created_at", order = "desc") => {
	const queries = [];

	const validSortBys = [
		"article_id",
		"title",
		"topic",
		"author",
		"created_at",
		"votes",
		"article_img_url",
		"comment_count",
	];
	if (!validSortBys.includes(sortBy)) {
		return Promise.reject({ status: 400, msg: "Invalid Column" });
	}
	if (sortBy !== "comment_count") sortBy = "articles." + sortBy;

	const validOrders = ["asc", "desc"];
	if (!validOrders.includes(order)) {
		return Promise.reject({ status: 400, msg: "Invalid Order" });
	}
	order = order.toUpperCase();

	let sqlString = `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id)::INT AS comment_count
  FROM articles 
	LEFT JOIN comments 
  ON articles.article_id = comments.article_id `;

	if (topic) {
		sqlString += `WHERE topic = $1 `;
		queries.push(topic);
	}

	sqlString += `GROUP BY articles.article_id
	ORDER BY ${sortBy} ${order}`;

	return db.query(sqlString, queries).then(({ rows }) => rows);
};

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

exports.createArticle = ({ title, topic, author, body, article_img_url }) => {
	const sqlValues = [title, topic, author, body];

	let sqlString = `INSERT INTO articles 
	(title, topic, author, body, article_img_url)
	VALUES
	($1, $2, $3, $4,`;

	if (article_img_url) {
		(sqlString += ` $5)`), sqlValues.push(article_img_url);
	} else sqlString += ` DEFAULT)`;
	sqlString += ` RETURNING *`;

	return db.query(sqlString, sqlValues).then(({ rows: { 0: postedArticle } }) => {
		postedArticle.comment_count = 0;
		return postedArticle;
	});
};
