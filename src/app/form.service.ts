import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams }   from '@angular/common/http';

import { ToolsService } from './tools.service';
import { APIService } from './api.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor(
    private toolsService: ToolsService,
    private apiService: APIService,
    private authService: AuthService,
    private http: HttpClient
  ) {}

  getCountryName = (countryId: string) => {
    const countries = {
      '2': 'Россия',
      '3': 'Казахстан',
      '9': 'Украина',
    }

    return countries[countryId]
  }

  getCost = (data: any): Promise<any> => new Promise((resolve, reject) => {
    this.apiService.post('calculate', data).then(({ data: res, status, error }: any) => {
      console.log('calculate', res, status, error)
      resolve(res);
    }, (err: any) => reject());
  });

  sendForm = (formData: any, pickUpResult?: any): Promise<any> => new Promise((resolve, reject) => {
    formData = {
      ...formData,
      pickUpResult
    }
    this.apiService.post('barcode', formData).then(({ data }: any) => {
      resolve(data);
    }, (err: any) => {
      this.errorsAction(err).then(() => reject({ canDoAction: true }))
        .catch(() => reject());
    });
  });

  validateBarcode = (barcode: string): Promise<any> => new Promise((resolve, reject) => {
    this.apiService.post('validate_barcode', {
      barcode
    }).then(({ data }: any) => {
      resolve(data);
    }, (err: any) => reject(err));
  });

  checkValidation = (formData: any, showToast?: boolean): Promise<any> => new Promise((resolve, reject) => {
    let errorText: string = null;
    if (!formData.barcode) {
      errorText = 'Просканируйте пожалуйста код';
    } else if (!formData.country) {
      errorText = 'Выберите страну';
    } else if (!formData.weight) {
      errorText = 'Введите вес';
    } else {
      resolve();
    }

    if (errorText) {
      if (showToast) this.toolsService.showToast(errorText);
      reject();
    }
  });

  formatDHLRequestData = ({ barcode, date, user, receiverAddress }) => {
    const address: any = {}

    try {
      user.xfields.split('||').forEach(item => {
          var field = item.split('|')
          address[field[0]] = field[1]
      })
      console.log('address', address)
    } catch (error) {
      console.log('formatDHLRequestData', error)
      return JSON.stringify(error)
    }

    if (!address.str || !receiverAddress.str) {
      return {
        error: 'Отсутствует название улицы, обратитесь к администратору'
      }
    }

    if (!address.haus || !receiverAddress.haus) {
      return {
        error: 'Отсутствует номер дома, обратитесь к администратору'
      }
    }

    if (!address.plz || !receiverAddress.plz) {
      return {
        error: 'Отсутствует PLZ код, обратитесь к администратору'
      }
    }

    if (!address.stadt || !receiverAddress.stadt) {
      return {
        error: 'Отсутствует название города, обратитесь к администратору'
      }
    }

    return {
      pickupDetails: {
        billingNumber: receiverAddress.billingNumber, // в данном поле будет указываться номер счёта, который предоставит получатель, это данные, которые будут предоставляться вместе с токеном. Его нужно будет брать из БД.
        shipmentCount: 1,
        shipmentIdentifiers: [barcode],
        customerReference: barcode, // Сюда заносить номер ШПИ, который сканируем (CJ001002003RU)
        pickupDate: {
          date // дата, когда будет пикап, эту дату приёмные пункты выбирают в календаре и она также должна заноситься вместе с посылкой в бд
        },
        pickupServices: {
          isBulkyGood: false,
          hasLabel: true
        }
      },
      pickupAddress: {
        name1: user.fullname, // это данные приёмного пункта, данные из Бд, Название приёмного пункта
        nativeAddress: {
          streetName: address.str, // улица приёмного пункта
          houseNumber: address.haus, // номер дома приёмного пункта
          zip: address.plz, // почтовый индекс приёмного пункта
          city: address.stadt, // город пиёмного пункта
          country: {
            countryISOCode: "DE",
            country: "Deutschland"
          }
        }
      },
      receiverAddress: {
        name1: receiverAddress.name, // Имя получателя. Эти данные из БД, вместе с номером счёта и токеном. И зависеть будут от выбранных ностоек приёмного пункта
        nativeAddress: {
          streetName: receiverAddress.str, // улица получателя
          houseNumber: receiverAddress.haus, // номер дома получателя
          zip: receiverAddress.plz, // индекс получателя
          city: receiverAddress.stadt, //город получателя
          country: {
            countryISOCode: "DE",
            country: "Deutschland"
          }
        }
      }
    }
  }

  getReceiverAddress = (pickUpId): Promise<any> => new Promise((resolve, reject) => {
    this.apiService.post('get_receiver_address', {
      address_id: String(pickUpId)
    }).then(({ data }: any) => {
      resolve(data);
    }, (err: any) => reject(err));
  })

  sendDHLrequest = (data, receiverAddress) => new Promise((resolve, reject) => {
    const url = 'https://cig.dhl.de/services/production/rest'
    const options = {
      headers: {
        'DPDHL-User-Authentication-Token': btoa(`${receiverAddress['dpdhl-username']}:${receiverAddress['dpdhl-password']}`),
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Basic ${btoa(`${receiverAddress.login}:${receiverAddress.pw}`)}`,
        'cache-control': 'no-cache'
      }
    }
    const body = new FormData();
    for (const key of Object.keys(data)) {
      body.append(key, data[key])
    }
    console.log('body', JSON.stringify(data), options)

    this.http.post(`${url}/pick-up/`, data, options).subscribe((data: any) => {
      resolve(data);
    }, (err: any) => reject(err));
  })

  private errorsAction(err: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (err && (err.status == 401 || err.status == 498)) {
        console.log('err.status', err.status);
        this.toolsService.showToast('Время сессии вышло, пожалуйста залогиньтесь еще раз.', 5000);
        this.authService.logOut();
        reject()
      } else {
        resolve();
      }
    });
  }
}
