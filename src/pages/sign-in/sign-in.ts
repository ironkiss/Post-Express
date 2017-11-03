import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { BarcodeFormPage } from '../barcode-form/barcode-form';

import { ToolsProvider } from '../../providers/tools/tools';
import { AuthProvider } from '../../providers/auth/auth';

@IonicPage()
@Component({
  selector: 'page-sign-in',
  templateUrl: 'sign-in.html',
})
export class SignInPage {
  public account: any = {
    login: <string> 'test@qq.qq',
    password: <string> '123123123'
  };
  private signInForm: any;
  private formSubmited: boolean = false;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private formBuilder: FormBuilder,
    private toolsPrvd: ToolsProvider,
    private authPrvd: AuthProvider
  ) {
    this.signInForm = formBuilder.group({
		  'login' : [
        null,
        Validators.compose([
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(30),
        ])
      ],
		  'password': [
        null,
        Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(30),
        ])
      ]
		})
  }

  public doSignIn(formData: any): void {
    console.log('doSignIn', formData);
    this.formSubmited = true;

    if (formData.valid) {
      this.authPrvd.signIn(
        formData.value.login,
        formData.value.password
      ).then(res => {
        console.log('authPrvd.signIn', res);
        this.navCtrl.setRoot(BarcodeFormPage);
      }).catch((err: any) => {
        console.error('authPrvd.signIn', err);
      });
    } else {
      this.authPrvd.showErrors(formData.controls);
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignInPage');
  }

}
