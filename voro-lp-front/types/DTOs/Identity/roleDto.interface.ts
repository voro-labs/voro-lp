import { UserRoleDto } from "./userRoleDto.interface";


export interface RoleDto {
  id: string;
  name: string;
  description?: string;
  userRoles?: UserRoleDto[];
}