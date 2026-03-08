import { prisma } from "../lib/prisma.js";

export function findUserByEmail(email) {
  return prisma.user.findUnique({
    where: { email },
  });
}

export function findUserById(id) {
  return prisma.user.findUnique({
    where: { id },
  });
}

export function createUser(data) {
  return prisma.user.create({
    data,
  });
}

export function updateUser(id, data) {
  return prisma.user.update({
    where: { id },
    data,
  });
}

export function findUserByResetToken(token) {
  return prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiry: {
        gt: new Date(),
      },
    },
  });
}
