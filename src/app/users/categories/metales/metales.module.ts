import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MetalesPageRoutingModule } from './metales-routing.module';

import { MetalesPage } from './metales.page';
import { YouTubePlayerModule } from "@angular/youtube-player";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MetalesPageRoutingModule,
    YouTubePlayerModule,
  ],
  declarations: [MetalesPage]
})
export class MetalesPageModule {}
