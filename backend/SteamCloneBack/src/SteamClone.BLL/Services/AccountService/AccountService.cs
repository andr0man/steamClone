using System.Net;
using System.Security.Claims;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.JsonWebTokens;
using SteamClone.BLL.Common.Interfaces;
using SteamClone.BLL.Services.JwtService;
using SteamClone.BLL.Services.PasswordHasher;
using SteamClone.DAL;
using SteamClone.DAL.Models;
using SteamClone.DAL.Repositories.RefreshTokenRepository;
using SteamClone.DAL.Repositories.UserRepository;
using SteamClone.DAL.ViewModels;
using SteamClone.DAL.ViewModels.Auth;

namespace SteamClone.BLL.Services.AccountService;

public class AccountService(
    IUserRepository userRepository,
    IMapper mapper,
    IJwtTokenService jwtService,
    IPasswordHasher passwordHasher,
    IRefreshTokenRepository refreshTokenRepository) : IAccountService
{
    public async Task<ServiceResponse> SignInAsync(SignInVM model, CancellationToken token = default)
    {
        var user = await userRepository.GetByEmailAsync(model.Email, token);
        
        if (user == null)
        {
            return ServiceResponse.BadRequestResponse($"Користувача з поштою {model.Email} не знайдено");
        }
        
        var result = passwordHasher.Verify(model.Password, user.PasswordHash);
        
        if (!result)
        {
            return ServiceResponse.BadRequestResponse($"Пароль вказано невірно");
        }
        
        var tokens = await jwtService.GenerateTokensAsync(user);
        
        return ServiceResponse.OkResponse("Успіший вхід", tokens);
    }

    public async Task<ServiceResponse> SignUpAsync(SignUpVM model, CancellationToken token = default)
    {
        if (!await userRepository.IsUniqueNicknameAsync(model.Nickname, token))
        {
            return ServiceResponse.BadRequestResponse($"{model.Nickname} вже викорстовується");
        }

        if (!await userRepository.IsUniqueEmailAsync(model.Email, token))
        {
            return ServiceResponse.BadRequestResponse($"{model.Email} вже викорстовується");
        }

        var user = mapper.Map<User>(model);
        user.Id = Guid.NewGuid().ToString();
        user.PasswordHash = passwordHasher.HashPassword(model.Password);
        user.CreatedBy = user.Id;
        user.Country = "Ukraine";
        user.RoleId = Settings.UserRole;

        try
        {
            await userRepository.CreateAsync(user, token);
        }
        catch (Exception e)
        {
            return ServiceResponse.InternalServerErrorResponse(e.Message, e.InnerException?.Message);
        }

        var tokens = await jwtService.GenerateTokensAsync(user);

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
}