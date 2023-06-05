const { Router } = require("express");
const router = Router();
const {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");

const authMiddleware = require("../middlewares/session");
const checkRole = require("../middlewares/role");

router.get("/", getReviews);

router.get("/:id", getReview);

router.post("/", [
  authMiddleware
] , createReview);

router.put("/:id", [
  authMiddleware
], updateReview);

router.delete("/:id", [
  authMiddleware,
  checkRole(['admin']),
], deleteReview);

module.exports = router;
