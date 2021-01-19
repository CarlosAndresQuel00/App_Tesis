import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PapelCartonPage } from './papel-carton.page';

const routes: Routes = [
  {
    path: '',
    component: PapelCartonPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PapelCartonPageRoutingModule {}
