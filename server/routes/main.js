const express = require("express");
const Professor = require("../models/Professor");
const User = require("../models/User");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

//Password protect
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

router.get("/admin", authMiddleWare, async (req, res) => {
  try {
    res.render("admin", { title: "Admin" });
  } catch (err) {
    console.log(err);
  }
});

router.get("/", checkAuth, (req, res) => {
  res.render("index", {
    title: "RMPL",
    isAuthenticated: req.isAuthenticated,
    username: req.username,
  });
});

router.post("/search", checkAuth, async (req, res) => {
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
});

router.get("/about", checkAuth, (req, res) => {
  res.render("about", {
    title: "About",
    isAuthenticated: req.isAuthenticated,
    username: req.username,
  });
});

router.get("/list", checkAuth, (req, res) => {
  res.render("list", {
    title: "Add new instructor",
    isAuthenticated: req.isAuthenticated,
    username: req.username,
  });
});

router.get("/login", checkAuth, (req, res) => {
  res.render("logIn", {
    title: "login",
    failedToLog: false,
    isAuthenticated: req.isAuthenticated,
    username: req.username,
  });
});

//Login adds cookie 'token'
router.post("/authenticate", checkAuth, async (req, res) => {
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

    const token = jwt.sign({ userId: user._id }, jwtSecret);
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
});

router.post("/createAccount", checkAuth, async (req, res) => {
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
});

router.get("/logout", checkAuth, (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

router.post("/newInstructor", checkAuth, (req, res) => {
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
});

router.get("/search/:id", checkAuth, (req, res) => {
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
});

router.get("/rate/:id", checkAuth, (req, res) => {
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
});

router.post("/addSubject", checkAuth, (req, res) => {
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
});

router.post('/addReview', checkAuth, (req,res) => {
  console.log(req.body);

  const profId = req.body.profId;
  const commentor = req.username;
  const subject = req.body.subject;
  const content = req.body.comments;
  const overall = (parseFloat(req.body.quality) + parseFloat(req.body.difficulty) + parseFloat(req.body.workload))/3;
  const comment = {

    author: commentor,
    subject: subject,
    content: content,
    
  }
  Professor.findByIdAndUpdate(profId,
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
    { new: true }) //this will return the updated object
  .then((result) => {
    res.redirect(`/search/${profId}`);
  })
  .catch((err) => {
    console.log(err);
  });
  
});

module.exports = router;
