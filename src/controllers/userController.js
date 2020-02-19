import User from "../models/userModel";
import Report from "../models/reports";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { roles } from "../helpers/roles";

async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

async function validatePassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

exports.signup = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;
    const hashedPassword = await hashPassword(password);
    const newUser = new User({
      name: firstName + " " + lastName,
      email,
      district: res.locals.loggedInUser.district,
      password: hashedPassword,
      role: role || "user"
    });
    await newUser.save();
    res.status(200);
    next();
  } catch (error) {
    next(error);
  }
};

exports.register = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      district
    } = req.body;
    const hashedPassword = await hashPassword(password);
    const newUser = new User({
      name: firstName + " " + lastName,
      email,
      district: district,
      password: hashedPassword,
      role: "user"
    });
    await newUser.save();
    res.status(200);
    next();
  } catch (error) {
    next(error);
  }
};

exports.addSupervisor = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      district,
      email,
      password
    } = req.body;
    const hashedPassword = await hashPassword(password);
    const newUser = new User({
      name: firstName + " " + lastName,
      email,
      district,
      password: hashedPassword,
      role: "district-supervisor"
    });
    await newUser.save();
    res.status(200);
    next();
  } catch (error) {
    next(error);
  }
};

exports.getSupervisors = async (req, res, next) => {
  try {
    const role = { role: "district-supervisor" };
    const users = await User.find(role);
    if (!users) return next(new Error("No supervisor found"));
    res.locals.supervisors = users;
    res.status(200);
    next();
  } catch (error) {
    next(error);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const role = { role: "user" };
    const users = await User.find(role);
    if (!users) return next(new Error("No supervisor found"));
    res.locals.users = users;
    res.status(200);
    next();
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return next(new Error("Email does not exist"));
    const validPassword = await validatePassword(
      password,
      user.password
    );
    if (!validPassword)
      return next(new Error("Password is not correct"));
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d"
      }
    );
    await User.findByIdAndUpdate(user._id, { accessToken });
    req.session.token = accessToken;
    req.session.user = user;
    res.status(200);
    next();
  } catch (error) {
    next(error);
  }
};

exports.getUserReports = async (req, res, next) => {
  try {
    const userId = { userId: res.locals.loggedInUser.id };
    const reports = await Report.find(userId);
    if (!reports) return next(new Error("No report submitted"));
    res.locals.userReports = reports;
    res.status(200);
    next();
  } catch (error) {
    next(error);
  }
};

exports.getReports = async (req, res, next) => {
  try {
    const approved = { approved: true };
    const reports = await Report.find(approved);
    if (!reports) return next(new Error("No report submitted"));
    res.locals.reports = reports;
    res.status(200);
    next();
  } catch (error) {
    next(error);
  }
};

exports.getDistrictReports = async (req, res, next) => {
  try {
    const userId = { district: res.locals.loggedInUser.district };
    const reports = await Report.find(userId);
    if (!reports) return next(new Error("No report submitted"));
    res.locals.districtReports = reports;
    res.status(200);
    next();
  } catch (error) {
    next(error);
  }
};

exports.getDistrictUsers = async (req, res, next) => {
  try {
    const userId = {
      district: res.locals.loggedInUser.district,
      role: "user"
    };
    const users = await User.find(userId);
    if (!users) return next(new Error("No report submitted"));
    res.locals.districtUsers = users;
    res.status(200);
    next();
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    await User.findByIdAndDelete(userId);
    res.status(200);
    next();
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  try {
    delete res.locals.loggedInUser;
    res.status(200);
    next();
  } catch (error) {
    next(error);
  }
};

exports.approveReport = async (req, res, next) => {
  try {
    const id = { _id: req.params.id };
    const update = {
      approved: true
    };
    await Report.findOneAndUpdate(id, update);
    res.status(200);
    next();
  } catch (error) {
    next(error);
  }
};

exports.unApproveReport = async (req, res, next) => {
  try {
    const id = { _id: req.params.id };
    const update = {
      approved: false
    };
    await Report.findOneAndUpdate(id, update);
    res.status(200);
    next();
  } catch (error) {
    next(error);
  }
};

exports.grantAccess = function(action, resource) {
  return async (req, res, next) => {
    try {
      const permission = roles.can(req.user.role)[action](resource);
      if (!permission.granted) {
        return res.status(401).json({
          error:
            "You don't have enough permission to perform this action"
        });
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

exports.allowIfLoggedin = async (req, res, next) => {
  try {
    const user = res.locals.loggedInUser;
    if (!user) res.redirect("/");
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
