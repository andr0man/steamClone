using SteamClone.BLL.Services.Common;
using SteamClone.Domain.ViewModels.Countries;

namespace SteamClone.BLL.Services.CountryService;

public interface ICountryService : IServiceCRUD<int, CreateUpdateCountryVM, CreateUpdateCountryVM>
{
    
}