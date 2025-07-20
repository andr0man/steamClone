using AutoMapper;
using SteamClone.Domain.Models.Games;
using SteamClone.Domain.ViewModels.Games.Reviews;

namespace SteamClone.BLL.MappingProfiles;

public class ReviewMapperProfile : Profile
{
    public ReviewMapperProfile()
    {
        CreateMap<Review, ReviewVM>().ReverseMap();
        CreateMap<CreateReviewVM, Review>().ReverseMap();
        CreateMap<UpdateReviewVM, Review>().ReverseMap();
    }
}