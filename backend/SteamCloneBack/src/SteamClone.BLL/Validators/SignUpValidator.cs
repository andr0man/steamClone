using SteamClone.DAL;
using FluentValidation;
using SteamClone.Domain.ViewModels.Auth;

namespace SteamClone.BLL.Validators
{
    public class SignUpValidator : AbstractValidator<SignUpVM>
    {
        public SignUpValidator() 
        {
            RuleFor(m => m.Email)
                .EmailAddress().WithMessage("Невірний формат пошти")
                .NotEmpty().WithMessage("Вкажіть пошту");
            RuleFor(m => m.Nickname)
                .NotEmpty().WithMessage("Вкажіть нік користувача");
            RuleFor(m => m.Password)
                .MinimumLength(Settings.PasswordLength).WithMessage("Мінімальна довжина паролю 6 символів");
            RuleFor(m => m.ConfirmPassword)
                .Equal(p => p.Password).WithMessage("Паролі повинні збігатися");
        }
    }
}
