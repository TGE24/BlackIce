import express from "express";
const router = express.Router();
import userController from "../controllers/userController";
import Report from "../models/reports";
import State from "../helpers/states_and_lgas";
// import multer from "multer";
// import cloudinary from "cloudinary";
// import cloudinaryStorage from "multer-storage-cloudinary";

// cloudinary.config({
//   cloud_name: "tech-18",
//   api_key: "856292739299675",
//   api_secret: "8Qcrg5W7BuUizWQ5VYUGmra489g"
// });
// const storage = cloudinaryStorage({
//   cloudinary: cloudinary,
//   folder: "admanagement",
//   allowedFormats: ["jpg", "png"],
//   transformation: [{ width: 350, height: 282, crop: "limit" }]
// });
// const parser = multer({ storage: storage });

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index");
});

router.get(
  "/admin/add-supervisor",
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
  "/supervisor/add-user",
  userController.allowIfLoggedin,
  userController.grantAccess("readAny", "profile"),
  (req, res, next) => {
    res.render("add-user", {
      user: res.locals.loggedInUser,
      districts: State.state.state.locals
    });
  }
);

router.get(
  "/supervisor/users",
  userController.allowIfLoggedin,
  userController.getDistrictUsers,
  userController.grantAccess("readAny", "profile"),
  (req, res, next) => {
    res.render("supervisor", {
      user: res.locals.loggedInUser,
      users: res.locals.districtUsers
    });
  }
);

router.get(
  "/supervisor/reports",
  userController.allowIfLoggedin,
  userController.getDistrictReports,
  userController.grantAccess("readAny", "profile"),
  (req, res, next) => {
    res.render("districtReport", {
      user: res.locals.loggedInUser,
      reports: res.locals.districtReports
    });
  }
);

router.get(
  "/user/reports",
  userController.allowIfLoggedin,
  userController.getUserReports,
  (req, res, next) => {
    res.render("reports", {
      user: res.locals.loggedInUser,
      reports: res.locals.userReports
    });
  }
);

router.get(
  "/admin/reports",
  userController.allowIfLoggedin,
  userController.getReports,
  (req, res, next) => {
    res.render("adminReports", {
      user: res.locals.loggedInUser,
      reports: res.locals.reports
    });
  }
);

router.get(
  "/admin/supervisors",
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

router.get(
  "/admin",
  userController.allowIfLoggedin,
  userController.getSupervisors,
  userController.getUsers,
  (req, res, next) => {
    res.render("adminStats", {
      user: res.locals.loggedInUser,
      users: res.locals.users,
      supervisors: res.locals.supervisors
    });
  }
);

// Sign Up Page
router.get("/signup", function(req, res, next) {
  res.render("signup", { districts: State.state.state.locals });
});

router.post("/signup", userController.signup, (req, res) => {
  res.redirect("/supervisor/users");
});

router.post("/registerUser", userController.register, (req, res) => {
  res.redirect("/");
});

router.post("/postReport", (req, res) => {
  const {
    injName,
    injAddress,
    injPhone,
    injDob,
    injGender,
    injDetails,
    injProffession,
    injType,
    hospital,
    hosName,
    hosAddress,
    hosPhone
  } = req.body;
  const newReport = new Report({
    injName,
    injAddress,
    injPhone,
    injDob,
    injGender,
    injDetails,
    injProffession,
    injType,
    hospital,
    hosName,
    hosAddress,
    hosPhone,
    district: res.locals.loggedInUser.district,
    userId: req.session.user._id
  });
  newReport.save(err => {
    if (err) throw err;
    return newReport;
  });
  res.redirect("/user/reports");
});

router.post(
  "/addSupervisor",
  userController.addSupervisor,
  (req, res) => {
    res.redirect("/admin/supervisors");
  }
);

router.post("/addUser", userController.signup, (req, res) => {
  res.redirect("/supervisor/users");
});

router.post("/", userController.login, (req, res) => {
  if (req.session.user.role === "user") {
    res.redirect("/user");
  } else if (req.session.user.role === "district-supervisor") {
    res.redirect("/supervisor/add-user");
  } else if (req.session.user.role === "admin") {
    res.redirect("/admin");
  }
});

router.get("/logout", userController.logout, (req, res) => {
  res.redirect("/");
});

router.get(
  "/deleteUser/:userId",
  userController.deleteUser,
  (req, res) => {
    res.redirect("/admin/supervisors");
  }
);

router.get(
  "/deleteUsers/:userId",
  userController.deleteUser,
  (req, res) => {
    res.redirect("/supervisor/users");
  }
);

router.post(
  "/approve/:id",
  userController.approveReport,
  (req, res) => {
    res.redirect("/supervisor/reports");
  }
);

router.post(
  "/unapprove/:id",
  userController.unApproveReport,
  (req, res) => {
    res.redirect("/supervisor/reports");
  }
);

module.exports = router;
