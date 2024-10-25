import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormaViajePage } from './forma-viaje.page';

const routes: Routes = [
  {
    path: '',
    component: FormaViajePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormaViajePageRoutingModule {}
