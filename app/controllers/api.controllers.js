const { selectEndpoints } = require("../models/api.models");

exports.getEndpoints = (req, res) => {
	const endpoints = selectEndpoints();
	res.status(200).send({ endpoints });
};
