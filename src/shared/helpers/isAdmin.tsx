import { roles } from "@/entities/auth/model/const";
import type { Role } from "@/entities/auth/model/types";

export const isAdmin = (userRole: Role): boolean => userRole === roles.admin;
