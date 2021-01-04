import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditPublicationPageRoutingModule } from './edit-publication-routing.module';

import { EditPublicationPage } from './edit-publication.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditPublicationPageRoutingModule
  ],
  declarations: [EditPublicationPage]
})
export class EditPublicationPageModule {}
