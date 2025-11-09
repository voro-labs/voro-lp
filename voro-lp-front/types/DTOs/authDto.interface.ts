import { RoleDto } from "./Identity/roleDto.interface";

export interface AuthDto {
  userId?: string;
  firstName?: string;
  lastName?: string;
  userName?: string;
  email?: string;
  roles?: RoleDto[];
  expiration?: Date;
  token: string;
}
