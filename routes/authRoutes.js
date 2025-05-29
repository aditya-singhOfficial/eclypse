import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import {validateLogin, validateRegistration} from "../middlewares/validation.js";
import jwt from "jsonwebtoken";
import {authenticateToken} from "../middlewares/auth.js";

const router = express.Router();

// Index Route
router.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to the Authentication API",
        version: "1.0.0",
        documentation: "https://example.com/docs"
    });
});

// User Registration
router.post("/register", validateRegistration, async (req, res) => {
    try {
        const {username, email, password} = req.body;
        // Check if user already exists
        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res.status(400).json({error: "User already exists", success: false});
        }
        // Create new user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            name: username,
            email,
            password: hashedPassword,
        });

        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            },
            success: true
        });

    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({error: "Registration failed"});
    }
});

// User Login

router.post("/login", validateLogin, async (req, res) => {
    try {
        const {email, password} = req.body;
        // Find the user by email
        const user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({error: "Invalid email or password", success: false});
        }
        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({error: "Invalid email or password", success: false});
        }
        // Generate JWT token
        const token = jwt.sign({id: user._id, role: user.role}, process.env.JWT_SECRET, {expiresIn: "1h"});
        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            success: true
        });


    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({error: "Login failed"});
    }
});

// User Logout
router.post("/logout", (req, res) => {
    // Invalidate the token on the client side
    res.status(200).json({message: "Logout successful", success: true});
});

router.get("/profile", authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({error: "User not found", success: false});
        }
        return res.status(200).json({user, success: true});
    } catch (error) {
        console.error("Profile retrieval error:", error);
        res.status(500).json({error: "Failed to retrieve profile", success: false});
    }
});

// Update User Profile
router.put("/profile", authenticateToken, async (req, res) => {
    try {
        const {name, email} = req.body;
        const user = await User.findByIdAndUpdate(req.user.id, {name, email}, {new: true}).select("-password");
        if (!user) {
            return res.status(404).json({error: "User not found", success: false});
        }
        return res.status(200).json({user, message: "Profile updated successfully", success: true});
    } catch (error) {
        console.error("Profile update error:", error);
        res.status(500).json({error: "Failed to update profile", success: false});
    }
});


// Delete User Account

router.delete("/profile", authenticateToken, async (req, res) => {
        try {
            const user = await User.findByIdAndDelete(req.user.id);
            if (!user) {
                return res.status(404).json({error: "User not found", success: false});
            }
            return res.status(200).json({message: "Account deleted successfully", success: true});
        } catch (error) {
            console.error("Account deletion error:", error);
            res.status(500).json({error: "Failed to delete account", success: false});
        }
    }
);

export default router;