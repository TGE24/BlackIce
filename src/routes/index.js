import express from "express";
const router = express.Router();
import userController from "../controllers/userController";

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index");
});

router.get(
  "/admin",
  userController.allowIfLoggedin,
  userController.grantAccess("readAny", "profile"),
  (req, res, next) => {
    res.render("admin", { user: res.locals.loggedInUser });
  }
);

// Sign Up Page
router.get("/signup", function(req, res, next) {
  res.render("signup");
});

// router.post("/signup", userController.signup);

router.post("/", userController.login, (req, res) => {
  if (req.session.user.role === "user") {
    res.redirect("/user");
  } else if (req.session.user.role === "district-supervisor") {
    res.redirect("/supervisor");
  } else if (req.session.user.role === "admin") {
    res.redirect("/admin");
  }
});

// router.get(
//   "/user/:userId",
//   userController.allowIfLoggedin,
//   userController.getUser
// );

// router.get(
//   "/users",
//   userController.allowIfLoggedin,
//   userController.grantAccess("readAny", "profile"),
//   userController.getUsers
// );

// router.put(
//   "/user/:userId",
//   userController.allowIfLoggedin,
//   userController.grantAccess("updateAny", "profile"),
//   userController.updateUser
// );

// router.delete(
//   "/user/:userId",
//   userController.allowIfLoggedin,
//   userController.grantAccess("deleteAny", "profile"),
//   userController.deleteUser
// );

module.exports = router;
