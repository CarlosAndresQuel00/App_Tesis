import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {

  constructor(private authSvc: AuthService, private router: Router) { }

  ngOnInit() {
  }

  async onResetPassword(email){
    try{
      await this.authSvc.resetPassword(email.value);
      this.router.navigate(['login']);
    }catch (error){
      console.log('Error->', error);
    }
  }

}
