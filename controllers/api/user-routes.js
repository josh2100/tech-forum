const router = require("express").Router();
const { User, Post, Comment } = require("../../models");

// Read all users api/users
router.get("/", async (req, res) => {
  try {
    const allUsers = await User.findAll({});
///////// this section does nothing
    if (!allUsers) {
      res.status(404).json({ message: "No users found" });
    }
////////////
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
    res.status(500).json(error);
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

    req.session.save(() => {
      req.session.user_id = newUser.id;
      req.session.username = newUser.username;
      req.session.loggedIn = true;

    res.status(200).json(`User ${newUser.username} has been created`);
    });

    console.log("=========================")


  } catch (error) {
    res.status(500).json(error);
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
    /// save method allows us to save variables
    req.session.save(() => {
      req.session.user_id = existingUser.id;
      req.session.username = existingUser.username;
      req.session.loggedIn = true;

      res.json({ user: existingUser, message: "You are now logged in!" });
    });


  } catch (error) {
    res.status(500).json(error);
  }
});

// Logout user api/users/:id
router.post("/logout", (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

// Update user api/users/:id
router.put("/:id", async (req, res) => {
  // expects { "username": "tiger", "email": "tiger@email.com", "password": "tiger"}
  // pass in req.body to only update what's passed through
  try {
    const updatedUser = await User.update(req.body, {
      individualHooks: true,
      where: {
        id: req.params.id,
      },
    });

    if (!updatedUser) {
      res.status(404).json({ message: "No user found with this id" });
      return;
    }

    res.status(200).json(`User ${req.params.id} has been updated`);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Delete user at api/users/:id
router.delete("/:id", async (req, res) => {
  try {
    const deletedUser = await User.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!deletedUser) {
      res.status(404).json({ message: "No user found with this id" });
      return;
    }

    res.status(200).json(`User ${req.params.id} has been deleted`);

  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
