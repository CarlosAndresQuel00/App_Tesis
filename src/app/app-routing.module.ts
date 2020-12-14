import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },  {
    path: 'login',
    loadChildren: () => import('./users/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./users/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'profile-settings',
    loadChildren: () => import('./users/profile-settings/profile-settings.module').then( m => m.ProfileSettingsPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./users/profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./users/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'notifications',
    loadChildren: () => import('./users/notifications/notifications.module').then( m => m.NotificationsPageModule)
  },
  {
    path: 'user-profile',
    loadChildren: () => import('./users/user-profile/user-profile.module').then( m => m.UserProfilePageModule)
  }

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
