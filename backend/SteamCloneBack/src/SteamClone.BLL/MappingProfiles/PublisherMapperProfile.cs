using AutoMapper;
using SteamClone.Domain.Models.Publishers;
using SteamClone.Domain.ViewModels.Publishers;

namespace SteamClone.BLL.MappingProfiles;

public class PublisherMapperProfile : Profile
{
    public PublisherMapperProfile()
    {
        CreateMap<Publisher, PublisherVM>().ReverseMap();
        CreateMap<CreatePublisherVM, Publisher>().ReverseMap();
        CreateMap<UpdatePublisherVM, Publisher>().ReverseMap();
    }
}