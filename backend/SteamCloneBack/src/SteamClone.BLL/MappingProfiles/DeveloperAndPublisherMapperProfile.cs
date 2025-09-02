using AutoMapper;
using SteamClone.Domain.Models.DevelopersAndPublishers;
using SteamClone.Domain.ViewModels.DevelopersAndPublishers;

namespace SteamClone.BLL.MappingProfiles;

public class DeveloperAndPublisherMapperProfile : Profile
{
    public DeveloperAndPublisherMapperProfile()
    {
        CreateMap<DeveloperAndPublisher, DeveloperAndPublisherVM>().ReverseMap();
        CreateMap<CreateDeveloperAndPublisherVM, DeveloperAndPublisher>().ReverseMap();
        CreateMap<UpdateDeveloperAndPublisherVM, DeveloperAndPublisher>().ReverseMap();
    }
}