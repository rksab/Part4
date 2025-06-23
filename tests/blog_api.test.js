const { test, after, beforeEach } = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const User = require('../models/user')
const Blog = require("../models/blog");
const assert = require("node:assert");
const bcrypt = require('bcrypt')
const api = supertest(app);


const initialBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0,
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0,
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0,
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0,
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0,
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0,
  },
];


test("correct amount of blogs is returned", async () => {
  const response = await api.get("/api/blogs");
  assert.strictEqual(response.body.length, initialBlogs.length);
});

test("identifying object is id", async () => {
  const response = await api.get("/api/blogs");
  const exist = response.body[0].id;
  if (exist) {
    res = 1;
  }
  assert.strictEqual(res, 1);
});

test("adding a blog", async () => {
  const initialblogs = await api.get("/api/blogs");

  const response = await api.post("/api/blogs").set('Authorization', `Bearer ${token}`).send({
    title: "how to knit",
    author: "granny",
    url: "www.http//knitting.com",
    likes: "234",
  });

  const finalblogs = await api.get("/api/blogs");
  assert.strictEqual(initialblogs.body.length + 1, finalblogs.body.length);
});

test("adding a blog fails with 401 Unauthorized if token is not provided", async () => {
  const newBlog = {
    title: "no auth blog",
    author: "nobody",
    url: "http://example.com",
    likes: 1
  };

  const response = await api
    .post("/api/blogs")
    .send(newBlog);

  assert.strictEqual(response.status, 401);
  assert.strictEqual(response.body.error, "token missing");
});

test("adding a post with 0 likes", async () => {
  const response = await api.post("/api/blogs").set('Authorization', `Bearer ${token}`).send({
    title: "how to knit",
    author: "granny",
    url: "www.http//knitting.com",
  });
  assert.strictEqual(response.body.likes, 0);
});

test("post without title", async () => {
  const response = await api.post("/api/blogs").set('Authorization', `Bearer ${token}`).send({
    author: "granny",
    url: "www.http//knitting.com",
  });
  assert.strictEqual(response.status, 400);
});

test("delete a post", async () => {
  const response = await api.delete("/api/blogs/5a422bc61b54a676234d17fc").set('Authorization', `Bearer ${token}`);
  assert.strictEqual(response.status, 204);
});

test("deleting a post with token missing", async () => {
  const response = await api.delete("/api/blogs/5a422bc61b54a676234d17fc");
  assert.strictEqual(response.status, 401);
  assert.strictEqual(response.body.error, "token missing");
});

test("updating a post", async () => {
  const newlikes = { likes: "22" };
  const response = await api
    .put("/api/blogs/5a422bc61b54a676234d17fc")
    .set('Authorization', `Bearer ${token}`)
    .send(newlikes);
  finalblog = await api.get("/api/blogs/5a422bc61b54a676234d17fc");
  assert.strictEqual(22, finalblog.body.likes);
});

test("updating a post with token missing", async () => {
  const newlikes = { likes: "22" };
  const response = await api
    .put("/api/blogs/5a422bc61b54a676234d17fc")
    .send(newlikes);
    assert.strictEqual(response.status, 401);
    assert.strictEqual(response.body.error, "token missing");
});

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', name: 'Superuser', passwordHash })
  const savedUser = await user.save()

  const loginResponse = await api
    .post('/api/login')
    .send({ username: 'root', password: 'sekret' })

  token = loginResponse.body.token
  const blogsWithUser = initialBlogs.map(blog => ({
    ...blog,
    user: savedUser._id
  }))
  await Blog.insertMany(blogsWithUser)
})

after(async () => {
  await mongoose.connection.close();
});
