import express from "express";
import {
  deletePhoto,
  downloadPhoto,
  uploadPhoto,
  listPhotos,
} from "../controllers/photoController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, roleMiddleware(["ADMIN", "PROMOTER"]), uploadPhoto);
router.get("/", authMiddleware, roleMiddleware(["ADMIN"]), listPhotos);
router.delete("/:id", authMiddleware, roleMiddleware(["ADMIN"]), deletePhoto);
router.get("/:id/download", downloadPhoto);

export default router;
