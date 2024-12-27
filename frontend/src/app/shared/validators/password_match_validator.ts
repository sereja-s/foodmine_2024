import { AbstractControl } from '@angular/forms';

export const PasswordMatchValidator = (
  passwordControlName: string,
  confirmPasswordControlName: string
) => {
  const validator = (form: AbstractControl) => {
    const passwordControl = form.get(passwordControlName);
    const confirmPasswordControl = form.get(confirmPasswordControlName);
    if (!passwordControl || !confirmPasswordControl) return;
    if (passwordControl.value !== confirmPasswordControl.value) {
      // выведем ошибку в поле подтверждения пароля
      confirmPasswordControl.setErrors({ notMatch: true });
    } else {
      const errors = confirmPasswordControl.errors;
      if (!errors) return;
      // удалим ошибку
      delete errors.notMatch;
      confirmPasswordControl.setErrors(errors);
    }
  };
  return validator;
};
