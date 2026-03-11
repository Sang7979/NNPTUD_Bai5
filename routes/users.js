const express = require("express");
const router = express.Router();
const User = require("../schemas/users");


// GET all users (search username contains)
router.get("/", async (req, res) => {
  try {
    const { username } = req.query;

    let filter = { isDeleted: false };

    if (username) {
      filter.username = { $regex: username, $options: "i" };
    }

    const users = await User.find(filter)
      .populate("role", "name description")
      .select("-password");

    res.status(200).json(users);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// GET user by ID
router.get("/:id", async (req, res) => {
  try {

    const user = await User.findOne({
      _id: req.params.id,
      isDeleted: false
    })
      .populate("role", "name description")
      .select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// CREATE user
router.post("/", async (req, res) => {
  try {

    const user = new User({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      fullName: req.body.fullName || "",
      avatarUrl: req.body.avatarUrl,
      role: req.body.role,
      status: req.body.status ?? false,
      loginCount: req.body.loginCount ?? 0
    });

    const savedUser = await user.save();

    const result = await savedUser.populate("role", "name description");

    res.status(201).json(result);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// UPDATE user
router.put("/:id", async (req, res) => {
  try {

    const updatedUser = await User.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      req.body,
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// SOFT DELETE user
router.delete("/:id", async (req, res) => {
  try {

    const user = await User.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User deleted successfully",
      user
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ENABLE user
router.post("/enable", async (req, res) => {
  try {

    const { email, username } = req.body;

    if (!email || !username) {
      return res.status(400).json({
        message: "Email and username are required"
      });
    }

    const user = await User.findOneAndUpdate(
      { email, username, isDeleted: false },
      { status: true },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json({
      message: "User enabled successfully",
      user
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// DISABLE user
router.post("/disable", async (req, res) => {
  try {

    const { email, username } = req.body;

    if (!email || !username) {
      return res.status(400).json({
        message: "Email and username are required"
      });
    }

    const user = await User.findOneAndUpdate(
      { email, username, isDeleted: false },
      { status: false },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json({
      message: "User disabled successfully",
      user
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;