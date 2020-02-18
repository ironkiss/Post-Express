import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { APIService } from './api.service';
import { ToolsService } from './tools.service';
import { UserService } from './user.service';

import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private toolsService: ToolsService,
    private apiService: APIService,
    private userService: UserService,
    private storage: Storage,
    private router: Router
  ) {}

  logOut(): void {
    this.storage.remove('user_data');
    this.router.navigate(['']);
  }

  getToken() {
    return this.apiService.authToken
  }

  isLogged = (): Promise<any> => new Promise(async (resolve, reject) => {
    try {
      const user = await this.storage.get('user_data');
      Object.keys(user || {}).length > 0 && user.token ?
        resolve() : reject();
    } catch (error) {
      console.error('Error storing item [user_data]', error);
      reject(error);
    }
  });

  signIn(login: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiService.post('login', {
        name: login,
        password: password
      }).subscribe((res: any) => {
        const user = res.user;
        user.token = res.token;
        this.storage.set('user_data', user).then(() => {
          this.userService.user = user;
          this.apiService.authToken = user.token;
          resolve(user);
        }).catch((err: any) => {
          console.error('Error storing item [user_data]', err);
          reject(err);
        });
      }, (err: any) => reject(err));
    });
  }

  signOut(): Promise<any> {
    return this.storage.remove('user_data');
  }

  showErrors(controls: any): void {
    let text = null;
    if (controls.login.invalid) {
      if (controls.login.errors.required) {
        text = 'Поле "Пункт приёма" обязательное';
      } else if (controls.login.errors.minlength) {
        text = `Минимальная длина поля "Пункт приёма" должна быть ${controls.login.errors.minlength.requiredLength} символов`;
      } else if (controls.login.errors.maxlength) {
        text = `Максимальная длина поля "Пункт приёма" должна быть ${controls.login.errors.maxlength.requiredLength} символов`;
      }
    } else if (controls.password.invalid) {
      if (controls.password.errors.required) {
        text = 'Поле "Пароль" обязательное';
      } else if (controls.password.errors.minlength) {
        text = `Минимальная длина поля "Пароль" должна быть ${controls.password.errors.minlength.requiredLength} символов`;
      } else if (controls.password.errors.maxlength) {
        text = `Максимальная длина поля "Пароль" должна быть ${controls.password.errors.maxlength.requiredLength} символов`;
      }
    }
    if (text) this.toolsService.showToast(text);
  }
}
