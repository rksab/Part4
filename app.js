const config = require("./utils/config");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const logger = require("./utils/logger");
const loginRouter = require('./controllers/login');
const middleware = require("./utils/middleware");
const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");

mongoose.set("strictQuery", false);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connection to MongoDB:", error.message);
  });

app.use(cors());
app.use(express.static("dist"));
app.use(express.json());

app.use(middleware.requestLogger);
app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);
app.use('/api/login', loginRouter);

app.use(middleware.errorHandler);
app.use(middleware.unknownEndpoint);


module.exports = app;
