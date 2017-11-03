import { Injectable } from '@angular/core';

import { ApiProvider } from '../api/api';
import { ToolsProvider } from '../tools/tools';
import { UserProvider } from '../user/user';

import { NativeStorage } from '@ionic-native/native-storage';

@Injectable()
export class AuthProvider {

  constructor(
    private toolsPrvd: ToolsProvider,
    private apiPrvd: ApiProvider,
    private userPrvd: UserProvider,
    private nativeStorage: NativeStorage
  ) {
    console.log('Hello AuthProvider Provider');
  }

  public isLogged(): Promise<any> {
    return new Promise((resolve, reject) =>
      Object.keys(this.userPrvd.user).length > 0 ? resolve() : reject()
    );
  }

  public signIn(login: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiPrvd.post('login', {
        email: login,
        password: password
      }).subscribe((res: any) => {
        let user = res.json().user;
        user.api_token = res.json().api_token;
        this.nativeStorage.setItem('user_data', user).then(() => {
          console.log('Stored item [user_data]!');
          resolve(user);
        }).catch((err: any) => {
          console.error('Error storing item [user_data]', err);
          reject(err);
        });
      }, (err: any) => reject(err));
    });
  }

  public showErrors(controls: any): void {
    if (controls.login.invalid) {
      if (controls.login.errors.required) {
        this.toolsPrvd.showToast('Поле "Пункт приёма" обязательное');
      } else if (controls.login.errors.minlength) {
        this.toolsPrvd.showToast(`Минимальная длина поля "Пункт приёма" должна быть ${controls.login.errors.minlength.requiredLength} символов`);
      } else if (controls.login.errors.maxlength) {
        this.toolsPrvd.showToast(`Максимальная длина поля "Пункт приёма" должна быть ${controls.login.errors.maxlength.requiredLength} символов`);
      }
    } else if (controls.password.invalid) {
      if (controls.password.errors.required) {
        this.toolsPrvd.showToast('Поле "Пароль" обязательное');
      } else if (controls.password.errors.minlength) {
        this.toolsPrvd.showToast(`Минимальная длина поля "Пароль" должна быть ${controls.password.errors.minlength.requiredLength} символов`);
      } else if (controls.password.errors.maxlength) {
        this.toolsPrvd.showToast(`Максимальная длина поля "Пароль" должна быть ${controls.password.errors.maxlength.requiredLength} символов`);
      }
    }
  }

}
