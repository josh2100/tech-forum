const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

// Create our Post model
class Post extends Model {}

// create fields/columns for Post model
Post.init(
  // id | title | user_id | post_text
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true, // Important!
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // post_url: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    //   // Ensure url is valid by setting to true
    //   validate: {
    //     isURL: true,
    //   },
    // },
    // Who posted the news article
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "user",
        key: "id",
      },
    },
    post_text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  // Configure metadata
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: "post",
  }
);

module.exports = Post;
