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

router.delete("/:id", withAuth, (req, res) => {
  
  Comment.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((dbCommentData) => {
      if (!dbCommentData) {
        res.status(404).json({ message: "No comment found with this id!" });
        return;
      }
      res.json(dbCommentData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });


});

module.exports = router;
