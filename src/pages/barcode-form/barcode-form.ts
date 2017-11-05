import { Component } from '@angular/core';
import { IonicPage, App } from 'ionic-angular';

import { CameraPage } from '../camera/camera';

import { FormProvider } from '../../providers/form/form';

import { BarcodeScanner } from '@ionic-native/barcode-scanner';

@IonicPage()
@Component({
  selector: 'page-barcode-form',
  templateUrl: 'barcode-form.html',
})
export class BarcodeFormPage {
  private formData: any = {
    barcode: <string> '',
    values: {
      value1: <boolean> false,
      value2: <boolean> false,
      value3: <boolean> false,
    },
    country: <number> null,
    weight: <number> null
  };
  private canSubmit: boolean = false;
  private cost: string = '';

  constructor(
    private barcodeScanner: BarcodeScanner,
    private formPrvd: FormProvider,
    private app: App
  ) {}

  public checkForm(type?: string): void {
    console.log('checkForm', type, this.formData.weight);
    if (type && (type == 'country' || type == 'weight')) {
      if (this.formData.country && this.formData.weight)
      this.formPrvd.getCost({
        country: this.formData.country,
        weight: this.formData.weight
      }).then((res: any) => {
        console.log('formPrvd.getPrice', res);
        this.cost = res;
      }).catch((err: any) => console.error('formPrvd.getPrice', err));
    }

    this.formPrvd.checkValidation(this.formData).then(() => {
      this.canSubmit = true;
    }).catch((err: any) => console.error('formPrvd.checkValidation', err));
  }

  public sendForm(): void {
    this.formPrvd.checkValidation(this.formData, true).then(() => {
      this.app.getRootNav().setRoot(CameraPage, { formData: this.formData });
    }).catch((err: any) => console.error('formPrvd.checkValidation', err));
  }

  public startScan(): void {
    this.barcodeScanner.scan().then((barcodeData: any) => {
      this.formData.barcode = barcodeData.cancelled ?
        null : barcodeData.text;
    }, (err: any) => console.log('barcodeScanner', err));
  }

}
