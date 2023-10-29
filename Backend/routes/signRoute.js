import jwt from "jsonwebtoken";
import express from "express";
import { User } from "../models/userModel.js";
import passport from "passport";
import bcrypt from "bcrypt";

const router = express.Router();

const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, "Ac-key", {
    expiresIn: "1d",
  });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, "Rf-key", {
    expiresIn: "7d",
  });
};

router.post("/signup", async (request, response) => {
  try {
    const { email, password, ...otherFields } = request.body;

    if (!email || !password) {
      return response
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return response.status(400).json({ message: "Email is already in use." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      ...otherFields,
    });
    await newUser.save();

    const accessToken = generateAccessToken(newUser._id);
    const refreshToken = generateRefreshToken(newUser._id);

    response.status(201).json({
      message: "User registered successfully.",
      accessToken,
      refreshToken,
    });

    return response.redirect("/");
  } catch (error) {
    console.error(error.message);
    response.status(500).json({ message: "Error registering user." });
  }
});

router.post("/signin", (request, response, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error(err);
      return response.status(500).json({ message: "Authentication error." });
    }
    if (!user) {
      return response
        .status(401)
        .json({ message: "Invalid email or password." });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    response.status(200).json({
      message: "Sign-in successful.",
      accessToken,
      refreshToken,
    });

    return response.redirect("/");
  })(request, response, next);
});

router.get("/logout", (request, response) => {
  return response.status(200).json({ message: "Logged out successfully." });
});

export default router;
