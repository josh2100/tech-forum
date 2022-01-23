const express = require("express");
const routes = require("./controllers");
const sequelize = require("./config/connection");
const path = require("path");
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const helpers = require("./utils/helpers");

// Handlebars requirements
const exphbs = require("express-handlebars");
const hbs = exphbs.create({ helpers });

const app = express();
const PORT = process.env.PORT || 3001;

// Session requirements
const sess = {
  // secret: "Super secret secret",
  secret: "secret",
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
//   cookie: {
//     expires: 120000
// }
};

// Session live on the server
// Cookies live in the user's browser

// adds session to request object
app.use(session(sess));

// Handlebars methods
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Deliver static pages
app.use(express.static(path.join(__dirname, "public")));

// turn on routes
app.use(routes);

// Turn on connection to db
const connectDb = async () => {
  // force: true allows drop if exists functionality to sequelize
  // leave force on false for better performance
  try {
    await sequelize.sync({ force: false });
    app.listen(PORT, () => console.log(`App listening on port ${PORT}.`));
  } catch (error) {
    console.log("error starting server");
  }
};

connectDb();
