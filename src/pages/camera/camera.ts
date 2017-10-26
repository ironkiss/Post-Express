import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { FinishPage } from '../finish/finish';

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
  private photoTaken: string = null;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public cameraPreview: CameraPreview
  ) {}

  public takePhoto(): void {
    if (!this.photoTaken) {
      const pictureOpts = {
        width: 1280,
        height: 1280,
        quality: 95
      }

      this.cameraPreview.takePicture(pictureOpts).then(imageData => {
        console.log('cameraPreview.takePicture', imageData);
        this.photoTaken = imageData[0];
      }, err => {
        console.error('cameraPreview.takePicture', err);
      });
    } else {
      document.getElementsByTagName('ion-app')['0'].style.background = '#fff';
      this.navCtrl.push(FinishPage);
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CameraPage');
    this.cameraPreview.startCamera(this.cameraPreviewOpts).then((res: any) => {
      console.log('cameraPreview.startCamera', res);
      document.getElementsByTagName('ion-app')['0'].style.background = 'transparent';
    }).catch((err: any) => {
      console.error('cameraPreview.startCamera', err);
    });
  }

}
