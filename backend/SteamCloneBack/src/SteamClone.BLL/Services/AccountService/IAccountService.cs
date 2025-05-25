using SteamClone.DAL.ViewModels;
using SteamClone.DAL.ViewModels.Auth;

namespace SteamClone.BLL.Services.AccountService;

public interface IAccountService
{
    Task<ServiceResponse> SignInAsync(SignInVM model, CancellationToken token = default);
    Task<ServiceResponse> SignUpAsync(SignUpVM model, CancellationToken token = default);
    Task<ServiceResponse> RefreshTokensAsync(JwtModel model, CancellationToken cancellationToken = default);
}