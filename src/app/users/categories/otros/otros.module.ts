import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OtrosPageRoutingModule } from './otros-routing.module';
import { YouTubePlayerModule } from "@angular/youtube-player";
import { OtrosPage } from './otros.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OtrosPageRoutingModule,
    YouTubePlayerModule
  ],
  declarations: [OtrosPage]
})
export class OtrosPageModule {}
