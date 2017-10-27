import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';

import { SignInPage } from '../sign-in/sign-in';
import { BarcodeFormPage } from '../barcode-form/barcode-form';

@IonicPage()
@Component({
  selector: 'page-finish',
  templateUrl: 'finish.html',
})
export class FinishPage {
  private status: string = 'success';
  private formData: any = null;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private app: App
  ) {
    this.formData = this.navParams.get('formData');
  }

  private tryAgain(): void {
    
  }

  private exit(): void {
    this.app.getRootNav().setRoot(SignInPage);
  }

  private addNewCode(): void {
    this.app.getRootNav().setRoot(BarcodeFormPage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FinishPage');
  }

}
