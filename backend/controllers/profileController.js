import Profile from "../models/Profile.js";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";

// 📌 GET profile by userId
export const getProfile = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const profile = await Profile.findOne({ userId: id });
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: "Server error: " + err.message });
  }
};

// 📌 GET all profiles (for admin panel)
export const getAllProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find().populate("userId", "name email");
    res.status(200).json(profiles);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch profiles", error: err.message });
  }
};

// 📌 SAVE or UPDATE profile
export const saveProfile = async (req, res) => {
  try {
    let { userId, name, email, phone, address, country, state, district, extraInfo } = req.body;

    if (!userId || !name || !email) {
      return res.status(400).json({ message: "UserId, Name, and Email are required" });
    }

    if (Array.isArray(userId)) userId = userId[0];

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const profileData = { userId, name, email, phone, address, country, state, district, extraInfo };

    // 📸 Handle profile picture upload
    if (req.file) {
      profileData.profilePicture = `uploads/${req.file.filename}`;
    }

    // Check if profile exists
    let profile = await Profile.findOne({ userId });

    if (profile) {
      // Delete old profile picture if a new one is uploaded
      if (req.file && profile.profilePicture) {
        const oldPath = path.join(process.cwd(), profile.profilePicture);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      // Update profile
      profile = await Profile.findOneAndUpdate({ userId }, profileData, { new: true });
      return res.json(profile);
    }

    // Create new profile
    profile = new Profile(profileData);
    await profile.save();
    res.json(profile);

  } catch (err) {
    console.error("Profile save error:", err);
    res.status(500).json({ message: "Server error while saving profile" });
  }
};
