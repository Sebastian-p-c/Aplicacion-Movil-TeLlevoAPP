import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListaConductorPage } from './lista-conductor.page';

const routes: Routes = [
  {
    path: '',
    component: ListaConductorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListaConductorPageRoutingModule {}
