import { UserRoleDto } from "./userRoleDto.interface";

export interface UserDto {
  id: string;
  userName: string;
  email: string;
  isActive: boolean;
  userRoles?: UserRoleDto[];
}