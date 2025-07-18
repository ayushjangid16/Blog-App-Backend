const express = require("express");
const {
  update,
  remove,
  index,
  react,
} = require("../controllers/commentController");
const { authenticate } = require("../middlewares/authMiddleware");
const {
  editValidation,
  indexValidation,
  deleteValidation,
} = require("../validations/api/commentValidation");
const { isSystemUser } = require("../middlewares/authorization");
const { reactOnComment } = require("../validations/api/reactValidation");

const router = express.Router();

// comment edit
router.route("/edit").put(authenticate, isSystemUser, editValidation, update);

// comment delete
router
  .route("/delete")
  .delete(authenticate, isSystemUser, deleteValidation, remove);

// react on a comment
router.route("/react").post(authenticate, isSystemUser, reactOnComment, react);

module.exports = router;
