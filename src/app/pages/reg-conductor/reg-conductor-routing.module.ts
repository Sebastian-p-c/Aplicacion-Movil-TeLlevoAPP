import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegConductorPage } from './reg-conductor.page';

const routes: Routes = [
  {
    path: '',
    component: RegConductorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegConductorPageRoutingModule {}
