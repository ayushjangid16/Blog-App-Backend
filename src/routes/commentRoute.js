const express = require("express");
const {
  create,
  update,
  remove,
  index,
} = require("../controllers/commentController");
const { authenticate } = require("../middlewares/authMiddleware");
const {
  createValidation,
  editValidation,
  indexValidation,
  deleteValidation,
} = require("../validations/api/commentValidation");
const { isSystemUser } = require("../middlewares/authorization");

const router = express.Router();

router
  .route("/create")
  .post(authenticate, isSystemUser, createValidation, create);
router.route("/edit").put(authenticate, isSystemUser, editValidation, update);
router
  .route("/delete")
  .delete(authenticate, isSystemUser, deleteValidation, remove);
router.route("/all").get(authenticate, indexValidation, index);

module.exports = router;
