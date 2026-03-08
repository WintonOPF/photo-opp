import express from "express";
import { downloadPhoto, uploadPhoto } from "../controllers/photoController.js";

const router = express.Router();

router.post("/", uploadPhoto);
router.get("/", listPhotos);
router.get("/:id/download", downloadPhoto);

export default router;
