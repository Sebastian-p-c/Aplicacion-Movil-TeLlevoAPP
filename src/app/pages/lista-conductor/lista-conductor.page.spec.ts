import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListaConductorPage } from './lista-conductor.page';

describe('ListaConductorPage', () => {
  let component: ListaConductorPage;
  let fixture: ComponentFixture<ListaConductorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaConductorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
