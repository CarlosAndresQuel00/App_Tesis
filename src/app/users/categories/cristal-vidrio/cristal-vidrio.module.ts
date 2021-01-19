import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CristalVidrioPageRoutingModule } from './cristal-vidrio-routing.module';

import { CristalVidrioPage } from './cristal-vidrio.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CristalVidrioPageRoutingModule
  ],
  declarations: [CristalVidrioPage]
})
export class CristalVidrioPageModule {}
