import express from "express";
import { AdminController } from "./admin.controller";
const router = express.Router();

router.get("/", AdminController.getAllFromDB);

router.patch("/:id", AdminController.updateIntoDB);
export const AdminRoutes = router;
