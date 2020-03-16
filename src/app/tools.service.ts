import { Injectable } from '@angular/core';
import { ToastController, LoadingController } from '@ionic/angular';

import { ThemeableBrowser, ThemeableBrowserOptions } from '@ionic-native/themeable-browser/ngx';
import { BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';

@Injectable({
  providedIn: 'root'
})
export class ToolsService {
  private toast: any;
  private loader: any;

  constructor(
    private toastController: ToastController,
    private loadingController: LoadingController,
    private themeableBrowser: ThemeableBrowser
  ) {}

  showLoader = async (content?: string) => {
    if (!content) content = 'Загрузка...';
    this.loader = await this.loadingController.create({
      message: content
    });

    this.loader.present();
  }

  hideLoader = () => {
    setTimeout(async () => {
      if (this.loader) {
        return await this.loader.dismiss()
      }
      else return new Promise((resolve) => resolve());
    }, 300)

    setTimeout(() => {
      try {
        this.loader.dismiss()
      } catch (error) {

      }
    }, 1000)

    setTimeout(() => {
      try {
        this.loader.dismiss()
      } catch (error) {

      }
    }, 3000)
  }

  showToast = async (message: string, duration?: number, position?: 'top'|'bottom'|'middle') => {

    this.toast = await this.toastController.create({
      message,
      duration: duration || 3000,
      position: position || 'top',
    });
    this.toast.present();
  }

  openBrowser = (url: string) => {

    const options: ThemeableBrowserOptions = {
      toolbar: {
        height: 50,
        color: '#3451cbff',
      },
      closeButton: {
        wwwImage: 'assets/icon/close.png',
        wwwImageDensity: 2,
        align: 'left',
      },
      title: {
        color: '#ffffffff',
        staticText: 'Стать партнёром',
      },
      backButtonCanClose: true,
    };

    this.themeableBrowser.create(url, '_blank', options);
  }

  getCodeOptions = () => {
    const options: BarcodeScannerOptions = {
      formats: 'CODE_39,CODE_93,CODE_128,EAN_8,EAN_13'
    };
    return options
  }
}
