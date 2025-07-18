const express = require("express");
const router = express.Router();

const {
  createBlog,
  editBlog,
  deleteBlog,
  singleBlog,
  allBlogs,
  allBlogsOfUser,
  allComments,
  comment,
  react,
} = require("../controllers/blogController");
const upload = require("../middlewares/fileUpload");
const { authenticate } = require("../middlewares/authMiddleware");
const { createBlogValidation } = require("../validations/api/blogValidation");
const { authorize, isSystemUser } = require("../middlewares/authorization");
const { reactOnPost } = require("../validations/api/reactValidation");
const {
  createValidation,
  indexValidation,
} = require("../validations/api/commentValidation");

// create blog
router
  .route("/create")
  .post(
    authenticate,
    authorize("create_blog"),
    upload.array("blog", 10),
    createBlogValidation,
    createBlog
  );

// edit blog
router.route("/edit").put(authenticate, authorize("edit_blog"), editBlog);

// delete blog
router
  .route("/delete")
  .delete(authenticate, authorize("delete_blog"), deleteBlog);

// to get all the blogs
router.route("/all").get(authenticate, authorize("view_all_blogs"), allBlogs);

// to get single blog
router.route("/single").get(authenticate, authorize("view_blog"), singleBlog);

// to get user's all blogs
router
  .route("/user/all")
  .get(authenticate, authorize("view_all_blogs"), allBlogsOfUser);

// to get all comments
router.route("/comments").get(authenticate, indexValidation, allComments);

// to comment on a blog
router
  .route("/comment")
  .post(authenticate, isSystemUser, createValidation, comment);

// to react on a blog
router.route("/react").post(authenticate, isSystemUser, reactOnPost, react);

module.exports = router;
