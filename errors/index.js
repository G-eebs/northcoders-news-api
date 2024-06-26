exports.handleInvalidEndpoint =
	("*",
	(req, res) => {
		res.status(404).send({ status: 404, msg: "Endpoint Not Found" });
	});

exports.handleCustomErrors = (err, req, res, next) => {
	if (err.status && err.msg) {
		res.status(err.status).send({ msg: err.msg });
	} else next(err);
};

exports.handlePsqlErrors = (err, req, res, next) => {
	if (err.code === "23503") {
		res.status(404).send({ status: 404, msg: "Not Found" });
	} else if (err.code === "22P02" || "23502") {
		res.status(400).send({ msg: "Invalid Request" });
	} else next(err);
};

exports.handleServerErrors = (err, req, res, next) => {
	console.log(err);
	res.status(500).send({ msg: "Internal Server Error" });
};
