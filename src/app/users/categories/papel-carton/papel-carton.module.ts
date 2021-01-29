import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PapelCartonPageRoutingModule } from './papel-carton-routing.module';

import { PapelCartonPage } from './papel-carton.page';
import { YouTubePlayerModule } from "@angular/youtube-player";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PapelCartonPageRoutingModule,
    YouTubePlayerModule
  ],
  declarations: [PapelCartonPage]
})
export class PapelCartonPageModule {}
