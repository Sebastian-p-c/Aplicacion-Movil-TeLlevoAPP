import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ElegusuarioPage } from './elegusuario.page';

describe('ElegusuarioPage', () => {
  let component: ElegusuarioPage;
  let fixture: ComponentFixture<ElegusuarioPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ElegusuarioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
