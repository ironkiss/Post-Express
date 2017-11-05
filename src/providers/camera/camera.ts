import { Injectable } from '@angular/core';

@Injectable()
export class CameraProvider {
  private maxHeight: number = null;

  public getCameraSize(sizes: Array<any>): any {
    let screenCoff = this.cutFloatNumber(this.getDeviceScreenСoefficient());
    let newSizes = [];
    let result = null;
    for (let item of sizes) {
    	if (item.width > item.height && item.width < this.maxHeight) {
        newSizes.push({
    			width: item.width / screenCoff,
    			height: item.width
        });
      } else if (item.width < item.height && item.height < this.maxHeight) {
        newSizes.push({
    			width: item.width,
    			height: item.height / screenCoff
        });
      }
    }

    if (newSizes.length > 0) {
      result = newSizes.reduce((l, e) => e.width > l.width ? e : l);
    } else {
      result = sizes.reduce((l, e) => e.width > l.width ? e : l);
    }

    return result;
  }

  private getDeviceScreenСoefficient(): number {
    let width = document.documentElement.clientWidth;
    let height = document.documentElement.clientHeight;
    let result = null;

    if (width > height) {
      this.maxHeight = width * window.devicePixelRatio;
      result = width / height;
    } else if (width < height) {
      this.maxHeight = height * window.devicePixelRatio;
      result = height / width;
    } else {
      result = 1;
    }

    return result;
  }

  private cutFloatNumber(value: number): number {
    try {
      let n = value.toString().split('.');
      let f = n[0];
      let s = n[1];
      s = s.substring(0, 1);
      return Number(`${f}.${s}`);
    } catch (e) {
      return null;
    }
  }

}
