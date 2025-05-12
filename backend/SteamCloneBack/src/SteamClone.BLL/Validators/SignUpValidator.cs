using SteamClone.DAL;
using SteamClone.DAL.ViewModels;
using FluentValidation;

namespace SteamClone.BLL.Validators
{
    public class SignUpValidator : AbstractValidator<SignUpVM>
    {
        public SignUpValidator() 
        {
            RuleFor(m => m.Email)
                .EmailAddress().WithMessage("Невірний формат пошти")
                .NotEmpty().WithMessage("Вкажіть пошту");
            RuleFor(m => m.UserName)
                .NotEmpty().WithMessage("Вкажіть ім'я користувача");
            RuleFor(m => m.Password)
                .MinimumLength(Settings.PasswordLength).WithMessage("Мінімальна довжина паролю 6 символів");
            RuleFor(m => m.ConfirmPassword)
                .Equal(p => p.Password).WithMessage("Паролі повинні збігатися");
        }
    }
}
