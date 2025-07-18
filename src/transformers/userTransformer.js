const transformUser = (user) => {
  return {
    id: user._id,
    first_name: user.first_name,
    last_name: user.last_name,
    fullname: user.first_name + " " + user.last_name,
    email: user.email,
    followers: user.followers,
    following: user.following,
  };
};

const transformUserCollection = (users) => {
  return users.map(transformUser);
};

module.exports = { transformUserCollection, transformUser };
