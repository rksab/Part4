const mongoose = require("mongoose");
const express = require("express");
const app = express();
const cors = require("cors");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://ramansarabha:${password}@cluster0.pbtpal7.mongodb.net/blogApp?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(url);

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
});

const Blog = mongoose.model("Blog", blogSchema);

app.use(cors());
app.use(express.json());

Blog.find({}).then((result) => {
  result.forEach((note) => {
    console.log(note);
  });
  mongoose.connection.close();
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
