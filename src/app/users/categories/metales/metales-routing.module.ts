import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MetalesPage } from './metales.page';

const routes: Routes = [
  {
    path: '',
    component: MetalesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MetalesPageRoutingModule {}
