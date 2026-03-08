import bcrypt from "bcrypt";
import { createUser, findUserByEmail, updateUser } from "./userService.js";

const DEFAULT_ADMIN = {
  name: "admin",
  email: "admin@photoopp.local",
  password: "admin",
  role: "ADMIN",
};

export async function ensureDefaultAdminUser() {
  const passwordHash = await bcrypt.hash(DEFAULT_ADMIN.password, 10);
  const existingUser = await findUserByEmail(DEFAULT_ADMIN.email);

  if (!existingUser) {
    await createUser({
      name: DEFAULT_ADMIN.name,
      email: DEFAULT_ADMIN.email,
      passwordHash,
      role: DEFAULT_ADMIN.role,
    });
    return;
  }

  await updateUser(existingUser.id, {
    name: DEFAULT_ADMIN.name,
    passwordHash,
    role: DEFAULT_ADMIN.role,
  });
}
