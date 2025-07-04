using SteamClone.BLL.Services.Common;
using SteamClone.Domain.ViewModels.Games;

namespace SteamClone.BLL.Services.GenreService;

public interface IGenreService : IServiceCRUD<int, CreateUpdateGenreVM, CreateUpdateGenreVM>
{
    
}