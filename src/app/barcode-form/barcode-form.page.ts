import { Component, ViewChild, ElementRef } from '@angular/core';

import { NavController, AlertController, Platform, LoadingController } from '@ionic/angular';

import { FormService } from '../form.service';
import { ToolsService } from '../tools.service';
import { AuthService } from '../auth.service';
import { UserService } from '../user.service';

import { BarcodeScanner,
  BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { DatePicker } from '@ionic-native/date-picker/ngx';

import * as moment from 'moment';

@Component({
  selector: 'app-barcode-form',
  templateUrl: './barcode-form.page.html',
  styleUrls: ['./barcode-form.page.scss'],
})
export class BarcodeFormPage  {

  canSubmit: boolean = true;
  buttonText: string = 'Сфотографировать квитанцию';
  formData: any = {
    barcode: <string> '',
    values: {
      value1: <boolean> false,
      value2: <boolean> false,
      value3: <boolean> false,
    },
    country: <number> null,
    weight: <number> null,
    date: null
  };
  cost: any = {};
  minDate = ''
  maxDate = ''
  pickUp = null
  selectedDate = ''
  userWantPickUp = true

  @ViewChild('weightInput', { static: false }) weightInputRef: ElementRef;

  constructor(
    public alertController: AlertController,
    private barcodeScanner: BarcodeScanner,
    private formService: FormService,
    private toolsService: ToolsService,
    private authService: AuthService,
    private navController: NavController,
    private keyboard: Keyboard,
    private platform: Platform,
    private datePicker: DatePicker,
    private userService: UserService,
    private loadingController: LoadingController
  ) {
    this.keyboard.onKeyboardDidShow().subscribe(() => {
      this.buttonText = 'Продолжить'
    })

    this.keyboard.onKeyboardShow().subscribe(() => {
      if (this.platform.is('ios')) {
        const statusBarHeight = window.getComputedStyle(document.documentElement).getPropertyValue('--ion-safe-area-top')
        const bodyHeight = document.body.offsetHeight
        const contentHeoght = document.getElementsByTagName('ion-content')[0].offsetHeight
        const footerHeight = document.getElementsByTagName('ion-footer')[0].offsetHeight

        const footerPadding = bodyHeight - contentHeoght + footerHeight - parseInt(statusBarHeight)
        document.getElementsByTagName('ion-footer')[0].style.paddingBottom = `${footerPadding}px`
      }
    })

    this.keyboard.onKeyboardWillHide().subscribe(() => {
      if (this.platform.is('ios')) {
        document.getElementsByTagName('ion-footer')[0].style.paddingBottom = '0px'
      }
    })

    this.keyboard.onKeyboardDidHide().subscribe(() => {
      this.buttonText = 'Сфотографировать квитанцию'
    })

    this.minDate = moment().add(1, 'days').format('YYYY-MM-DD')

    if (moment(this.minDate).day() === 6) {
      this.minDate = moment().add(3, 'days').format('YYYY-MM-DD')
    }

    if (moment(this.minDate).day() === 0) {
      this.minDate = moment().add(2, 'days').format('YYYY-MM-DD')
    }

    this.maxDate = moment().add(90, 'days').format('YYYY-MM-DD')
    // this.selectedDate = this.minDate

    // this.formData.barcode = 'CJ026058802RU'
    // this.formData.country = '2'
    // this.getPickUpDetails(this.formData.country)
  }

  getPickUpDetails = async (countryId: string) => {
    try {
      let { pickup } = await this.userService.getUserData()
      // pickup = 'RU|1'

      const countries = {
        '2': 'RU',
        '3': 'KZ',
        '9': 'UA',
      }

      if (pickup) {
        pickup.split('||').forEach(item => {
          item = item.split('|')
          if (item[0] === countries[countryId]) {
            this.pickUp = Number(item[1])
            return
          }
        })
      } else {
        this.pickUp = null
      }

    } catch (error) {
      console.log(error)
    }
  }

  public checkForm(type?: string): void {
    console.log('checkForm', type, this.formData.weight);
    if (type && (type == 'country' || type == 'weight')) {
      if (this.formData.country && this.formData.weight) {
        if (type !== 'weight') this.toolsService.showLoader();
        this.formService.getCost({
          country: this.formData.country,
          weight: this.formData.weight
        }).then((res: any) => {
          console.log('formService.getPrice', res);
          this.toolsService.hideLoader();
          this.cost = res;
        }).catch((err: any) => {
          console.error('formService.getPrice', err);
          this.toolsService.hideLoader();
        });
      }
    }

    this.formService.checkValidation(this.formData).then(() => {
      this.canSubmit = true;
    }).catch((err: any) => {
      console.error('formService.checkValidation', err)
      this.toolsService.hideLoader();
    });
  }

  sendForm = async (eventType?: string) => {
    console.log('sendForm')

    // TODO: fix ios
    if (eventType === 'blur') { // && !this.platform.is('ios')) {
      return
    }

    // this.selectedDate = this.checkDate(new Date(this.selectedDate))

    if (this.pickUp && !this.selectedDate && this.userWantPickUp) {
      this.openCalendar()
      // this.toolsService.showToast('Выберите дату для заказа курьера')
      return
    }

    const loader = await this.loadingController.create({
      message: 'Загрузка...'
    });

    try {
      await loader.present();
      await this.formService.checkValidation(this.formData, true)
      let pickUpData
      if (this.pickUp && this.userWantPickUp) {
        pickUpData = await this.formatAndSendFormData()
      }

      await loader.dismiss()

      if (this.cost.price === 'error') {
        this.toolsService.showToast(this.cost.message, 5000);
      } else {
        this.navController.navigateRoot('/camera', {
          queryParams: {
            formData: this.formData,
            pickUpData
          }
        });
      }
    } catch (error) {
      await loader.dismiss()
      console.error('formService.checkValidation', error)
    } finally {
      this.toolsService.hideLoader();
    }

  }

  public startScan(): void {
    let options: BarcodeScannerOptions = {
      formats: 'CODE_39,CODE_93,CODE_128,EAN_8,EAN_13'
    };
    // this.toolsService.showLoader()
    this.barcodeScanner.scan(options).then((barcodeData: any) => {
      const barcode = barcodeData.cancelled ?
        null : barcodeData.text;

      if (barcode) {
        this.formService.validateBarcode(barcode).then(res => {
          console.log('res', res)
          if (res && res.status == 'success') {
            this.formData.barcode = barcode;
            this.formData.country = res.country_id;
            this.getPickUpDetails(res.country_id)
            this.weightInputRef.nativeElement.focus()
          }
          this.toolsService.hideLoader()
        }).catch(({ error }) => {
          console.error('formService.validateBarcode', error);
          if (error && error.status == 'error' && error.message) {
            this.toolsService.showToast(error.message);
          }
          this.toolsService.hideLoader()
        })
      } else {
        this.toolsService.hideLoader()
      }
    }, (error: any) => {
      console.log('barcodeScanner', error)
      if (error === 'cordova_not_available') {
        this.formData.barcode = 'CJ026058802RU'
        this.formData.country = '2'
        this.getPickUpDetails(this.formData.country)
      }
      this.toolsService.hideLoader()
    });
  }

  openCalendar = () => {
    this.datePicker.show({
      date: this.minDate,
      minDate: new Date(),
      maxDate: this.maxDate,
      titleText: 'Выберите дату для заказа курьера',
      okText: 'Выбрать',
      doneButtonLabel: 'Выбрать',
      cancelText: 'Не забирать',
      cancelButtonLabel: 'Не забирать',
      allowOldDates: false,
      mode: 'date',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
    }).then(date => {
      this.selectedDate = this.checkDate(date)
      this.userWantPickUp = true
      if (this.selectedDate) {
        this.sendForm()
      }
      console.log('Got date: ', this.selectedDate)
    }).catch(error => {
      console.log('Error occurred while getting date: ', error)
      if (error === 'cancel') {
        this.userWantPickUp = false
      }
    });
  }

  signOut = async () => {
    const confirm = await this.alertController.create({
      header: 'Выход',
      message: 'Вы уверены, что хотите выйти?',
      buttons: [
        {
          text: 'Нет',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Да',
          handler: () => {
            this.authService.signOut().then(res => {
              this.navController.navigateRoot('/sign-in');
            }).catch((err: any) => {

            });
          }
        }
      ]
    });
    confirm.present();
  }

  private formatAndSendFormData() {
    return new Promise(async (resolve, reject) => {
      this.toolsService.showLoader()
      try {
        const user = await this.userService.getUserData()

        const { receiverAddress, status } = await this.formService.getReceiverAddress(this.pickUp)
  
        if (status === 'success' && receiverAddress && receiverAddress.type === 'DHL') {
          const requestParams = {
            barcode: this.formData.barcode,
            date: this.selectedDate,
            user,
            receiverAddress
          }
          if (requestParams.barcode === 'Wikipedia') {
            requestParams.barcode = 'CJ026058802RU'
          }

          const formData = this.formService.formatDHLRequestData(requestParams)

          // const result = await this.formService.sendDHLrequest(formData, receiverAddress)

          resolve({
            formData,
            receiverAddress
          })
          console.log('result', formData)
        } else {
          reject('receiver address error')
        }
      } catch (error) {
        console.log('error', error)
        reject(error)
      }

      this.toolsService.hideLoader()
    })
  }

  private checkDate(date: Date) {
    if (date instanceof Date) {
      const selectedDate = moment(new Date(date))
      if (!selectedDate.isAfter(moment().format('YYYY-MM-DD'), 'day')) {
        this.toolsService.showToast('Дата должна быть больше, чем сегодня')
        return ''
      } else if (selectedDate.day() === 6 || selectedDate.day() === 0) {
        this.toolsService.showToast('Выберите НЕ выходной день')
        return ''
      } else {
        return selectedDate.format('YYYY-MM-DD')
      }
    } else {
      return ''
    }
  }

  ionViewWillEnter() {
    this.startScan()
  }

}
