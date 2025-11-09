import { RoleDto } from "./roleDto.interface";
import { UserDto } from "./userDto.interface";

export interface UserRoleDto {
  userId: string;
  roleId: string;
  roleName?: string;
  userName?: string;
  role?: RoleDto;
  user?: UserDto;
}
