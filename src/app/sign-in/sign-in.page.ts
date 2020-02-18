import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// import { BarcodeFormPage } from '../barcode-form/barcode-form';

import { ToolsService } from '../tools.service';
import { AuthService } from '../auth.service';

import {
  ThemeableBrowser,
  ThemeableBrowserOptions } from '@ionic-native/themeable-browser/ngx';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage {
  account: any = {
    login: <string> '', //'000',
    password: <string> '', //'test000'
  };
  signInForm: any;
  formSubmited: boolean = false;

  constructor(
    public formBuilder: FormBuilder,
    private themeableBrowser: ThemeableBrowser,
    private toolsService: ToolsService,
    private authService: AuthService,
    private router: Router
  ) {
    this.signInForm = formBuilder.group({
		  'login' : [
        null,
        Validators.compose([
          Validators.required,
          // Validators.minLength(5),
          // Validators.maxLength(30),
        ])
      ],
		  'password': [
        null,
        Validators.compose([
          Validators.required,
          // Validators.minLength(6),
          // Validators.maxLength(30),
        ])
      ]
		})
  }

  doSignIn = (formData: any) => {
    this.formSubmited = true;

    console.log('formData', formData)

    if (formData.valid) {
      this.toolsService.showLoader();
      this.authService.signIn(
        formData.value.login,
        formData.value.password
      ).then(() => {
        this.toolsService.hideLoader();
        this.router.navigate(['/barcode-form'], { replaceUrl: true });
      }).catch((err: any) => {
        this.toolsService.hideLoader();
        console.error('authPrvd.signIn', err);
        this.toolsService.showToast('Неверные данные для входа');
      });
    } else {
      this.authService.showErrors(formData.controls);
    }
  }

  becomePartner = () => {
    const url = 'http://post-express.eu/?do=feedback';

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

}
