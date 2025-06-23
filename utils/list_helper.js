const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((sum, item) => sum + item.likes, 0);
};

const favoriteBlog = (blogs) => {
  const likes = blogs.map((blog) => blog.likes);
  const idx = likes.indexOf(Math.max(...likes));
  return blogs[idx];
};

const mostBlogs = (blogs) => {
  let authors = blogs.map((blog) => blog.author);
  authors = [...new Set(authors)];

  let published = new Array(authors.length).fill(0);
  blogs.map((blog) => (published[authors.indexOf(blog.author)] += 1));

  let index = published.indexOf(Math.max(...published));

  return {
    author: authors[index],
    blogs: published[index],
  };
};

const mostLikes = (blogs) => {
  let authors = blogs.map((blog) => blog.author);
  authors = [...new Set(authors)];

  let likes = new Array(authors.length).fill(0);
  blogs.map((blog) => (likes[authors.indexOf(blog.author)] += blog.likes));

  let index = likes.indexOf(Math.max(...likes));

  return {
    author: authors[index],
    likes: likes[index],
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
