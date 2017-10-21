import { Injectable } from '@angular/core';

import { ApiProvider } from '../api/api';
import { ToolsProvider } from '../tools/tools';

@Injectable()
export class AuthProvider {

  constructor(
    private toolsPrvd: ToolsProvider,
    private apiPrvd: ApiProvider
  ) {
    console.log('Hello AuthProvider Provider');
  }

  public signIn(login: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve();
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
