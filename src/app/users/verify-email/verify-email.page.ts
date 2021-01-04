import { AuthService } from './../../services/auth.service';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { UserInterface } from 'src/app/shared/user.interface';
import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.page.html',
  styleUrls: ['./verify-email.page.scss'],
})
export class VerifyEmailPage {

  // user$: Observable<UserInterface> = this.authSvc.fireAuth.user;

  constructor(private authSvc: AuthService, private router: Router, private navCtrl: NavController) { }
  regresar(){
    this.navCtrl.back();
  }
  /*async onSendEmail(): Promise<void> {
    try{
      await this.authSvc.sendVerificationEmail();
    }catch (error){
      console.log('Error->', error);
    }
  }

  OnDestroy(): void{
    this.authSvc.logout();
  }*/
}
