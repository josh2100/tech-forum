const router = require("express").Router();
const sequelize = require("../config/connection");
const { Post, User, Comment } = require("../models");
const withAuth = require("../utils/auth");

// Read all posts by a user /dashboard
router.get("/", withAuth, async (req, res) => {
  console.log(req.session);
  console.log("======================");
  try {
    const allPosts = await Post.findAll({
    // Finds all posts where id matches whomever is logged in
    where: {
      user_id: req.session.user_id,
    },
// test area
    attributes: [
      "id",
      "post_text",
      "title",
      "created_at",
    ],
// testarea
    include: [
      {
        model: Comment,
        attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
        include: {
          model: User,
          attributes: ["username"],
        },
      },
      {
        model: User,
        attributes: ["username"],
      },
    ],
  });

  const postsMap = allPosts.map((post) => post.get({ plain: true }));
  res.render("dashboard", { postsMap, loggedIn: true });
  console.log(postsMap);

  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/edit/:id", withAuth, (req, res) => {
  Post.findByPk(req.params.id, {
    include: [
      {
        model: Comment,
        attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
        include: {
          model: User,
          attributes: ["username"],
        },
      },
      {
        model: User,
        attributes: ["username"],
      },
    ],
  })
    .then((dbPostData) => {
      if (dbPostData) {
        const post = dbPostData.get({ plain: true });

        res.render("edit-post", {
          post,
          loggedIn: true,
        });
      } else {
        res.status(404).end();
      }
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

module.exports = router;
