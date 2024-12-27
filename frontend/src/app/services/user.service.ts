import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../shared/model/User';
import { IUserLogin } from '../shared/interfaces/IUserLogin';
import { HttpClient } from '@angular/common/http';
import { USER_LOGIN_URL, USER_REGISTER_URL } from '../shared/constants/urls';
import { ToastrService } from 'ngx-toastr';
import { IUserRegister } from '../shared/interfaces/IUserRegister';

// создадим ключ для установки(записи) элемента в локальное хранилище и получения этого элемента из локального хранилища
const USER_KEY = 'User';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  // определим приватный субъект пользователя как субъект поведения с типом- польователь и начальным значением- новый пользователь (внутри субъекта поведения есть режимы чтения и записи)
  private userSubject = new BehaviorSubject<User>(
    // по умолчанию получим актуальные данные о текущем пользователе, а если пользователя нет, то будет создан новый пользователь
    this.getUserFromLocalStorage()
  );
  // определим публичного наблюдаемого пользователя(это преобразованный в конструкторе приватный субъект пользователя),чтобы сделать данные текущего экземпляра(объекта) пользователя общедоступными за пределами сервиса, доступными только для чтения, но без возможности их менять(перезаписывать вне сервиса)
  public userObsevable: Observable<User>;

  constructor(private http: HttpClient, private toastrService: ToastrService) {
    this.userObsevable = this.userSubject.asObservable();
  }

  /**
   * геттер для получения значений крайнего(текущего) пользователя
   */
  public get currentUser(): User {
    return this.userSubject.value;
  }

  /**
   * Метод входа в систему (параметр с типом интерфейс (здесь- IUserLogin) -> нельзя создать новый экземпляр интерфейса)
   */
  login(userLogin: IUserLogin): Observable<User> {
    return this.http.post<User>(USER_LOGIN_URL, userLogin).pipe(
      tap({
        next: (user) => {
          // сохраним данные пользователя в локальном хранилище
          this.setUserToLocalStorage(user);
          // мы получаем нового пользователя с сервера, поэтому нужно обновить информацию о пользователе
          this.userSubject.next(user);
          this.toastrService.success(
            `Welcome to Foodmine ${user.name}!`,
            'Login successful'
          );
        },
        error: (errorResponse) => {
          this.toastrService.error(errorResponse.error, 'Login Failed!');
        },
      })
    );
  }

  /**
   * Метод регистрации пользователя
   */
  register(userRegister: IUserRegister): Observable<User> {
    return this.http.post<User>(USER_REGISTER_URL, userRegister).pipe(
      tap({
        next: (user) => {
          // сохраним данные пользователя в локальном хранилище
          this.setUserToLocalStorage(user);
          // мы получаем нового пользователя с сервера, поэтому нужно обновить информацию о пользователе
          this.userSubject.next(user);
          this.toastrService.success(
            `Welcome to Foodmine ${user.name}`,
            'Register Successful!'
          );
        },
        error: (errorResponse) => {
          this.toastrService.error(errorResponse.error, 'Register Failed!');
        },
      })
    );
  }

  /**
   * Метод для выхода из системы
   */
  logout() {
    // установим следующее значение субъекта пользователя, как новый пользователь
    this.userSubject.next(new User());
    // удалим элемент (здесь- текущего пользователя) из локального хранилища по ключу
    localStorage.removeItem(USER_KEY);
    // обновим страницу
    window.location.reload();
  }

  /**
   * Метод для записи текщего пользователя в локальное хранилище
   */
  private setUserToLocalStorage(user: User) {
    // преобразуем данные текущего пользователя в строку формата json, и запишем в локальное хранилище
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  /**
   * Метод для получения данных пользователя из локального хранилища по ключу
   */
  private getUserFromLocalStorage(): User {
    const userJson = localStorage.getItem(USER_KEY);
    if (userJson) {
      return JSON.parse(userJson) as User;
    }
    return new User();
  }
}
