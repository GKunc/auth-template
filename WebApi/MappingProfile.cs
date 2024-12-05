using AutoMapper;
using WebApi.DTO;
using WebApi.Entities;

namespace WebApi;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<UserForRegistrationDto, User>()
            .ForMember(u => u.UserName, opt => opt.MapFrom(x => x.Email));   
    }
}