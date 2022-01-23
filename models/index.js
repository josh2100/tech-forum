const User = require("./User");
const Post = require("./Post");
const Comment = require("./Comment");

// Create associations
User.hasMany(Post, {
  foreignKey: "user_id",
});

Post.belongsTo(User, {
  foreignKey: "user_id",
});

Comment.belongsTo(User, {
  foreignKey: "user_id",
});

Comment.belongsTo(Post, {
  foreignKey: "post_id",
});

User.hasMany(Comment, {
  foreignKey: "user_id",
});

Post.hasMany(Comment, {
  foreignKey: "post_id",
});

module.exports = { User, Post, Comment };

// Error: user.hasMany called with something that's not a 
//subclass of Sequelize.Model

//What is a subclass?

// What is circular dependency?

// cannot delete or update a parent row