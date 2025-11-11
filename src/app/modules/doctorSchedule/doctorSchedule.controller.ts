import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { DoctorScheduleService } from "./doctorSchedule.service";
import { IJWTPayload } from "../../types/common";

const insertIntoDB = catchAsync(
  async (req: Request & { user?: IJWTPayload }, res: Response) => {
    console.log("doc sche", req.body);
    const user = req.user;
    console.log("doc sche", user);
    const result = await DoctorScheduleService.insertIntoDB(
      user as IJWTPayload,
      req.body
    );

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Doctor schedules created successfully!",
      data: result,
    });
  }
);

const getAllFromDB = catchAsync(
  async (req: Request & { user?: IJWTPayload }, res: Response) => {
    const user = req.user;
    console.log("object doctor", user);
    const result = await DoctorScheduleService.getAllFromDB(user);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Doctor schedules fetched successfully!",
      data: result,
    });
  }
);

export const DoctorScheduleController = {
  insertIntoDB,
  getAllFromDB,
};
