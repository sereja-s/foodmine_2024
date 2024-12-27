import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PasswordMatchValidator } from '../../../shared/validators/password_match_validator';
import { IUserRegister } from '../../../shared/interfaces/IUserRegister';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css',
})
export class RegisterPageComponent implements OnInit {
  registerForm!: FormGroup;
  isSubmmited = false;
  returnUrl = '';
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.registerForm = this.formBuilder.group(
      {
        name: ['', [Validators.required, Validators.minLength(5)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(5)]],
        confirmPassword: ['', Validators.required],
        address: ['', [Validators.required, Validators.minLength(5)]],
      },
      // передадим параметры для группы (для сравнения пароля и повторно введённого пароля)
      {
        validators: PasswordMatchValidator('password', 'confirmPassword'),
      }
    );
    this.returnUrl = this.activatedRoute.snapshot.queryParams.returnUrl;
  }

  get fc() {
    return this.registerForm.controls;
  }

  submit() {
    this.isSubmmited = true;
    if (this.registerForm.invalid) return;
    // обратимся к значениям полей из формы
    const fv = this.registerForm.value;
    // соберём данные пользователя из формы
    const user: IUserRegister = {
      name: fv.name,
      email: fv.email,
      password: fv.password,
      confirmPassword: fv.confirmPassword,
      address: fv.address,
    };
    // подпишемся на за регистрировашегося пользователя (нам не важно, что возвращает функция). Если функция отработает, значит регистрация прошла успешно, вернём пользователя по адресу с которого он пришёл
    this.userService.register(user).subscribe((_) => {
      this.router.navigateByUrl(this.returnUrl);
    });
  }
}
