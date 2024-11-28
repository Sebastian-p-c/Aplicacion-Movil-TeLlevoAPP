import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegConductorPageRoutingModule } from './reg-conductor-routing.module';

import { RegConductorPage } from './reg-conductor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegConductorPageRoutingModule
  ],
  declarations: [RegConductorPage]
})
export class RegConductorPageModule {}
