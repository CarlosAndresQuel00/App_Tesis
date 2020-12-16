import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FollowsPage } from './follows.page';

const routes: Routes = [
  {
    path: '',
    component: FollowsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FollowsPageRoutingModule {}
