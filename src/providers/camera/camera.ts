import { Injectable } from '@angular/core';

@Injectable()
export class CameraProvider {
  private maxHeight: number = null;

  constructor() {
    console.log('Hello CameraProvider Provider');
  }

  public getCameraSize(sizes: Array<any>): any {
    let constA = this.cutFloatNumber(this.getDeviceScreenСoefficient());
    let constB = null;
    let newSizes = [];
    let result = null;
    for (let item of sizes) {
    	if (item.width > item.height) {
    		constB = this.cutFloatNumber(item.width / item.height);
    		if (constB == constA && item.width < this.maxHeight) newSizes.push({
    			width: item.height,
    			height: item.width
        });
      } else if (item.width < item.height) {
    		constB = this.cutFloatNumber(item.height / item.width);
    		if (constB == constA && item.height < this.maxHeight)
          newSizes.push(item);
      }
    }
    if (newSizes.length > 0) {
      result = newSizes[0];
    }
    return result;
  }

  private getDeviceScreenСoefficient(): number {
    let width = document.documentElement.clientWidth;
    let height = document.documentElement.clientHeight;
    let result = null;

    if (width > height) {
      this.maxHeight = width * 3;
      result = width / height;
    } else if (width < height) {
      this.maxHeight = height * 3;
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
