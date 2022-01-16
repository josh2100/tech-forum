const router = require("express").Router();
const sequelize = require("../config/connection");
const { Post, User, Comment } = require("../models");

// READ all posts for homepage
router.get("/", async (req, res) => {
// Get all posts
// render into handlebars template
  try {
    const allPosts = await Post.findAll({
      // attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
      include: [
        {
          model: Comment,
          // attributes: ["id"],
        },
      ],
    });

    // What does this line do?
    const posts = allPosts.map((post) => post.get({ plain: true }));

    res.render("homepage", {
      posts,
      loggedIn: req.session.loggedIn,
    });


    // res.status(200).json(posts);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Get single post
router.get("/post/:id", (req, res) => {

});

router.get("/login", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/");
    return;
  }

  res.render("login");
});

module.exports = router;
