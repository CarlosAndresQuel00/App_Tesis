import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PublicationModalPage } from './publication-modal.page';

const routes: Routes = [
  {
    path: '',
    component: PublicationModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PublicationModalPageRoutingModule {}
