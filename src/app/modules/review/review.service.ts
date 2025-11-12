import { prisma } from "../../shared/prisma";
import { IJWTPayload } from "../../types/common";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";

const insertIntoDB = async (user: IJWTPayload, payload: any) => {
  console.log("payload", payload);
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  const appointmentData = await prisma.appointment.findUniqueOrThrow({
    where: {
      id: payload.appointmentId,
    },
    
  });
  if (patientData.id !== appointmentData.patientId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "This is not your appointment!");
  }
  return await prisma.$transaction(async (tnx) => {
    const result = await tnx.review.create({
      data: {
        appointmentId: appointmentData.id,
        doctorId: appointmentData.doctorId,
        patientId: appointmentData.patientId,
        rating: payload.rating,
        comment: payload.comment,
      },
    });
    console.log("review data", result);
    const avgRating = await tnx.review.aggregate({
      _avg: {
        rating: true,
      },
      where: {
        doctorId: appointmentData.doctorId,
      },
    });
    await tnx.doctor.update({
      where: {
        id: appointmentData.doctorId,
      },
      data: {
        averageRating: avgRating._avg.rating as number,
      },
    });
    return result;
  });
};
export const ReviewService = {
  insertIntoDB,
  // getAllFromDB
};
