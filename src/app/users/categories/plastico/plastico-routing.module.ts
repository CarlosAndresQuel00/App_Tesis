import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlasticoPage } from './plastico.page';

const routes: Routes = [
  {
    path: '',
    component: PlasticoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlasticoPageRoutingModule {}
