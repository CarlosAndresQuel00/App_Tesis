
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './services/auth-guard.service';
import { NoLoginGuard } from './services/no-login-guard.service';


const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'login',
    loadChildren: () => import('./users/login/login.module').then( m => m.LoginPageModule),
    canActivate : [NoLoginGuard]
  },
  {
    path: 'home',
    loadChildren: () => import('./users/home/home.module').then( m => m.HomePageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'register',
    loadChildren: () => import('./users/register/register.module').then( m => m.RegisterPageModule),
    canActivate : [NoLoginGuard]
  },
  {
    path: 'profile-settings',
    loadChildren: () => import('./users/profile-settings/profile-settings.module').then( m => m.ProfileSettingsPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'profile',
    loadChildren: () => import('./users/profile/profile.module').then( m => m.ProfilePageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'notifications',
    loadChildren: () => import('./users/notifications/notifications.module').then( m => m.NotificationsPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'user-profile/:id',
    loadChildren: () => import('./users/user-profile/user-profile.module').then( m => m.UserProfilePageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'follows',
    loadChildren: () => import('./users/follows/follows.module').then( m => m.FollowsPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'followers',
    loadChildren: () => import('./users/followers/followers.module').then( m => m.FollowersPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'publication/:id',
    loadChildren: () => import('./users/publication/publication.module').then( m => m.PublicationPageModule)
  },
  {
    path: 'saved',
    loadChildren: () => import('./users/saved/saved.module').then( m => m.SavedPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'reset-password',
    loadChildren: () => import('./users/reset-password/reset-password.module').then( m => m.ResetPasswordPageModule)
  },
  {
    path: 'edit-publication/:id',
    loadChildren: () => import('./users/edit-publication/edit-publication.module').then( m => m.EditPublicationPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'report',
    loadChildren: () => import('./users/modals/report/report.module').then( m => m.ReportPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'papel-carton',
    loadChildren: () => import('./users/categories/papel-carton/papel-carton.module').then( m => m.PapelCartonPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'cristal-vidrio',
    loadChildren: () => import('./users/categories/cristal-vidrio/cristal-vidrio.module').then( m => m.CristalVidrioPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'metales',
    loadChildren: () => import('./users/categories/metales/metales.module').then( m => m.MetalesPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'plastico',
    loadChildren: () => import('./users/categories/plastico/plastico.module').then( m => m.PlasticoPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'otros',
    loadChildren: () => import('./users/categories/otros/otros.module').then( m => m.OtrosPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'telas',
    loadChildren: () => import('./users/categories/telas/telas.module').then( m => m.TelasPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'comments',
    loadChildren: () => import('./users/modals/comments/comments.module').then( m => m.CommentsPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'new-publication',
    loadChildren: () => import('./users/modals/new-publication/new-publication.module').then( m => m.NewPublicationPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'slides',
    loadChildren: () => import('./slides/slides.module').then( m => m.SlidesPageModule)
  },
  {
    path: 'about',
    loadChildren: () => import('./about/about.module').then( m => m.AboutPageModule)
  },
  {
    path: 'help',
    loadChildren: () => import('./help/help.module').then( m => m.HelpPageModule)
  },
  {
    path: 'guide',
    loadChildren: () => import('./users/guide/guide.module').then( m => m.GuidePageModule)
  },

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
