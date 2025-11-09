using AutoMapper;
using VoroLp.Application.DTOs.Identity;
using VoroLp.Domain.Entities.Identity;

namespace VoroLp.Application.Mappings.Identity
{
    public class IdentityMappingProfile : Profile
    {
        public IdentityMappingProfile()
        {
            CreateMap<Role, RoleDto>().ReverseMap();
            CreateMap<User, UserDto>().ReverseMap();
            CreateMap<UserRole, UserRoleDto>().ReverseMap();
        }
    }
}
