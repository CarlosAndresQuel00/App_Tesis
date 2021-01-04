import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewPublicationPageRoutingModule } from './new-publication-routing.module';

import { NewPublicationPage } from './new-publication.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewPublicationPageRoutingModule
  ],
  declarations: [NewPublicationPage]
})
export class NewPublicationPageModule {}
