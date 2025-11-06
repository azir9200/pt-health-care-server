import express from "express";
import { DoctorController } from "./doctor.controller";
const router = express.Router();

router.get("/", DoctorController.getAllFromDB);

router.patch("/:id", DoctorController.updateIntoDB);
router.get("/:id", DoctorController.getByIdFromDB);

router.post("/suggestion", DoctorController.getAISuggestions);

export const DoctorRoutes = router;
