import { Request } from "express";
import { fileUploader } from "../../helper/fileUploader";
import { prisma } from "../../shared/prisma";
import { Specialties } from "@prisma/client";

const insertIntoDB = async (req: Request) => {
  try {
    const file = req.file;

    if (file) {
      const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
      if (!uploadToCloudinary?.secure_url) {
        throw new Error("Failed to upload icon to Cloudinary");
      }
      req.body.icon = uploadToCloudinary?.secure_url;
    }

    const result = await prisma.specialties.create({
      data: {
        title: req.body.title,
        icon: req.body.icon || "",
      },
    });

    return result;
  } catch (error: any) {
    console.error("Error creating specialty:", error);
    throw new Error(error.message || "Failed to create specialty");
  }
};

const getAllFromDB = async (): Promise<Specialties[]> => {
  try {
    return await prisma.specialties.findMany({
      orderBy: { title: "asc" },
    });
  } catch (error: any) {
    throw new Error("Failed to fetch specialties");
  }
};

const deleteFromDB = async (id: string): Promise<Specialties> => {
  try {
    const existing = await prisma.specialties.findUnique({ where: { id } });
    if (!existing) {
      throw new Error("Specialty not found");
    }

    return await prisma.specialties.delete({ where: { id } });
  } catch (error: any) {
    throw new Error(error.message || "Failed to delete specialty");
  }
};

export const SpecialtiesService = {
  insertIntoDB,
  getAllFromDB,
  deleteFromDB,
};
