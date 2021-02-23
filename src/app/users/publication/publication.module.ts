import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PublicationPageRoutingModule } from './publication-routing.module';

import { PublicationPage } from './publication.page';
import { YouTubePlayerModule } from "@angular/youtube-player";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PublicationPageRoutingModule,
    YouTubePlayerModule
  ],
  declarations: [PublicationPage]
})
export class PublicationPageModule {}
