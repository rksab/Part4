const { test, describe } = require("node:test");
const assert = require("node:assert");

const listHelper = require("../utils/list_helper");
const blogs = [];
const listBlogs = [
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "How to peel a potato",
    author: "Martha",
    url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
    likes: 10,
    __v: 0,
  },
  {
    _id: "5a422aa71b54a678734d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Elon Musk",
    url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
    likes: 5,
    __v: 0,
  },
  {
    _id: "5a412aa71b54a676234d17f8",
    title: "How to be a fascist",
    author: "Elon Musk",
    url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
    likes: 25,
    __v: 0,
  },
];

//testing dummy
test("dummy returns one", () => {
  const result = listHelper.dummy(blogs);
  assert.strictEqual(result, 1);
});

//testing totallikes
describe("total likes", () => {
  test("Total likes", () => {
    const result = listHelper.totalLikes(listBlogs);
    assert.strictEqual(result, 40);
  });
});

//testing most favorite blog
describe("most favorite", () => {
  test("when list has only most likes", () => {
    const result = listHelper.favoriteBlog(listBlogs);
    assert.deepStrictEqual(result, {
      _id: "5a412aa71b54a676234d17f8",
      title: "How to be a fascist",
      author: "Elon Musk",
      url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
      likes: 25,
      __v: 0,
    });
  });
});

//testing most blogpost author
describe("author with most blogs", () => {
  test("author with most blog posts", () => {
    const result = listHelper.mostBlogs(listBlogs);
    assert.deepStrictEqual(result, { author: "Elon Musk", blogs: 2 });
  });
});
// author with most likes
describe("author with most likes", () => {
  test("author with most likes on blog posts", () => {
    const result = listHelper.mostLikes(listBlogs);
    assert.deepStrictEqual(result, { author: "Elon Musk", likes: 30 });
  });
});
