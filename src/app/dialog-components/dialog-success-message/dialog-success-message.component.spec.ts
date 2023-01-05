import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSuccessMessageComponent } from './dialog-success-message.component';

describe('DialogSuccessMessageComponent', () => {
  let component: DialogSuccessMessageComponent;
  let fixture: ComponentFixture<DialogSuccessMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogSuccessMessageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogSuccessMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
