import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListaPasajerosPageRoutingModule } from './lista-pasajeros-routing.module';

import { ListaPasajerosPage } from './lista-pasajeros.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListaPasajerosPageRoutingModule
  ],
  declarations: [ListaPasajerosPage]
})
export class ListaPasajerosPageModule {}
