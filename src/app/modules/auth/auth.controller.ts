import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { AuthService } from "./auth.service";

const login = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.login(req.body);
  console.log("object", result);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "User logged-in successfully!",
    data: "",
  });
});

export const AuthController = {
  login,
};
