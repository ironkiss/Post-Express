import { Component } from '@angular/core';

import { NavController, AlertController } from '@ionic/angular';

import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

import { AuthService } from '../auth.service';
import { UserService } from '../user.service';
import { ToolsService } from '../tools.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
})
export class StartPage {
  loginData: any = {
    name: '',
    fullname: '',
    address: '',
    phoneNumber: ''
  }
  logoSrc = ''
  signatureText = ''

  constructor(
    private alertController: AlertController,
    private navController: NavController,
    private authService: AuthService,
    private userService: UserService,
    private toolsService: ToolsService,
    private barcodeScanner: BarcodeScanner,
  ) {
    this.getUserData()
  }

  getUserData = async () => {
    const user = await this.userService.getUserData()

    // this.logoSrc = 'http://post-express.eu/uploads/fotos/foto_25.jpg'

    if (!user) {
      this.authService.signOut().then(res => {
        this.navController.navigateRoot('/sign-in');
      })
      return
    }

    this.logoSrc = user.foto ? 'http:' + user.foto : 'assets/icon/logo.png'
    this.signatureText = user.signature || ''

    this.loginData.name = user.name
    this.loginData.fullname = user.fullname

    const address: any = {}

    user.xfields.split('||').forEach(item => {
      const splited = item.split('|')
      console.log('splited', splited)
      switch (splited[0]) {
        case 'str':
        case 'haus':
        case 'plz':
        case 'stadt':
          address[splited[0]] = splited[1]
        break;
        case 'tel':
          this.loginData.phoneNumber = splited[1]
        break;

      }
    })

    if (!address.str && !address.haus && !address.plz && !address.stadt) {
      this.loginData.address = ''
      return
    }
    
    this.loginData.address = `${address.str || ''} ${address.haus || ''}, ${address.plz || ''} ${address.stadt || ''}`
  }

  startScaner = () => {
    this.navController.navigateRoot('/barcode-form');
  }

  leaveFeedback = () => {
    const url = 'http://post-express.eu/?do=feedback&template=card&mailtemplate=bestellen&agent=' + this.loginData.name;
    this.toolsService.openBrowser(url, 'Расходный материал')
  }

  tracking = async () => {
    const openBrowser = (track: string) => {
      const url = 'http://post-express.eu/?do=tracking&track=' + track;
      this.toolsService.openBrowser(url, 'Отследить посылку')
    }

    const alert = await this.alertController.create({
      header: 'Отследить посылку',
      inputs: [
        {
          name: 'trackCode',
          type: 'text',
          id: 'trackCode',
          value: '',
          placeholder: 'Введите код'
        },
      ],
      buttons: [
        {
          text: 'Найти посылку',
          handler: (event) => {
            if (!event.trackCode || event.trackCode && event.trackCode.length < 10) {
              this.toolsService.showToast('Длина кода должна быть больше 10 символов')
              return
            }
            openBrowser(event.trackCode)
          }
        },
        {
          text: 'Сканировать ШПИ-код',
          handler: () => {
            const options = this.toolsService.getCodeOptions()
            this.barcodeScanner.scan(options).then((barcodeData: any) => {
              const barcode = barcodeData.cancelled ?
                null : barcodeData.text;
        
              if (barcode) {
                openBrowser(barcode)
              } else {
                this.tracking()
              }
            }, () => {
              this.tracking()
            });
          }
        },
        {
          text: 'Отменить',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }
      ]
    });

    await alert.present();
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

  async ionViewWillEnter() {
    try {
      await this.authService.getUserData()
      this.getUserData()
    } catch (error) {
      console.log(error)
      this.navController.navigateRoot('/sign-in')
    }
  }

}
