const express = require("express");
const { handleInvalidEndpoint, handleCustomErrors, handlePsqlErrors, handleServerErrors } = require("./errors");
const apiRouter = require("./routes/api-router");
const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api", apiRouter);

app.use(handleInvalidEndpoint);

app.use(handleCustomErrors);

app.use(handlePsqlErrors);

app.use(handleServerErrors);

module.exports = app;
