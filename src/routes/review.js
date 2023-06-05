const { Router } = require("express");
const router = Router();
const {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");

router.get("/", getReviews);
router.get("/:id", getReview);
router.post("/", createReview);
router.put("/:id", updateReview);

router.delete("/:id", deleteReview);

module.exports = router;
