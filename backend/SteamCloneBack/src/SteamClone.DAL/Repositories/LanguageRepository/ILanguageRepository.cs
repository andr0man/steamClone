using SteamClone.DAL.Repositories.Common;
using SteamClone.Domain.Models.Languages;

namespace SteamClone.DAL.Repositories.LanguageRepository;

public interface ILanguageRepository : IRepository<Language, int>
{
    public Task<string?> CheckForUniqueness(Language model, CancellationToken token = default);
}