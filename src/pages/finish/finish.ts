import { Component } from '@angular/core';
import { IonicPage, NavParams, App, Platform } from 'ionic-angular';

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
  private isAndroid: boolean = false;

  constructor(
    private navParams: NavParams,
    private app: App,
    private formPrvd: FormProvider,
    private toolsPrvd: ToolsProvider,
    private platform: Platform
  ) {
    this.formData = this.navParams.get('formData');
    this.result = this.navParams.get('result');
    this.status = this.navParams.get('status');
    this.isAndroid = this.platform.is('android');
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
        this.result = err;
      }
    });
  }

  public exit(): void {
    this.platform.exitApp();
  }

  public addNewCode(): void {
    this.app.getRootNav().setRoot(BarcodeFormPage);
  }

}
