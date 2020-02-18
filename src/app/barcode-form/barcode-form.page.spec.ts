import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BarcodeFormPage } from './barcode-form.page';

describe('BarcodeFormPage', () => {
  let component: BarcodeFormPage;
  let fixture: ComponentFixture<BarcodeFormPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarcodeFormPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarcodeFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
