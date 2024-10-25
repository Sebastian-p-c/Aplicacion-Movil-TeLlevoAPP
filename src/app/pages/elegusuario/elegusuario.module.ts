import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ElegusuarioPageRoutingModule } from './elegusuario-routing.module';

import { ElegusuarioPage } from './elegusuario.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ElegusuarioPageRoutingModule
  ],
  declarations: [ElegusuarioPage]
})
export class ElegusuarioPageModule {}
