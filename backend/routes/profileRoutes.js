import express from "express";
import multer from "multer";
import { getProfile, saveProfile, getAllProfiles } from "../controllers/profileController.js";

const router = express.Router();

// 📸 Multer setup for profile pictures
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// ✅ GET all profiles
router.get("/", getAllProfiles);

// ✅ GET profile by userId
router.get("/:id", getProfile);

// ✅ POST save/update profile
router.post(
  "/save",
  upload.single("profilePicture"),
  (req, res, next) => {
    if (Array.isArray(req.body.userId)) {
      req.body.userId = req.body.userId[0];
    }
    next();
  },
  saveProfile
);

export default router;
