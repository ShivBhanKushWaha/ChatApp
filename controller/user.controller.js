import generateWebToken from "../jwt/generateToken.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt"; // Import bcrypt for password hashing

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the user already exists
    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the new user with the hashed password
    const newUser = new User({
      name,
      email,
      password: hashedPassword, // Save the hashed password
    });

    await newUser.save();

    if (newUser) {
      generateWebToken(newUser._id, res);
      res.status(201).json({
        message: "User registered successfully",
        user: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
        },
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user already exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Invalid user " });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(404).json({ message: "Invalid password" });
    }

    generateWebToken(user._id, res);
    res.status(200).json({
      message: "user login successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const loggedInUser = req.user._id;
    console.log( " Loggedin user id"+ loggedInUser)
    const filterAllUser = await User.find({ _id: { $ne: loggedInUser } }).select(
      "-password"
    );
    res.status(201).json({ filterAllUser });
  } catch (err) {
    console.log(err, "server error");
    res.status(500).json({ messge: "Server error" });
  }
};
