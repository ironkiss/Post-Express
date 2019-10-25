import { Injectable } from '@angular/core';

import { App } from 'ionic-angular';

import { SignInPage } from '../../pages/sign-in/sign-in';

import { ApiProvider } from '../api/api';
import { ToolsProvider } from '../tools/tools';
import { UserProvider } from '../user/user';

import { Storage } from '@ionic/storage';

@Injectable()
export class AuthProvider {

  constructor(
    private toolsPrvd: ToolsProvider,
    private apiPrvd: ApiProvider,
    private userPrvd: UserProvider,
    private storage: Storage,
    private app: App
  ) {}

  public logOut(): void {
    this.storage.remove('user_data');
    this.app.getRootNav().setRoot(SignInPage);
  }

  public isLogged(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.storage.get('user_data').then((user: any) => {
        Object.keys(user).length > 0 && user.token ?
          resolve() : reject();
      }).catch((err: any) => {
        console.error('Error storing item [user_data]', err);
        reject(err);
      });
    });
  }

  public signIn(login: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiPrvd.post('login', {
        name: login,
        password: password
      }).subscribe((res: any) => {
        let user = res.json().user;
        user.token = res.json().token;
        this.storage.set('user_data', user).then(() => {
          this.userPrvd.user = user;
          this.apiPrvd.authToken = user.token;
          resolve(user);
        }).catch((err: any) => {
          console.error('Error storing item [user_data]', err);
          reject(err);
        });
      }, (err: any) => reject(err));
    });
  }

  public signOut(): Promise<any> {
    return this.storage.remove('user_data');
  }

  public showErrors(controls: any): void {
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
    if (text) this.toolsPrvd.showToast(text);
  }

}
