import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RestcontraPage } from './restcontra.page';

describe('RestcontraPage', () => {
  let component: RestcontraPage;
  let fixture: ComponentFixture<RestcontraPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RestcontraPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
