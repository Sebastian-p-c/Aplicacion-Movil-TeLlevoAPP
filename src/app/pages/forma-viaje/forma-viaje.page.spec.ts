import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormaViajePage } from './forma-viaje.page';

describe('FormaViajePage', () => {
  let component: FormaViajePage;
  let fixture: ComponentFixture<FormaViajePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FormaViajePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
