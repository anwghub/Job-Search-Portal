import express from "express";
import { getUserProfile } from "../controllers/userController.js";
import User from "../models/UserModel.js";

const router = express.Router();

router.get("/check-auth", async (req, res) => {
  if (req.oidc.isAuthenticated()) {
    const authUser = req.oidc.user;

    try {
      // Check if user already exists in DB
      let user = await User.findOne({ auth0Id: authUser.sub });

      // If user doesn't exist, create one
      if (!user) {
        user = await User.create({
          auth0Id: authUser.sub,
          email: authUser.email,
          name: authUser.name || authUser.nickname || "Unnamed",
          profilePicture: authUser.picture || "",
        });
        console.log("✅ New user saved to DB:", user.email);
      }

      return res.status(200).json({
        isAuthenticated: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          auth0Id: user.auth0Id,
          profilePicture: user.profilePicture,
        },
      });
    } catch (error) {
      console.error("Error in /check-auth:", error.message);
      return res.status(500).json({ message: "Server Error" });
    }
  } else {
    return res.status(200).json({ isAuthenticated: false });
  }
});

router.get("/user/:id", getUserProfile);

export default router;