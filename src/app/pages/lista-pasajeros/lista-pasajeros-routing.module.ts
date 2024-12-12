import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListaPasajerosPage } from './lista-pasajeros.page';

const routes: Routes = [
  {
    path: '',
    component: ListaPasajerosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListaPasajerosPageRoutingModule {}
