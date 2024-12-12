import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListaPasajerosPage } from './lista-pasajeros.page';

describe('ListaPasajerosPage', () => {
  let component: ListaPasajerosPage;
  let fixture: ComponentFixture<ListaPasajerosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaPasajerosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
