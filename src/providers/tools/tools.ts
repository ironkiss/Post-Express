import { Injectable } from '@angular/core';

import { ToastController } from 'ionic-angular';

@Injectable()
export class ToolsProvider {
  private toast: any;

  constructor(private toastCtrl: ToastController) {
    console.log('Hello ToolsProvider Provider');
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
