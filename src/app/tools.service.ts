import { Injectable } from '@angular/core';
import { ToastController, LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToolsService {
  private toast: any;
  private loader: any;

  constructor(
    private toastController: ToastController,
    private loadingController: LoadingController
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
}
