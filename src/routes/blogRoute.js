const express = require("express");
const router = express.Router();

const {
  createBlog,
  editBlog,
  deleteBlog,
  singleBlog,
  allBlogs,
  allBlogsOfUser,
} = require("../controllers/blogController");
const upload = require("../middlewares/fileUpload");
const { authenticate } = require("../middlewares/authMiddleware");
const { createBlogValidation } = require("../validations/api/blogValidation");
const { authorize } = require("../middlewares/authorization");

router
  .route("/create")
  .post(
    authenticate,
    authorize("create_blog"),
    upload.array("blog", 10),
    createBlogValidation,
    createBlog
  );

router.route("/edit").put(authenticate, authorize("edit_blog"), editBlog);
router
  .route("/delete")
  .delete(authenticate, authorize("delete_blog"), deleteBlog);

router.route("/all").get(authenticate, authorize("view_all_blogs"), allBlogs);

router.route("/single").get(authenticate, authorize("view_blog"), singleBlog);

router
  .route("/user/all")
  .get(authenticate, authorize("view_all_blogs"), allBlogsOfUser);

module.exports = router;
