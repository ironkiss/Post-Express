import { Component } from '@angular/core';
import { IonicPage, NavParams, App } from 'ionic-angular';

import { SignInPage } from '../sign-in/sign-in';
import { BarcodeFormPage } from '../barcode-form/barcode-form';

import { FormProvider } from '../../providers/form/form';
import { ToolsProvider } from '../../providers/tools/tools';

@IonicPage()
@Component({
  selector: 'page-finish',
  templateUrl: 'finish.html',
})
export class FinishPage {
  private status: string = 'success';
  private formData: any = {};
  private result: any = {};

  constructor(
    private navParams: NavParams,
    private app: App,
    private formPrvd: FormProvider,
    private toolsPrvd: ToolsProvider
  ) {
    this.formData = this.navParams.get('formData');
    this.result = this.navParams.get('result');
    this.status = this.navParams.get('status');
  }

  public tryAgain(): void {
    this.toolsPrvd.showLoader();
    this.formPrvd.sendForm(this.formData).then((res: any) => {
      this.toolsPrvd.hideLoader();
      this.status = 'success';
      this.result = res;
    }).catch((err: any) => {
      console.error('formPrvd.sendForm', err);
      this.toolsPrvd.hideLoader();
      if (err && err.canDoAction) {
        this.status = 'error';
        this.result = err.json();
      }
    });
  }

  public exit(): void {
    this.app.getRootNav().setRoot(SignInPage);
  }

  public addNewCode(): void {
    this.app.getRootNav().setRoot(BarcodeFormPage);
  }

}
