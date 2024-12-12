import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListaConductorPageRoutingModule } from './lista-conductor-routing.module';

import { ListaConductorPage } from './lista-conductor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListaConductorPageRoutingModule
  ],
  declarations: [ListaConductorPage]
})
export class ListaConductorPageModule {}
