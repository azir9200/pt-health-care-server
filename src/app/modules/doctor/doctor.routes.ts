import express from "express";
import { DoctorController } from "./doctor.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
const router = express.Router();

router.get("/", auth(UserRole.ADMIN), DoctorController.getAllFromDB);

router.patch("/:id", DoctorController.updateIntoDB);
router.get("/:id", DoctorController.getByIdFromDB);

router.post("/suggestion", DoctorController.getAISuggestions);

export const DoctorRoutes = router;
