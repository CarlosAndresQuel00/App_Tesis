import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PublicationModalPageRoutingModule } from './publication-modal-routing.module';

import { PublicationModalPage } from './publication-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PublicationModalPageRoutingModule
  ],
  declarations: [PublicationModalPage]
})
export class PublicationModalPageModule {}
