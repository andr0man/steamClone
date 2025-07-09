using System.Net;
using System.Security.Claims;
using AutoMapper;
using MailKit;
using Microsoft.IdentityModel.JsonWebTokens;
using SteamClone.BLL.Services.JwtService;
using SteamClone.BLL.Services.PasswordHasher;
using SteamClone.DAL;
using SteamClone.DAL.Repositories.RefreshTokenRepository;
using SteamClone.DAL.Repositories.UserRepository;
using SteamClone.Domain.Models;
using SteamClone.Domain.Models.Auth;
using SteamClone.Domain.ViewModels;
using SteamClone.Domain.ViewModels.Auth;

namespace SteamClone.BLL.Services.AccountService;

public class AccountService(
    IUserRepository userRepository,
    IMapper mapper,
    IJwtTokenService jwtService,
    IPasswordHasher passwordHasher,
    IRefreshTokenRepository refreshTokenRepository,
    SteamClone.BLL.Services.MailService.IMailService mailService) : IAccountService
{
    public async Task<ServiceResponse> SignInAsync(SignInVM model, CancellationToken token = default)
    {
        var user = await userRepository.GetByEmailAsync(model.Email, token);

        if (user == null)
        {
            return ServiceResponse.BadRequestResponse($"Користувача з поштою {model.Email} не знайдено");
        }

        if (!user.EmailConfirmed)
        {
            return ServiceResponse.ForbiddenResponse("Підтвердіть email перед входом");
        }

        var result = passwordHasher.Verify(model.Password, user.PasswordHash);

        if (!result)
        {
            return ServiceResponse.BadRequestResponse($"Пароль вказано невірно");
        }

        var tokens = await jwtService.GenerateTokensAsync(user);

        return ServiceResponse.OkResponse("Успішний вхід", tokens);
    }

    public async Task<ServiceResponse> SignUpAsync(SignUpVM model, CancellationToken token = default)
    {
        if (!await userRepository.IsUniqueNicknameAsync(model.Nickname, token))
        {
            return ServiceResponse.BadRequestResponse($"{model.Nickname} вже використовується");
        }

        if (!await userRepository.IsUniqueEmailAsync(model.Email, token))
        {
            return ServiceResponse.BadRequestResponse($"{model.Email} вже використовується");
        }

        var isDbHasUsers = (await userRepository.GetAllAsync(token)).Count()! != 0;

        var user = mapper.Map<User>(model);
        user.Id = Guid.NewGuid().ToString();
        user.PasswordHash = passwordHasher.HashPassword(model.Password);
        user.CreatedBy = user.Id;
        user.CountryId = user.CountryId;
        user.RoleId = isDbHasUsers ? Settings.UserRole : Settings.AdminRole;
        user.EmailConfirmed = !isDbHasUsers;


        try
        {
            await userRepository.CreateAsync(user, token);
        }
        catch (Exception e)
        {
            return ServiceResponse.InternalServerErrorResponse(e.Message, e.InnerException?.Message);
        }

        var confirmToken = jwtService.GenerateEmailConfirmationToken(user);
        await mailService.SendConfirmEmailAsync(user, confirmToken);

        var tokens = await jwtService.GenerateTokensAsync(user, token);

        return ServiceResponse.OkResponse($"Користувач {model.Email} успішно зареєстрований", tokens);
    }

    public async Task<ServiceResponse> RefreshTokensAsync(JwtModel model, CancellationToken cancellationToken)
    {
        var existingRefreshToken =
            await refreshTokenRepository.GetRefreshTokenAsync(model.RefreshToken, cancellationToken);

        if (existingRefreshToken == null)
        {
            return ServiceResponse.BadRequestResponse("Invalid refresh token");
        }

        if (existingRefreshToken.IsUsed)
        {
            return ServiceResponse.BadRequestResponse("Refresh token is used");
        }

        if (existingRefreshToken.ExpiredDate < DateTime.UtcNow)
        {
            return await Task.FromResult(ServiceResponse.GetResponse("Token has expired!", false, null,
                HttpStatusCode.UpgradeRequired));
        }

        ClaimsPrincipal principals;

        try
        {
            principals = jwtService.GetPrincipals(model.AccessToken);
        }
        catch (Exception e)
        {
            return await Task.FromResult(ServiceResponse.GetResponse("Invalid token", false, null,
                HttpStatusCode.UpgradeRequired));
        }


        var accessTokenId = principals.Claims
            .Single(c => c.Type == JwtRegisteredClaimNames.Jti).Value;

        if (existingRefreshToken.JwtId != accessTokenId)
        {
            return await Task.FromResult(ServiceResponse.GetResponse("Token has expired!", false, null,
                HttpStatusCode.UpgradeRequired));
        }

        var existingUser = await userRepository.GetByIdAsync(existingRefreshToken.UserId, cancellationToken);

        if (existingUser != null)
        {
            var tokens = await jwtService.GenerateTokensAsync(existingUser);
            return ServiceResponse.OkResponse("Users tokens", tokens);
        }

        return ServiceResponse.NotFoundResponse($"User under id: {existingRefreshToken.UserId} was not found!");
    }

    public async Task<ServiceResponse> ConfirmEmailAsync(string token)
    {
        try
        {
            var principal = jwtService.GetPrincipals(token);

            var userId = principal.Claims.FirstOrDefault(c => c.Type == "id")?.Value;
            var type = principal.Claims.FirstOrDefault(c => c.Type == "type")?.Value;

            if (type != "email-confirm")
                return ServiceResponse.ForbiddenResponse("Недійсний тип токена");

            var user = await userRepository.GetByIdAsync(userId, CancellationToken.None);
            if (user == null)
                return ServiceResponse.NotFoundResponse("Користувача не знайдено");

            if (user.EmailConfirmed)
                return ServiceResponse.BadRequestResponse("Email вже підтверджено");

            user.EmailConfirmed = true;
            await userRepository.UpdateAsync(user, CancellationToken.None);

            return ServiceResponse.OkResponse("Email підтверджено успішно!");
        }
        catch
        {
            return ServiceResponse.BadRequestResponse("Недійсний або прострочений токен");
        }
    }
}