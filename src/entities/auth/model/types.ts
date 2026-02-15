import type { Database } from "@/shared/database.types";

export type Role = Database["public"]["Enums"]["app_role"];

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export interface User {
  id: string;
  displayName: string;
  pin: string;
  role: Role;
  protectionBudget: number;
  protectionUsed: number;
}
