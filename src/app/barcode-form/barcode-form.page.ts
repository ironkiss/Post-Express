import { Component, ViewChild, ElementRef } from '@angular/core';

import { NavController, AlertController, Platform, LoadingController } from '@ionic/angular';

import { FormService } from '../form.service';
import { ToolsService } from '../tools.service';
import { UserService } from '../user.service';

import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

import * as moment from 'moment';

@Component({
  selector: 'app-barcode-form',
  templateUrl: './barcode-form.page.html',
  styleUrls: ['./barcode-form.page.scss'],
})
export class BarcodeFormPage  {

  canSubmit: boolean = true;
  formData: any = {
    barcode: <string> '',
    country: <number> null,
    weight: <number> null,
    date: null
  };
  cost: any = {};
  minDate = null
  maxDate = null
  pickUp = null
  fromDate = null
  availableDates = []
  selectedDate = ''
  userWantPickUp = true
  pageStep = 0

  @ViewChild('weightInput', { static: false }) weightInputRef: ElementRef;

  constructor(
    public alertController: AlertController,
    public platform: Platform,
    private barcodeScanner: BarcodeScanner,
    private formService: FormService,
    private toolsService: ToolsService,
    private navController: NavController,
    private userService: UserService,
    private loadingController: LoadingController
  ) {
    this.formatDates()
  }

  formatDates = () => {
    if (moment(this.minDate).day() === 0) {
      this.minDate = moment().add(2, 'days').format('YYYY-MM-DD')
    } else if (moment(this.minDate).day() === 6) {
      this.minDate = moment().add(3, 'days').format('YYYY-MM-DD')
    } else {
      this.minDate = moment().add(1, 'days').format('YYYY-MM-DD')
    }

    this.maxDate = moment().add(90, 'days').format('YYYY-MM-DD')

    const a = moment(this.minDate);
    const b = moment(this.maxDate);

    const availableDates = []

    // If you want an exclusive end date (half-open interval)
    for (const m = moment(a); m.diff(b, 'days') <= 0; m.add(1, 'days')) {
      if (m.day() !== 0 && m.day() !== 6) {
        const date = m.format('YYYY-MM-DD')
        
        availableDates.push(new Date(date))
      }
    }
    
    this.fromDate = new Date(moment(this.minDate).format('YYYY-MM') + '-01')
    this.minDate = new Date(this.minDate)
    this.maxDate = new Date(this.maxDate)

    setTimeout(() => {
      this.availableDates = [...availableDates]
    })
  }

  setBarcode = (barcode: string) => {
    this.formData.barcode = barcode
    this.pageStep = 1
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
          console.log('countryId', countryId, item[0], countries[countryId])
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
          country: Number(this.formData.country),
          weight: Number(this.formData.weight)
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

  sendForm = async () => {
    console.log('sendForm')

    if (this.pageStep === 1 || this.pageStep === 2) {
      console.log('this.formData.weight && this.pickUp && !this.selectedDate && this.userWantPickUp',
      this.formData.weight, this.pickUp, !this.selectedDate, this.userWantPickUp)
      if (!this.formData.weight) {
        this.toolsService.showToast('Введите вес')
        return
      } else if (this.formData.weight && this.pickUp && !this.selectedDate && this.userWantPickUp && this.pageStep === 1) {
        this.pageStep = 2
        this.selectedDate = moment(new Date(this.minDate)).format('YYYY-MM-DD')
        return
      }
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
            pickUpData,
            cost: this.cost,
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
    const options = this.toolsService.getCodeOptions()
    this.barcodeScanner.scan(options).then((barcodeData: any) => {
      const barcode = barcodeData.cancelled ?
        null : barcodeData.text;

      if (barcode) {
        this.setBarcode(barcode)
        this.toolsService.showLoader()
        this.formService.validateBarcode(barcode).then(res => {
          console.log('res', res)
          if (res && res.status == 'success') {
            this.formData.country = res.country_id;
            this.getPickUpDetails(res.country_id)
            setTimeout(() => {
              this.weightInputRef.nativeElement.focus()
            }, 2000)
          }
          this.toolsService.hideLoader()
        }).catch(({ error }) => {
          console.error('formService.validateBarcode', error);
          if (error && error.status == 'error' && error.message) {
            this.toolsService.showToast(error.message);
          }
          this.toolsService.hideLoader()
          this.onCancel()
        })
      } else {
        this.toolsService.hideLoader()
        this.onCancel()
        // this.setBarcode('CJ026058802RU')
        // this.formData.country = '2'
        // this.getPickUpDetails(this.formData.country)
      }
    }, (error: any) => {
      console.log('barcodeScanner', error)
      if (error === 'cordova_not_available') {
        this.setBarcode('CJ026058802RU')
        this.formData.country = '2'
        this.getPickUpDetails(this.formData.country)
      }
      this.toolsService.hideLoader()
    });
  }

  onSelectDate = (date) => {
    this.selectedDate = this.checkDate(date)
    console.log('selectedDate', this.selectedDate)
    this.userWantPickUp = true
  }

  onCancelCalendar = () => {
    this.userWantPickUp = false
    this.sendForm()
  }

  onCancel = () => {
    this.navController.navigateRoot('/start');
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
