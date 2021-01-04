import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../users/home/home.module').then(m => m.HomePageModule)
      },
      {
        path: 'saved',
        loadChildren: () => import('../users/saved/saved.module').then(m => m.SavedPageModule)
      },
      {
        path: 'followers',
        loadChildren: () => import('../users/followers/followers.module').then(m => m.FollowersPageModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('../users/profile/profile.module').then(m => m.ProfilePageModule)
      },
      {
        path: '',
        redirectTo: '/register',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/register',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
