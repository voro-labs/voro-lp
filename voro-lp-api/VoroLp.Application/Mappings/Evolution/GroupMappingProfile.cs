using AutoMapper;
using VoroLp.Application.DTOs.Evolution;
using VoroLp.Application.DTOs.Evolution.API;

namespace VoroLp.Application.Mappings.Evolution
{

    public class GroupMappingProfile : Profile
    {
        public GroupMappingProfile()
        {
            CreateMap<GroupEventDto, GroupDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(_ => Guid.NewGuid()))

            // id → RemoteJid
            .ForMember(dest => dest.RemoteJid, opt => opt.MapFrom(src => src.Id))

            // subject → Name
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Subject))

            // pictureUrl → ProfilePictureUrl
            .ForMember(dest => dest.ProfilePictureUrl, opt => opt.MapFrom(src => src.PictureUrl))

            // creation(timestamp unix) → CreatedAt
            .ForMember(dest => dest.CreatedAt,
                opt => opt.MapFrom(src => DateTimeOffset.FromUnixTimeSeconds(src.Creation)))

            // subjectTime(timestamp unix) → LastMessageAt (ou outra lógica que preferir)
            .ForMember(dest => dest.LastMessageAt,
                opt => opt.MapFrom(src => DateTimeOffset.FromUnixTimeSeconds(src.SubjectTime)))

            // coleções
            .ForMember(dest => dest.Members, opt => opt.Ignore())
            .ForMember(dest => dest.Messages, opt => opt.Ignore());
        }
    }
}
