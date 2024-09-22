import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RestcontraPageRoutingModule } from './restcontra-routing.module';

import { RestcontraPage } from './restcontra.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RestcontraPageRoutingModule
  ],
  declarations: [RestcontraPage]
})
export class RestcontraPageModule {}
