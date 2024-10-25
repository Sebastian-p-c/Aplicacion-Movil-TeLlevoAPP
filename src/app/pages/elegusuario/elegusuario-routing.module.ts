import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ElegusuarioPage } from './elegusuario.page';

const routes: Routes = [
  {
    path: '',
    component: ElegusuarioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ElegusuarioPageRoutingModule {}
