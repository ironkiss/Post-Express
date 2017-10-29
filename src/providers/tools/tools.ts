import { Injectable } from '@angular/core';

import { ToastController, LoadingController } from 'ionic-angular';

@Injectable()
export class ToolsProvider {
  private toast: any;
  private loader: any;

  constructor(
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {
    console.log('Hello ToolsProvider Provider');
  }

  public showLoader(content?: string): void {
    if (!content) content = 'Please wait...'
    this.loader = this.loadingCtrl.create({
      content: content
    });

    this.loader.present();
  }

  public hideLoader(): Promise<any> {
    if (this.loader) return this.loader.dismiss()
      .then(() => {})
      .catch(err => console.warn('Loaded error'))
    else return new Promise((resolve) => resolve());
  }

  public showToast(message: string, duration?: number, position?: string): void {
    this.toast = this.toastCtrl.create({
      message: message,
      duration: duration ? duration : 3000,
      position: position ? position : 'top',
    });
    this.toast.present();
  }

}
