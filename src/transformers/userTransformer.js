const transformFile = (file) => {
  return {
    id: file.id,
    url: file.url,
  };
};

const { transformBlogCollection } = require("./blogTransformer");

const transformUser = (user) => {
  return {
    id: user._id,
    first_name: user.first_name,
    last_name: user.last_name,
    fullname: user.first_name + " " + user.last_name,
    email: user.email,
    followers: user.followers,
    following: user.following,
    avatar_url: user.avatar_url.map(transformFile),
    // posts: transformBlogCollection(user.posts),
    posts: user.posts,
  };
};

const transformUserCollection = (users) => {
  return users.map(transformUser);
};

module.exports = { transformUserCollection, transformUser };
