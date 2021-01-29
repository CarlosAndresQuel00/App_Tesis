import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlasticoPageRoutingModule } from './plastico-routing.module';

import { PlasticoPage } from './plastico.page';
import { YouTubePlayerModule } from "@angular/youtube-player";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlasticoPageRoutingModule,
    YouTubePlayerModule
  ],
  declarations: [PlasticoPage]
})
export class PlasticoPageModule {}
