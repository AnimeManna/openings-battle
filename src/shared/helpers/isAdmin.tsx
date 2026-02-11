import { roles } from "@/entities/auth/const";
import type { Role } from "@/entities/auth/types";

export const isAdmin = (userRole: Role): boolean => userRole === roles.admin;
