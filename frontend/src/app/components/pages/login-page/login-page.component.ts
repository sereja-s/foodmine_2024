import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { throwIfEmpty } from 'rxjs';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
})
export class LoginPageComponent implements OnInit {
  // добавим поле с именем формы входа в систему
  loginForm!: FormGroup;
  // поле: уже отправлено со значением по умолчанию- false
  isSubmitted = false;
  // адрес на который пользователь вернётся после авторизации (получают адресную строку при помощи активированного маршрута и затем возвращают пользователя при помощи Роутера)
  returnUrl = '';

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // создадим форму для входа в систему
    this.loginForm = this.formBuilder.group({
      // определим все входные данные и их валидаторы
      // поле ввода (элемент управления): ['начальное значение (значение по умолчанию)', [валидаторы для этого поля]]
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
    // пример обращения к злементу управления: loginform.controls.email

    // получим последнее значение активированного маршрута и у него параметры запроса,а затем считаем адрес возврата
    // таким образом мы получаем returnUrl каждый раз, когда заходим на страницу входа
    this.returnUrl = this.activatedRoute.snapshot.queryParams.returnUrl;
  }

  /**
   * геттер для простого обращения к элементу управления формой (например: fc.email)
   */
  get fc() {
    return this.loginForm.controls;
  }

  /**
   * метод отправки формы
   */
  submmit() {
    // при нажатии кноплки отправки установим значение
    this.isSubmitted = true;
    if (this.loginForm.invalid) return;
    this.userService
      .login({
        email: this.fc.email.value,
        password: this.fc.password.value,
      })
      .subscribe(() => {
        this.router.navigateByUrl(this.returnUrl); // что бы метод сработал, нужно перезапустить сервер в терминале из папки проекта, т.к. мы вносили изменения в ngOnInit
      });
  }
}
