import { Injectable } from '@angular/core';

import { ToolsProvider } from '../tools/tools';
import { ApiProvider } from '../api/api';
import { AuthProvider } from '../auth/auth';

@Injectable()
export class FormProvider {

  constructor(
    private toolsPrvd: ToolsProvider,
    private apiPrvd: ApiProvider,
    private authPrvd: AuthProvider
  ) {}

  public getCost(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiPrvd.post('calculate', data).subscribe((res: any) => {
        resolve(res.json());
      }, (err: any) => reject());
    });
  }

  public sendForm(formData: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiPrvd.post('barcode', formData).subscribe((res: any) => {
        resolve(res);
      }, (err: any) => {
        this.errorsAction(err).then(() => reject({ canDoAction: true }))
          .catch(() => reject());
      });
    });
  }

  public validateBarcode(barcode: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiPrvd.post('validate_barcode', {
        barcode
      }).subscribe((res: any) => {
        resolve(res.json());
      }, (err: any) => reject(err.json()));
    });
  }

  public checkValidation(formData: any, showToast?: boolean): Promise<any> {
    return new Promise((resolve, reject) => {
      let errorText: string = null;
      if (!formData.barcode) {
        errorText = 'Просканируйте пожалуйста код';
      } else if (!formData.values.value1) {
        errorText = 'Введите значение для пункта 1';
      } else if (!formData.values.value2) {
        errorText = 'Введите значение для пункта 2';
      } else if (!formData.values.value3) {
        errorText = 'Введите значение для пункта 3';
      } else if (!formData.country) {
        errorText = 'Выберите страну';
      } else if (!formData.weight) {
        errorText = 'Введите вес';
      } else {
        resolve();
      }

      if (errorText) {
        if (showToast) this.toolsPrvd.showToast(errorText);
        reject();
      }
    });
  }

  private errorsAction(err: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (err && (err.status == 401 || err.status == 498)) {
        console.log('err.status', err.status);
        this.toolsPrvd.showToast('Время сессии вышло, пожалуйста залогиньтесь еще раз.', 5000);
        this.authPrvd.logOut();
        reject()
      } else {
        resolve();
      }
    });
  }

}
