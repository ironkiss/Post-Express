import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, Platform } from '@ionic/angular';

import { ToolsService } from '../tools.service';
import { FormService } from '../form.service';

@Component({
  selector: 'app-finish',
  templateUrl: './finish.page.html',
  styleUrls: ['./finish.page.scss'],
})
export class FinishPage {
  status: string = 'success';
  formData: any = {};
  result: any = {};
  pickUpResult: any = null
  isAndroid: boolean = false;

  constructor(
    private navController: NavController,
    private formService: FormService,
    private toolsService: ToolsService,
    private platform: Platform,
    private route: ActivatedRoute
  ) {
    this.isAndroid = this.platform.is('android');

    this.route.queryParams.subscribe(params => {
      if (params) {
        this.formData = params.formData || {};
        this.result = params.result || {};
        this.status = params.status || 'success';
        this.pickUpResult = params.pickUpResult || null
      }

      console.log('queryParams', this.formData, this.result, this.status)
    });
  }

  public tryAgain(): void {
    this.toolsService.showLoader();
    this.formService.sendForm(this.formData, this.pickUpResult).then((res: any) => {
      this.toolsService.hideLoader();
      this.status = 'success';
      this.result = res;
    }).catch((err: any) => {
      console.error('formPrvd.sendForm', err);
      this.toolsService.hideLoader();
      if (err && err.canDoAction) {
        this.status = 'error';
        this.result = err;
      }
    });
  }

  public exit(): void {
    // this.platform.exitApp();
  }

  public addNewCode(): void {
    this.navController.navigateRoot('/barcode-form');
  }

}
