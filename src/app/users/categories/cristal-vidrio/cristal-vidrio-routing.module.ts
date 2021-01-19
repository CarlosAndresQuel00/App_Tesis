import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CristalVidrioPage } from './cristal-vidrio.page';

const routes: Routes = [
  {
    path: '',
    component: CristalVidrioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CristalVidrioPageRoutingModule {}
