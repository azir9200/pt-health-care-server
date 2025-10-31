import { UserStatus } from "@prisma/client";
import { prisma } from "../../shared/prisma";

const login = async (payload: { email: string; password: string }) => {
  console.log("auth service", payload);

const user = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: UserStatus.ACTIVE
        }
    })

};

export const AuthService = {
  login,
};
