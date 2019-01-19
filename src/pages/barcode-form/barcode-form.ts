import { Component } from '@angular/core';
import { IonicPage, App, NavController, AlertController } from 'ionic-angular';

import { CameraPage } from '../camera/camera';
import { SignInPage } from '../sign-in/sign-in';

import { FormProvider } from '../../providers/form/form';
import { ToolsProvider } from '../../providers/tools/tools';
import { AuthProvider } from '../../providers/auth/auth';

import { BarcodeScanner,
  BarcodeScannerOptions } from '@ionic-native/barcode-scanner';

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
  private cost: any = {};

  constructor(
    public alertCtrl: AlertController,
    private barcodeScanner: BarcodeScanner,
    private formPrvd: FormProvider,
    private toolsPrvd: ToolsProvider,
    private app: App,
    private authPrvd: AuthProvider,
    private navCtrl: NavController
  ) {}

  public checkForm(type?: string): void {
    console.log('checkForm', type, this.formData.weight);
    if (type && (type == 'country' || type == 'weight')) {
      if (this.formData.country && this.formData.weight) {
        this.toolsPrvd.showLoader();
        this.formPrvd.getCost({
          country: this.formData.country,
          weight: this.formData.weight
        }).then((res: any) => {
          console.log('formPrvd.getPrice', res);
          this.toolsPrvd.hideLoader();
          this.cost = res;
        }).catch((err: any) => {
          console.error('formPrvd.getPrice', err);
          this.toolsPrvd.hideLoader();
        });
      }
    }

    this.formPrvd.checkValidation(this.formData).then(() => {
      this.canSubmit = true;
    }).catch((err: any) => console.error('formPrvd.checkValidation', err));
  }

  public sendForm(): void {
    this.formPrvd.checkValidation(this.formData, true).then(() => {
      if (this.cost.price === 'error') {
        this.toolsPrvd.showToast(this.cost.message, 5000);
      } else {
        this.app.getRootNav().setRoot(CameraPage, { formData: this.formData });
      }
    }).catch((err: any) => console.error('formPrvd.checkValidation', err));
  }

  public startScan(): void {
    let options: BarcodeScannerOptions = {
      formats: 'CODE_39,CODE_93,CODE_128,EAN_8,EAN_13'
    };
    this.barcodeScanner.scan(options).then((barcodeData: any) => {
      const barcode = barcodeData.cancelled ?
        null : barcodeData.text;

      if (barcode) {
        this.formPrvd.validateBarcode(this.formData.barcode).then(res => {
          console.log('res', res)
          if (res && res.status == 'success') {
            this.formData.barcode = barcode;
            this.formData.country = res.country_id;
          }
        }).catch(err => {
          console.error('formPrvd.validateBarcode', err);
        })
      }
    }, (err: any) => console.log('barcodeScanner', err));
  }

  public signOut(): void {
    const confirm = this.alertCtrl.create({
      title: 'Выход',
      message: 'Вы уверены, что хотите выйти?',
      buttons: [
        {
          text: 'Нет',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Да',
          handler: () => {
            this.toolsPrvd.showLoader();
            this.authPrvd.signOut().then(res => {
              this.toolsPrvd.hideLoader();
              this.navCtrl.setRoot(SignInPage);
            }).catch((err: any) => {
              this.toolsPrvd.hideLoader();
            });
          }
        }
      ]
    });
    confirm.present();
  }

}
