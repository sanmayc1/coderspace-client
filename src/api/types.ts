import type { Role } from "@/types/types";

export interface IFetchRoleData {
  accountId: string;
  profileUrl?: string;
  profileComplete?: boolean;
  role: Role;
}
