import express from "express";
import { ScheduleController } from "./schedule.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.get("/", auth(UserRole.ADMIN), ScheduleController.schedulesForDoctor);

router.post("/", auth(UserRole.ADMIN), ScheduleController.insertIntoDB);

router.delete(
  "/:id",

  ScheduleController.deleteScheduleFromDB
);
export const ScheduleRoutes = router;
