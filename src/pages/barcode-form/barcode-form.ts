import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';

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
    country: <string> null,
    weight: <number> null
  };
  private canSubmit: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private barcodeScanner: BarcodeScanner,
    private formProvider: FormProvider,
    private app: App
  ) {}

  private checkForm(): void {
    this.formProvider.checkValidation(this.formData).then(() => {
      this.canSubmit = true;
      console.log('sendForm');
    }).catch((err: any) => {
      console.error('sendForm');
    });
  }

  private sendForm(): void {
    this.formProvider.checkValidation(this.formData, true).then(() => {
      this.app.getRootNav().setRoot(CameraPage, { formData: this.formData });
    }).catch((err: any) => {
      console.error('sendForm');
    });
  }

  private startScan(): void {
    this.barcodeScanner.scan().then((barcodeData: any) => {
      // Success! Barcode data is here
      if (!barcodeData.cancelled) {
        console.log('barcodeScanner 1', barcodeData);
        this.formData.barcode = barcodeData.text;
      } else {
        console.log('barcodeScanner 2', barcodeData);
        this.formData.barcode = null;
      }
    }, (err: any) => {
      // An error occurred
      console.log('barcodeScanner', err);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BarcodeFormPage');
  }

}
