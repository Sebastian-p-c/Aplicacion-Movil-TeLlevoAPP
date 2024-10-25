import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormaViajePageRoutingModule } from './forma-viaje-routing.module';

import { FormaViajePage } from './forma-viaje.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormaViajePageRoutingModule
  ],
  declarations: [FormaViajePage]
})
export class FormaViajePageModule {}
