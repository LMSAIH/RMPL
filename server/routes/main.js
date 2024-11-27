const express = require("express");
const router = express.Router();
const controllers = require("../../controllers/controller");

//Verification 
const authMiddleWare = controllers.authMiddleWare;
const checkAuth = controllers.checkAuth;
//Password protect

//routes forthe app
router.get("/admin", authMiddleWare, controllers.admin);

router.get("/", checkAuth, controllers.getIndex);

router.post("/search", checkAuth, controllers.search);

router.get("/about", checkAuth, controllers.getAbout);

router.get("/list", checkAuth, controllers.getList);

router.get("/login", checkAuth, controllers.getLogin);

//Login adds cookie 'token'
router.post("/authenticate", checkAuth, controllers.authenticate);

router.post("/createAccount", checkAuth, controllers.createAccount);

router.get("/logout", checkAuth, controllers.logOut);

router.post("/newInstructor", checkAuth, controllers.newInstructor);

router.get("/search/:id", checkAuth, controllers.searchProf);

router.get("/rate/:id", checkAuth, controllers.rateProf);

router.post("/addSubject", checkAuth, controllers.addSubject);

router.post("/addReview", checkAuth, controllers.addReview);

module.exports = router;
