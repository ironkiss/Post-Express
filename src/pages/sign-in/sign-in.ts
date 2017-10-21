import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the SignInPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sign-in',
  templateUrl: 'sign-in.html',
})
export class SignInPage {
  public account: any = {
    login: '',
    password: ''
  };
  private signInForm: any;
  private formSubmited: boolean = false;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private formBuilder: FormBuilder
  ) {
    this.signInForm = formBuilder.group({
		  'login' : [
        null,
        Validators.compose([
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(50),
        ])
      ],
		  'password': [
        null,
        Validators.compose([
          Validators.required,
          Validators.minLength(6),
        ])
      ]
		})
  }

  public doSignIn(formData: any): void {
    console.log('doSignIn', formData);
    this.formSubmited = true;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignInPage');
  }

}
