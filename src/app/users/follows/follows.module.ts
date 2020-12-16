import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FollowsPageRoutingModule } from './follows-routing.module';

import { FollowsPage } from './follows.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FollowsPageRoutingModule
  ],
  declarations: [FollowsPage]
})
export class FollowsPageModule {}
