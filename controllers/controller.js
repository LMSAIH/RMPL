const Professor = require("../server/models/Professor");
const User = require("../server/models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

const admin = async (req, res) => {
  try {
    res.render("admin", { title: "Admin" });
  } catch (err) {
    console.log(err);
  }
};

const authMiddleWare = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unathorized" });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ message: "Unathorized" });
  }
};

const checkAuth = async (req, res, next) => {

  const token = req.cookies.token;

  if (!token) {
    req.isAuthenticated = false;
    //Nexsts are important lmao
    next();
  } else {
    try {
      const decoded = jwt.verify(token, jwtSecret);
      req.isAuthenticated = true;
      req.userId = decoded.userId;
      console.log(decoded);
      const user = await User.findById(req.userId);

      if (user) {
        req.username = user.username;
      }
      next();
    } catch (err) {
      req.isAuthenticated = false;
      next();
    }
  }
};

const authenticate = async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;

    const user = await User.findOne({ username });

    if (!user) {
      return res.render("logIn", {
        title: "login",
        isValidLogin: false,
        isAuthenticated: req.isAuthenticated,
        username: req.username,
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.render("logIn", {
        title: "login",
        isValidLogin: false,
        isAuthenticated: req.isAuthenticated,
        username: req.username,
      });
    }

    const token = jwt.sign({ userId: user._id }, jwtSecret, {expiresIn: '1d'});
    res.cookie("token", token, { httpOnly: true });

    res.redirect("/");
  } catch (err) {
    res.render("logIn", {
      title: "login",
      isValidLogin: false,
      isAuthenticated: req.isAuthenticated,
      username: req.username,
    });
  }
};

const createAccount = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const hashPassword = await bcrypt.hash(password, 10);

  try {
    const user = await User.create({ username, password: hashPassword });
    res.redirect("/logIn");
  } catch (err) {
    if (err.code === 11000) {
      return res.render("logIn", {
        title: "login",
        isValidSignIn: false,
        alreadyInUse: true,
        isAuthenticated: req.isAuthenticated,
        username: req.username,
      });
    }
    res.render("logIn", {
      title: "login",
      isValidSignIn: false,
      alreadyInUse: false,
      isAuthenticated: req.isAuthenticated,
      username: req.username,
    });
  }
};

const logOut = (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
};

const newInstructor = (req, res) => {
  const instructorInfo = req.body;
  console.log("received data", instructorInfo);
  Professor.insertMany([
    {
      name: instructorInfo.name,
      department: instructorInfo.department,
      ratings: instructorInfo.ratings,
      overall: instructorInfo.overall,
      quality: instructorInfo.quality,
      difficulty: instructorInfo.difficulty,
      workload: instructorInfo.workload,
      subjects: instructorInfo.subjects,
    },
  ])
    .then((result) => {
      console.log("success");
      res.json({ redirect: "/" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "an error ocurred" });
    });
};

const getIndex = (req, res) => {
  res.render("index", {
    title: "RMPL",
    isAuthenticated: req.isAuthenticated,
    username: req.username,
  });
};

const search = async (req, res) => {
  try {
    let searchTerm = req.body.searchTerm;
    //Regex to remove special characters
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z ]/g, "");
    //Find professor by name
    const data = await Professor.find({
      $or: [{ name: { $regex: new RegExp(searchNoSpecialChar, "i") } }],
    });
    console.log(data);
    res.render("search", {
      title: "Search",
      data,
      isAuthenticated: req.isAuthenticated,
      username: req.username,
    });
  } catch (err) {
    console.log(err);
  }
};

const getAbout = (req, res) => {
  res.render("about", {
    title: "About",
    isAuthenticated: req.isAuthenticated,
    username: req.username,
  });
};

const getList = (req, res) => {
  res.render("list", {
    title: "Add new instructor",
    isAuthenticated: req.isAuthenticated,
    username: req.username,
  });
};

const getLogin = (req, res) => {
  res.render("logIn", {
    title: "login",
    failedToLog: false,
    isAuthenticated: req.isAuthenticated,
    username: req.username,
  });
};

const searchProf = (req, res) => {
  const id = req.params.id;
  Professor.findById(id)
    .then((result) => {
      res.render("instructor", {
        title: result.name,
        result,
        isAuthenticated: req.isAuthenticated,
        username: req.username,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

const rateProf = (req, res) => {
  //get the id from the url
  const id = req.params.id;
  Professor.findById(id)
    .then((result) => {
      res.render("rate", {
        title: result.name,
        result,
        isAuthenticated: req.isAuthenticated,
        username: req.username,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

const addSubject = (req, res) => {
  const profId = req.body.profId;
  const subjectToAdd = req.body.subject;

  Professor.findByIdAndUpdate(
    profId,
    { $push: { subjects: subjectToAdd } },
    { new: true, useFindAndModify: false }
  )
    .then((updatedProfessor) => {
      console.log(JSON.stringify(updatedProfessor));
      res.redirect(`/search/${profId}`);
    })
    .catch((err) => {
      console.log(err);
      res.status(500);
    });
};

const addReview = (req, res) => {
  console.log(req.body);

  const profId = req.body.profId;
  const commentor = req.username;
  const subject = req.body.subject;
  const content = req.body.comments;
  const overall = parseFloat(req.body.quality);
  const comment = {
    author: commentor,
    subject: subject,
    content: content,
  };
  Professor.findByIdAndUpdate(
    profId,
    {
      $inc: {
        quality: parseFloat(req.body.quality),
        difficulty: parseFloat(req.body.difficulty),
        workload: parseFloat(req.body.workload),
        ratings: 1,
        overall: overall,
      },

      $push: { comments: comment },
    },
    { new: true }
  ) //this will return the updated object
    .then((result) => {
      res.redirect(`/search/${profId}`);
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = {
  authMiddleWare,
  checkAuth,
  authenticate,
  createAccount,
  logOut,
  newInstructor,
  admin,
  getIndex,
  search,
  getAbout,
  getList,
  getLogin,
  searchProf,
  rateProf,
  addSubject,
  addReview,
};
