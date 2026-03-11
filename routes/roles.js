const express = require("express");
const router = express.Router();

const Role = require("../schemas/roles");
const User = require("../schemas/users");


// GET all roles
router.get("/", async (req, res) => {
  try {

    const roles = await Role.find({ isDeleted: false });

    res.status(200).json(roles);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// GET role by ID
router.get("/:id", async (req, res) => {
  try {

    const role = await Role.findOne({
      _id: req.params.id,
      isDeleted: false
    });

    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    res.status(200).json(role);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// CREATE role
router.post("/", async (req, res) => {
  try {

    const role = new Role({
      name: req.body.name,
      description: req.body.description || ""
    });

    const savedRole = await role.save();

    res.status(201).json(savedRole);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// UPDATE role
router.put("/:id", async (req, res) => {
  try {

    const updatedRole = await Role.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedRole) {
      return res.status(404).json({ message: "Role not found" });
    }

    res.status(200).json(updatedRole);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// SOFT DELETE role
router.delete("/:id", async (req, res) => {
  try {

    const role = await Role.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );

    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    res.json({
      message: "Role deleted successfully",
      role
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// GET users by role ID
router.get("/:id/users", async (req, res) => {
  try {

    const users = await User.find({
      role: req.params.id,
      isDeleted: false
    })
      .populate("role", "name description")
      .select("-password");

    res.status(200).json(users);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;