const router = require("express").Router();
const { Comment } = require("../../models");
const withAuth = require("../../utils/auth");

// Get all comments at api/comments
router.get("/", async (req, res) => {
  try {
    const allComments = await Comment.findAll();

    res.status(200).json(allComments);
  } catch (error) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Get one comment at api/comments:id
router.get("/:id", async (req, res) => {
  try {
    const oneComment = await Comment.findOne({
      where: {
        id: req.params.id,
      },
    });

    ////// Section does not work
    if (!oneComment) {
      res.status(404).json({ message: "No comment found with that id" });
    }
    /////////

    res.status(200).json(oneComment);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Create new comment api/comments
// router.post("/", withAuth, (req, res) => {
router.post("/", async (req, res) => {
  // expects => {comment_text: "This is the comment", user_id: 1, post_id: 2}
  try {
    const newComment = await Comment.create({
      comment_text: req.body.comment_text,
      // user_id: req.session.user_id, withAuth broken
      user_id: req.body.user_id,
      post_id: req.body.post_id,
    });

    res.status(200).json(`New comment added: ${newComment.comment_text}`);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});

// Delete comment api/comments/:id
router.delete("/:id", (req, res) => {
  try {
    const deletedComment = Comment.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!deletedComment) {
      res.status(404).json({ message: "No comment found with this id!" });
      return;
    }

    res.status(200).json(deletedComment);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

module.exports = router;
