import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { IJWTPayload } from "../../types/common";
import pick from "../../helper/pick";
import sendResponse from "../../shared/sendResponse";
import { patientFilterableFields } from "./patient.constant";
import { patientService } from "./patient.service";
import httpStatus from "http-status";

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  const filters = pick(req.query, patientFilterableFields);

  const result = await patientService.getAllFromDB(filters, options);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Patient fetched successfully!",
    meta: result.meta,
    data: result.data,
  });
});

const updateIntoDB = catchAsync(
  async (req: Request & { user?: IJWTPayload }, res: Response) => {
    const user = req.user;
    const result = await patientService.updateIntoDB(
      user as IJWTPayload,
      req.body
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Patient updated successfully",
      data: result,
    });
  }
);

export const PatientController = {
  getAllFromDB,
  updateIntoDB,
};
