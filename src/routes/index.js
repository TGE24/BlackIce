import express from "express";
const router = express.Router();
import userController from "../controllers/userController";
import reportsController from "../controllers/report";
import State from "../helpers/states_and_lgas";

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index");
});

router.get(
  "/admin",
  userController.allowIfLoggedin,
  userController.grantAccess("readAny", "profile"),
  (req, res, next) => {
    res.render("adminDash", { user: res.locals.loggedInUser });
  }
);

router.get(
  "/add-supervisor",
  userController.allowIfLoggedin,
  userController.grantAccess("readAny", "profile"),
  (req, res, next) => {
    res.render("add-supervisor", {
      user: res.locals.loggedInUser,
      districts: State.state.state.locals
    });
  }
);

router.get(
  "/supervisors",
  userController.allowIfLoggedin,
  userController.getSupervisors,
  userController.grantAccess("readAny", "profile"),
  (req, res, next) => {
    res.render("supervisors", {
      user: res.locals.loggedInUser,
      supervisors: res.locals.supervisors
    });
  }
);

router.get(
  "/user",
  userController.allowIfLoggedin,
  (req, res, next) => {
    res.render("user", {
      user: res.locals.loggedInUser,
      districts: State.state.state.locals
    });
  }
);

// Sign Up Page
router.get("/signup", function(req, res, next) {
  res.render("signup");
});

router.post("/signup", userController.signup, (req, res) => {
  res.redirect("/");
});

router.post(
  "/postReport",
  reportsController.postReport,
  (req, res) => {
    res.redirect("/user");
  }
);

router.post(
  "/addSupervisor",
  userController.addSupervisor,
  (req, res) => {
    res.redirect("/supervisors");
  }
);

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
