const createBlog = async (req, res) => {
  console.log(req.file);
  res.json(req.file);
};

module.exports = {
  createBlog,
};
