using SteamClone.BLL.Services.Common;
using SteamClone.Domain.ViewModels.Languages;

namespace SteamClone.BLL.Services.LanguageService;

public interface ILanguageService : IServiceCRUD<int, CreateUpdateLanguageVM, CreateUpdateLanguageVM>
{
    
}