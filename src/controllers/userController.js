import User from "../models/userModel";
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
      password: hashedPassword,
      role: role || "user"
    });
    const accessToken = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d"
      }
    );
    newUser.accessToken = accessToken;
    await newUser.save();
    req.session.token = accessToken;
    req.session.user = newUser;
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
    const accessToken = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d"
      }
    );
    newUser.accessToken = accessToken;
    await newUser.save();
    req.session.token = accessToken;
    req.session.user = newUser;
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

exports.getUsers = async (req, res, next) => {
  const users = await User.find({});
  res.status(200).json({
    data: users
  });
};

exports.getUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) return next(new Error("User does not exist"));
    res.status(200).json({
      data: user
    });
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const update = req.body;
    const userId = req.params.userId;
    await User.findByIdAndUpdate(userId, update);
    const user = await User.findById(userId);
    res.status(200).json({
      data: user,
      message: "User has been updated"
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    await User.findByIdAndDelete(userId);
    res.status(200).json({
      data: null,
      message: "User has been deleted"
    });
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
