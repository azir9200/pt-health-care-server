import { prisma } from "../../shared/prisma";
import { IJWTPayload } from "../../types/common";
import { CreateDoctorScheduleInput } from "./interface.doctorSchedule";

const insertIntoDB = async (
  user: IJWTPayload,
  payload: CreateDoctorScheduleInput
) => {
  try {
    // Verify doctor account
    const doctor = await prisma.doctor.findUnique({
      where: { email: user.email },
    });

    if (!doctor) {
      throw new Error("Doctor not found for the provided user email");
    }

    // Check if doctor already has any of the given schedules
    const existingSchedules = await prisma.doctorSchedules.findMany({
      where: {
        doctorId: doctor.id,
        scheduleId: { in: payload.scheduleIds },
      },
      select: { scheduleId: true },
    });

    const existingIds = existingSchedules.map((s) => s.scheduleId);
    const newScheduleIds = payload.scheduleIds.filter(
      (id) => !existingIds.includes(id)
    );

    if (newScheduleIds.length === 0) {
      throw new Error("All provided schedules already exist for this doctor");
    }

    // Insert new schedules
    const doctorScheduleData = newScheduleIds.map((scheduleId) => ({
      doctorId: doctor.id,
      scheduleId,
    }));

    const result = await prisma.$transaction(async (tx) => {
      return await tx.doctorSchedules.createMany({
        data: doctorScheduleData,
      });
    });

    return {
      createdCount: result.count,
      skipped: existingIds.length,
      doctorId: doctor.id,
    };
  } catch (error: any) {
    console.error("Error creating doctor schedules:", error);
    throw new Error(error.message || "Failed to create doctor schedules");
  }
};

const getAllFromDB = async (user?: IJWTPayload) => {
  try {
    // If doctor logged in, return only their schedules
    if (user && user.role === "DOCTOR") {
      const doctor = await prisma.doctor.findUnique({
        where: { email: user.email },
      });

      if (!doctor) {
        throw new Error("Doctor not found for the logged-in user");
      }

      return await prisma.doctorSchedules.findMany({
        where: { doctorId: doctor.id },
        include: {
          schedule: true,
          doctor: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    }

    // Admin or others: get all schedules
    return await prisma.doctorSchedules.findMany({
      include: {
        schedule: true,
        doctor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error: any) {
    console.error("Error fetching doctor schedules:", error);
    throw new Error(error.message || "Failed to fetch doctor schedules");
  }
};

export const DoctorScheduleService = {
  insertIntoDB,
  getAllFromDB,
};
