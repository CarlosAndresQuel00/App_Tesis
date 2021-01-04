
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
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
  },
  {
    path: 'follows',
    loadChildren: () => import('./users/follows/follows.module').then( m => m.FollowsPageModule)
  },
  {
    path: 'followers',
    loadChildren: () => import('./users/followers/followers.module').then( m => m.FollowersPageModule)
  },
  {
    path: 'publication',
    loadChildren: () => import('./users/publication/publication.module').then( m => m.PublicationPageModule)
  },
  {
    path: 'saved',
    loadChildren: () => import('./users/saved/saved.module').then( m => m.SavedPageModule)
  },
  {
    path: 'verify-email',
    loadChildren: () => import('./users/verify-email/verify-email.module').then( m => m.VerifyEmailPageModule)
  },
  {
    path: 'reset-password',
    loadChildren: () => import('./users/reset-password/reset-password.module').then( m => m.ResetPasswordPageModule)
  },
  {
    path: 'publication-modal',
    loadChildren: () => import('./users/modals/publication-modal/publication-modal.module').then( m => m.PublicationModalPageModule)
  },
  {
    path: 'new-publication',
    loadChildren: () => import('./users/new-publication/new-publication.module').then( m => m.NewPublicationPageModule)
  },
  {
    path: 'edit-publication/:id',
    loadChildren: () => import('./users/edit-publication/edit-publication.module').then( m => m.EditPublicationPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
