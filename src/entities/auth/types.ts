import type { roles } from "./const";

export type Role = keyof typeof roles;

export interface User {
  id: string;
  displayName: string;
  pin: string;
  role: Role;
  protectionBudget: number;
  protectionUsed: number;
}
