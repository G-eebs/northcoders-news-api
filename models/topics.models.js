const db = require("../db/connection");

exports.selectAllTopics = () => {
	return db.query(`SELECT * FROM topics`).then(({ rows }) => rows);
};

exports.topicExists = (topic) => {
	if (topic) {
		return db.query(`SELECT * FROM topics WHERE slug = $1`, [topic]).then(({ rows }) => {
			if (!rows.length) return Promise.reject({ status: 404, msg: "Topic Not Found" });
		});
	}
};
