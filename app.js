const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const ejsMate = require("ejs-mate");
const flash = require("connect-flash");
const passport = require('passport');
const LocalStrategy = require('passport-local');

const userRoutes = require('./routes/user');

const User = require("./models/user");



// Local database
// mongoose.connect("mongodb://localhost:27017/project", {
//   useNewUrlParser: true,
//   useCreateIndex: true,
//   useUnifiedTopology: true,
// });

// Cloud database
mongoose.connect("mongodb+srv://alexkou:webproject@cluster0.yt9j6.mongodb.net/project?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});


const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

const sessionConfig = {
  secret: "badsecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});


app.get("/", (req, res) => {
  res.render("login");
});

app.post("/login", passport.authenticate('local', {failureFlash: true, failureRedirect: '/'}), (req, res) => {

  if(req.user.usertype === 'user') {
    req.flash('success', `Welcome back, ${req.user.username}!`)
    return res.redirect("/user");
  }
  res.send("ADMIN")

});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  const { mail, username, password } = req.body;
  const user = new User({ mail, username });
  const registerUser = await User.register(user, password);
  req.login(registerUser, err => {
    if(err) return next();
    req.flash('success', 'Successfully create the user!')
    res.redirect("/user");
  })
});

app.get('/logout', (req,res) => {
  req.logout();
  req.flash('success', "Logout successfully!");
  res.redirect('/')
})

app.use('/user', userRoutes);

app.listen(3000, () => {
  console.log("Listening to port 3000");
});
