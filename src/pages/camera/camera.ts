import { Component } from '@angular/core';
import { IonicPage, NavParams, App } from 'ionic-angular';

import { FinishPage } from '../finish/finish';

import { ToolsProvider } from '../../providers/tools/tools';
import { CameraProvider } from '../../providers/camera/camera';
import { FormProvider } from '../../providers/form/form';

import { CameraPreviewOptions, CameraPreview } from '@ionic-native/camera-preview';

@IonicPage()
@Component({
  selector: 'page-camera',
  templateUrl: 'camera.html',
})
export class CameraPage {
  private cameraPreviewOpts: CameraPreviewOptions = {
    x: 0,
    y: 0,
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight,
    camera: 'rear',
    tapPhoto: false,
    previewDrag: true,
    toBack: true,
    alpha: 1
  };
  private photoTaken: string = '';
  private formData: any = {};

  constructor(
    private app: App,
    private navParams: NavParams,
    private cameraPreview: CameraPreview,
    private toolsPrvd: ToolsProvider,
    private cameraPrvd: CameraProvider,
    private formPrvd: FormProvider
  ) {
    this.formData = this.navParams.get('formData');
  }

  public cancelPhoto(): void {
    this.photoTaken = null;
  }

  public takePhoto(): void {
    if (!this.photoTaken) {
      this.cameraPreview.getSupportedPictureSizes().then((sizes: any) => {
        let pictureOpts = this.cameraPrvd.getCameraSize(sizes) || {
          width: sizes[0].width,
          height: sizes[0].height
        };
        pictureOpts.quality = 100;

        this.toolsPrvd.showLoader();
        this.cameraPreview.takePicture(pictureOpts).then((imageData: any[]) => {
          this.photoTaken = imageData[0];
          setTimeout(() => {
            this.toolsPrvd.hideLoader();
          }, 500);
        }, err => {
          this.toolsPrvd.hideLoader();
          console.error('cameraPreview.takePicture', err);
        });
      }).catch((err: any) => console.error('getSupportedPictureSizes', err));
    } else {
      this.formData.image = this.photoTaken;
      this.toolsPrvd.showLoader();
      this.formPrvd.sendForm(this.formData).then((res: any) => {
        this.toolsPrvd.hideLoader();
        this.openFinishPage('success', res);
      }).catch((err: any) => {
        console.error('formPrvd.sendForm', err);
        this.toolsPrvd.hideLoader();
        if (err && err.canDoAction) this.openFinishPage('error', err);
      });
    }
  }

  private openFinishPage(status: string, result: any): void {
    this.app.getRootNav().setRoot(FinishPage, {
      formData: this.formData,
      status: status,
      result: result
    });
  }

  private changeBackground(bgColor: string): void {
    try {
      document.getElementsByTagName('ion-app')['0'].style.background = bgColor;
    } catch (e) { console.error('changeBackground', e) }

    this.startCamera();
  }

  private startCamera(): void {
    this.cameraPreview.startCamera(this.cameraPreviewOpts).then(() => {
      this.toolsPrvd.hideLoader();
    }).catch((err: any) => {
      console.error('cameraPreview.startCamera', err);
      this.toolsPrvd.hideLoader();
    });
  }

  /*
   * Runs when the page is about to enter and become the active page.
   */
  ionViewWillEnter() {
    this.toolsPrvd.showLoader();
    this.changeBackground('transparent');
  }

  /*
   * Runs when the page is about to leave and no longer be the active page.
   */
  ionViewWillLeave() {
    this.cameraPreview.stopCamera().then(() => {
      console.log('Camera successfully stopped!');
      this.changeBackground('#fff');
    }).catch((err: any) => console.error('Error with stopping camera', err));
  }

}
