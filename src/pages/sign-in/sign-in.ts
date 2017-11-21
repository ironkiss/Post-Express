import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { IonicPage, NavController } from 'ionic-angular';

import { BarcodeFormPage } from '../barcode-form/barcode-form';

import { ToolsProvider } from '../../providers/tools/tools';
import { AuthProvider } from '../../providers/auth/auth';

import {
  ThemeableBrowser,
  ThemeableBrowserOptions } from '@ionic-native/themeable-browser';

@IonicPage()
@Component({
  selector: 'page-sign-in',
  templateUrl: 'sign-in.html',
})
export class SignInPage {
  public account: any = {
    login: <string> '',
    password: <string> ''
  };
  private signInForm: any;
  private formSubmited: boolean = false;

  constructor(
    public formBuilder: FormBuilder,
    private themeableBrowser: ThemeableBrowser,
    private navCtrl: NavController,
    private toolsPrvd: ToolsProvider,
    private authPrvd: AuthProvider
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

  public doSignIn(formData: any): void {
    this.formSubmited = true;
    if (formData.valid) {
      this.toolsPrvd.showLoader();
      this.authPrvd.signIn(
        formData.value.login,
        formData.value.password
      ).then(res => {
        this.toolsPrvd.hideLoader();
        this.navCtrl.setRoot(BarcodeFormPage);
      }).catch((err: any) => {
        this.toolsPrvd.hideLoader();
        console.error('authPrvd.signIn', err);
        this.toolsPrvd.showToast('Неверные данные для входа');
      });
    } else {
      this.authPrvd.showErrors(formData.controls);
    }
  }

  public becomePartner(): void {
    let url = 'http://post-express.eu/?do=feedback';

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
