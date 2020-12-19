import { AuthService } from './../../services/auth.service';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { User } from 'src/app/shared/user.interface';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.page.html',
  styleUrls: ['./verify-email.page.scss'],
})
export class VerifyEmailPage {

  user$: Observable<User> = this.authSvc.afAuth.user;

  constructor(private authSvc: AuthService, private router: Router) { }

  async onSendEmail(): Promise<void> {
    try{
      await this.authSvc.sendVerificationEmail();
    }catch (error){
      console.log('Error->', error);
    }
  }

  OnDestroy(): void{
    this.authSvc.logout();
  }
}
