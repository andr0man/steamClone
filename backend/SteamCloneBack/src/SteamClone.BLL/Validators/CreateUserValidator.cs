using SteamClone.DAL;
using SteamClone.DAL.ViewModels;
using FluentValidation;
using SteamClone.DAL.ViewModels.Users;

namespace SteamClone.BLL.Validators
{
    public class CreateUserValidator : AbstractValidator<CreateUserVM>
    {
        public CreateUserValidator() 
        {
            RuleFor(m => m.Email)
                .EmailAddress().WithMessage("Невірний формат пошти")
                .NotEmpty().WithMessage("Вкажіть пошту");
            RuleFor(m => m.Nickname)
                .NotEmpty().WithMessage("Вкажіть ім'я користувача");
            RuleFor(m => m.Password)
                .MinimumLength(Settings.PasswordLength).WithMessage("Мінімальна довжина паролю 6 символів");
            RuleFor(m => m.RoleId)
                .NotEmpty().WithMessage("Вкажіть роль");
        }
    }
}
