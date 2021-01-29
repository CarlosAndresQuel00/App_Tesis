import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TelasPageRoutingModule } from './telas-routing.module';

import { TelasPage } from './telas.page';

import { YouTubePlayerModule } from "@angular/youtube-player";
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TelasPageRoutingModule,
    YouTubePlayerModule
  ],
  declarations: [TelasPage]
})
export class TelasPageModule {}
