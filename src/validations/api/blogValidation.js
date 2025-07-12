const zod = require("zod");
const fs = require("fs/promises");

const deleteFile = async (blog) => {
  if (blog?.path) {
    try {
      await fs.unlink(blog.path);
      console.log(`Deleted file: ${blog.path}`);
    } catch (err) {
      console.error(`Failed to delete file: ${blog.path}`, err);
    }
  }
};

const createBlogValidation = async (req, res, next) => {
  const schema = zod.object({
    title: zod
      .string()
      .min(10, "Title Should be of atleast 10 Characters")
      .max(30, "Title Cannot Exceed length of 30"),
    description: zod
      .string()
      .min(10, "Description Should be of atleast 10 Characters")
      .max(2000, "Descrption Cannot exceed Length of 2000."),
  });

  const result = schema.safeParse(req.body);
  const blog = req.files;

  const error = {};

  if (!result.success) {
    for (let file of blog) {
      await deleteFile(file);
    }
    for (const er of result.error.errors) {
      error[er.path[0]] = er.message;
    }
    return res.error("Validation Error", 400, error);
  }

  if (!blog) {
    error["File"] = "Blog File Missing";
    return res.error("Validation Error", 400, error);
  }

  next();
};

module.exports = {
  createBlogValidation,
};
