import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CristalVidrioPageRoutingModule } from './cristal-vidrio-routing.module';

import { CristalVidrioPage } from './cristal-vidrio.page';
import { YouTubePlayerModule } from "@angular/youtube-player";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CristalVidrioPageRoutingModule,
    YouTubePlayerModule
  ],
  declarations: [CristalVidrioPage]
})
export class CristalVidrioPageModule {}
