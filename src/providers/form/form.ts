import { Injectable } from '@angular/core';

import { ToolsProvider } from '../tools/tools';

@Injectable()
export class FormProvider {

  constructor(private toolsPrvd: ToolsProvider) {
    console.log('Hello FormProvider Provider');
  }

  public checkValidation(formData: any, showToast?: boolean): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!formData.barcode) {
        if (showToast)
        this.toolsPrvd.showToast('Просканируйте пожалуйста код');
        reject();
      } else if (!formData.values.value1) {
        if (showToast)
        this.toolsPrvd.showToast('Введите значение для пункта 1');
        reject();
      } else if (!formData.values.value2) {
        if (showToast)
        this.toolsPrvd.showToast('Введите значение для пункта 2');
        reject();
      } else if (!formData.values.value3) {
        if (showToast)
        this.toolsPrvd.showToast('Введите значение для пункта 3');
        reject();
      } else if (!formData.country) {
        if (showToast)
        this.toolsPrvd.showToast('Выберите страну');
        reject();
      } else if (!formData.weight) {
        if (showToast)
        this.toolsPrvd.showToast('Введите вес');
        reject();
      } else {
        resolve();
      }
    });
  }

}
