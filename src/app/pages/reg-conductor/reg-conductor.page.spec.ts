import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegConductorPage } from './reg-conductor.page';

describe('RegConductorPage', () => {
  let component: RegConductorPage;
  let fixture: ComponentFixture<RegConductorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegConductorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
