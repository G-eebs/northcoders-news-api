const { getAllTopics } = require("../controllers/topics.controllers");

const topicsRouter = require("express").Router();

topicsRouter.route("/")
.get(getAllTopics);

module.exports = topicsRouter;
