const express = require("express");
const Professor = require("../models/Professor");
const User = require("../models/User");
const router = express.Router();

router.get("", (req, res) => {
  res.render("index", { title: "RMPL" });
});

router.post("/search", async (req, res) => {
  try {
    let searchTerm = req.body.searchTerm;
    //Regex to remove special characters
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z ]/g, "");
    //Find professor by name
    const data = await Professor.find({
      $or: [{ name: { $regex: new RegExp(searchNoSpecialChar, "i") } }],
    });
    console.log(data);
    res.render("search", { title: "Search", data });
  } catch (err) {
    console.log(err);
  }
});

router.get("/about", (req, res) => {
  res.render("about", { title: "About" });
});

router.get("/list", (req, res) => {
  res.render("list", { title: "Add new instructor" });
});

router.get("/login", (req, res) => {
  res.render("logIn", { failedToLog: false });
});

router.post("/authenticate", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  try {
    User.findOne({
      $or: [{ username: username }],
    })
    .then((result) =>{
    
        if(result.password == password){
            res.render("index", {title:'RMPL'});
            console.log('successfully logged In');
        }

    })
    .catch((err) =>{
        res.render('logIn', {failedToLog:true});
    });

  } catch (err) {
    console.log(err);
  }
});

router.post("/createAccount", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  User.insertMany([
    {
      username: username,
      password: password,
    },
  ]);
});

router.post("/newInstructor", (req, res) => {
  const instructorInfo = req.body;
  console.log("received data", instructorInfo);
  Professor.insertMany([
    {
      name: instructorInfo.name,
      department: instructorInfo.department,
      ratings: instructorInfo.ratings,
      overall: instructorInfo.overall,
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

router.get("/search/:id", (req, res) => {
  const id = req.params.id;
  Professor.findById(id)
    .then((result) => {
      res.render("instructor", { title: result.name, result });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
