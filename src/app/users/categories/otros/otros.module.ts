import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OtrosPageRoutingModule } from './otros-routing.module';
// import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player/ngx';
import { OtrosPage } from './otros.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OtrosPageRoutingModule,
    // YoutubeVideoPlayer
  ],
  declarations: [OtrosPage]
})
export class OtrosPageModule {}
