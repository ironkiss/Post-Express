import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

import { ToolsService } from '../tools.service';
import { CameraService } from '../camera.service';
import { FormService } from '../form.service';

import { CameraPreviewOptions, CameraPreview } from '@ionic-native/camera-preview/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

import * as moment from 'moment';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.page.html',
  styleUrls: ['./camera.page.scss'],
})
export class CameraPage {
  cameraPreviewOpts: CameraPreviewOptions = {
    x: 0,
    y: 0,
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientWidth / 0.75,
    camera: 'rear',
    tapPhoto: false,
    previewDrag: true,
    toBack: true,
    alpha: 1
  };
  pictureOpts: any = {}
  imageContainer: any = {
    width: '100%',
    height: '100%'
  }
  photoTaken: string = '';
  formData: any = {};
  pickUpData: any = null;
  pickUpDate: string = null;
  cost: any = {};
  approved: boolean = false

  constructor(
    private navController: NavController,
    private cameraPreview: CameraPreview,
    private toolsService: ToolsService,
    private cameraService: CameraService,
    private formService: FormService,
    private camera: Camera,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe(params => {
      if (params) {
        this.formData = params.formData || {};
        this.pickUpData = params.pickUpData || null;
        this.cost = params.cost || {};

        console.log('this.pickUpData', this.pickUpData)

        const pickUpDate = this.pickUpData
          && this.pickUpData.formData
          && this.pickUpData.formData.pickupDetails
          && this.pickUpData.formData.pickupDetails.pickupDate
          && this.pickUpData.formData.pickupDetails.pickupDate.date

        if (pickUpDate) {
          this.pickUpDate = moment(pickUpDate).format('DD.MM.YYYY')
        }
      }
    });
  }

  public cancelPhoto(): void {
    this.photoTaken = null;
  }

  takePhoto = () => {
    
    if (!this.photoTaken) {
      this.toolsService.showLoader();
      console.log('pictureOpts', this.pictureOpts)
      this.cameraPreview.takeSnapshot(this.pictureOpts).then((imageData: any[]) => {
        console.log('imageData', imageData)
        this.photoTaken = imageData[0];
        setTimeout(() => {
          this.toolsService.hideLoader();
        }, 500);
      }, err => {
        this.toolsService.hideLoader();
        console.error('cameraPreview.takePicture', err);
        if (err === 'cordova_not_available') {
          this.photoTaken = 'test';
        }
      });
    } else {
      this.goForward()
    }
  }

  

  cancelForm = () => {
    this.navController.navigateRoot('/barcode-form');
  }

  approvePhoto = () => {
    if (!this.approved) {
      this.approved = true
      return
    }
  }

  goForward = async () => {
    this.formData.image = this.photoTaken;
    this.toolsService.showLoader();

    try {
      let pickUpResult
      if (this.pickUpData) {
        const { formData, receiverAddress } = this.pickUpData
        pickUpResult = await this.formService.sendDHLrequest(formData, receiverAddress)
      }

      const res = await this.formService.sendForm(this.formData, pickUpResult)

      this.openFinishPage('success', res, pickUpResult);

      this.stopCamera()
    } catch (error) {
      console.error('formPrvd.sendForm', error);
      
      if (error && error.canDoAction) this.openFinishPage('error', error);
    } finally {
      setTimeout(() => {
        this.toolsService.hideLoader();
      }, 1000)
    }
  }

  private openFinishPage(status: string, result: any, pickUpResult?: any): void {
    this.navController.navigateRoot('/finish', {
      queryParams: {
        formData: this.formData,
        status,
        result,
        pickUpResult
      }
    });
  }

  private changeBackground(bgColor: string): void {
    try {
      document.getElementsByTagName('app-camera')['0'].style.background = bgColor === 'transparent' ? bgColor : null;
      document.getElementsByTagName('body')['0'].style.background = bgColor === 'transparent' ? bgColor : null;
      document.getElementsByTagName('ion-app')['0'].style.background = bgColor;
    } catch (e) { console.error('changeBackground', e) }
  }

  private startCamera(): void {
    this.cameraPreview.startCamera(this.cameraPreviewOpts).then(() => {
      setTimeout(() => this.toolsService.hideLoader(), 1000)

      this.pictureOpts = {
        width: 960,
        height: 1280,
        quality: 100,
      }

    }).catch((err: any) => {
      console.error('cameraPreview.startCamera', err);
      setTimeout(() => this.toolsService.hideLoader(), 1000)
    });
  }

  private stopCamera = () => {
    this.cameraPreview.stopCamera().then(() => {
      console.log('Camera successfully stopped!');
      this.changeBackground('#fff');
    }).catch((err: any) => console.error('Error with stopping camera', err));
  }

  /*
   * Runs when the page is about to enter and become the active page.
   */
  ionViewWillEnter() {
    // this.toolsService.showLoader();
    this.changeBackground('transparent');
    this.startCamera();
  }

  /*
   * Runs when the page is about to leave and no longer be the active page.
   */
  ionViewWillLeave() {
    this.stopCamera()
  }

}
