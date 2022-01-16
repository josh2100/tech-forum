const router = require("express").Router();
const { User, Post, Comment, Vote } = require("../../models");

// Read all users api/users
router.get("/", async (req, res) => {
  try {
    const allUsers = await User.findAll({});

    if (!allUsers) {
      res.status(404).json({ message: "No users found" });
    }

    res.status(200).json(allUsers);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Read a single user by id api/users/:id
router.get("/:id", async (req, res) => {
  try {
    const singleUser = await User.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!singleUser) {
      res.status(400).json({ message: "No user found with that id" });
    }

    res.status(200).json(singleUser);
  } catch (error) {
    console.log(error);
  }
});

// Create user api/users
router.post("/", async (req, res) => {
  // expects {username: 'techman', email: 'techman@email.com', password: 'techman'}
  try {
    if (!req.body.username) {
      res.status(404).json({ message: "Provide a valid username" });
    }
    // Could also check if user already exists

    const newUser = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });

    res.status(200).json(newUser);
  } catch (error) {
    console.log(error);
  }
});

// Login user api/users/login
router.post("/login", async (req, res) => {
  // expects {"email": 'techman@email.com', password: 'techman'}
  try {
    const existingUser = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (!existingUser) {
      res.status(400).json({ message: "No user with that email address!" });
      return;
    }

    const validPassword = existingUser.checkPassword(req.body.password);

    if (!validPassword) {
      res.status(400).json({ message: "Incorrect password!" });
      return;
    }

    req.session.save(() => {
      req.session.user_id = existingUser.id;
      req.session.username = existingUser.username;
      req.session.loggedIn = true;

      res.json({ user: existingUser, message: "You are now logged in!" });
    });

  } catch (error) {
    console.log(error);
  }
});

// Logout user
router.post("/logout", async (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

router.put("/:id", (req, res) => {
  // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}

  // pass in req.body instead to only update what's passed through
  User.update(req.body, {
    individualHooks: true,
    where: {
      id: req.params.id,
    },
  })
    .then((dbUserData) => {
      if (!dbUserData) {
        res.status(404).json({ message: "No user found with this id" });
        return;
      }
      res.json(dbUserData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.delete("/:id", (req, res) => {
  User.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((dbUserData) => {
      if (!dbUserData) {
        res.status(404).json({ message: "No user found with this id" });
        return;
      }
      res.json(dbUserData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
