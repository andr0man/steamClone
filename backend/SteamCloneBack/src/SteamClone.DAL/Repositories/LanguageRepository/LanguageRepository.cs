using Microsoft.EntityFrameworkCore;
using SteamClone.DAL.Data;
using SteamClone.DAL.Repositories.Common;
using SteamClone.Domain.Common.Interfaces;
using SteamClone.Domain.Models.Languages;

namespace SteamClone.DAL.Repositories.LanguageRepository;

public class LanguageRepository(AppDbContext appDbContext, IUserProvider userProvider)
    : Repository<Language, int>(appDbContext, userProvider), ILanguageRepository
{
    private readonly AppDbContext _appDbContext = appDbContext;

    public async Task<string?> CheckForUniqueness(Language model, CancellationToken token = default)
    {
        var language =
            await _appDbContext.Languages.FirstOrDefaultAsync(
                c => c.Name == model.Name || c.Code == model.Code, token);

        if (language != null)
        {
            if (language.Name == model.Name) return "Name";
            if (language.Code == model.Code) return "Alpha2Code";
        }

        return null;
    }
}