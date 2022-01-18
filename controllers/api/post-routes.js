const router = require("express").Router();
const sequelize = require("../../config/connection");
const { Post, User, Comment } = require("../../models");
const withAuth = require("../../utils/auth");

// Get all posts (api/posts/)
router.get("/", async (req, res) => {
  // Get all posts
  // render into handlebars template
  try {
    const allPosts = await Post.findAll({
      // attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
      // id | title | user_id | post_text | date_created auto?
      include: [
        {
          model: Comment,
          attributes: ["comment_text"],
        },
      ],
    });

    res.status(200).json(allPosts);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Read a single post by id api/categories/:id
router.get("/:id", async (req, res) => {
  try {
    const onePost = await Post.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!onePost) {
      res.status(404).json({ message: "No post found with this id" });
      return;
    }
    res.json(onePost);
  } catch (error) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Create new post api/posts/
// router.post("/", withAuth, async (req, res) => {
router.post("/", async (req, res) => {
  // expects {title: 'Aliens!',
  // post_text: 'What!?', user_id: 1}
  // id | title | user_id | post_text
  console.log("============================");
  console.log(`line 54 ${req.session.user_id}`);
  console.log(`line 54 ${req.body.post_text}`);
  console.log(`line 54 ${req.body.title}`);

  try {
    const newPost = await Post.create({
      // id | title | user_id | post_text | date_created auto?
      title: req.body.title,
      post_text: req.body.post_text,
      user_id: req.session.user_id,
    });

    res.status(200).json(`Post added: ${newPost.title}`);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Update a post title (api/posts/:id)
// router.put("/:id", withAuth, (req, res) => {
router.put("/:id", async (req, res) => {
  try {
    const updatedPost = await Post.update(
      /// Replace with new title
      {
        title: req.body.title,
      },
      {
        // At the id specified in the url
        where: {
          id: req.params.id,
        },
      }
    );

    if (!updatedPost) {
      res.status(404).json({ message: "No post found with this id" });
      return;
    }
    res.status(200).json(updatedPost);
  } catch (error) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Delete a post (api/posts/:id)
// router.delete("/:id", withAuth, (req, res) => {
router.delete("/:id", async (req, res) => {
  try {
    const deletedPost = await Post.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!deletedPost) {
      res.status(404).json({ message: "No post found with this id" });
      return;
    }

    res.status(200).json(`Post ${req.params.id} has been deleted`);
  } catch (error) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
