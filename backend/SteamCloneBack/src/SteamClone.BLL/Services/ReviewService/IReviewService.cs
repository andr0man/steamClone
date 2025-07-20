using SteamClone.BLL.Services.Common;
using SteamClone.Domain.ViewModels.Games.Reviews;

namespace SteamClone.BLL.Services.ReviewService;

public interface IReviewService : IServiceCRUD<string, CreateReviewVM, UpdateReviewVM>
{
    Task<ServiceResponse> GetByFilterAsync(FilterReviewVM filter, CancellationToken token = default);
}