exports.invalidEndpoint = (req, res) => {
	res.status(404).send({ status: 404, msg: "Not Found" });
};
