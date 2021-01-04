import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {
  msg = '';
  constructor(
    private authSvc: AuthService,
    private router: Router,
    public toastController: ToastController
    ) { }

  ngOnInit() {
  }

  async onResetPassword(email){
    try{
      await this.authSvc.resetPassword(email.value);
      this.msg = 'Entendido! Revisa tu bandeja de entrada o tu correo spam para generar una nueva contraseña';
      this.presentToast(this.msg);
      await this.router.navigate(['login']);
    }catch (error){
      console.log('Error->', error);
      this.msg = error.message;
      this.presentToast(this.msg);
     }
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 4500,
      color: 'dark'
    });
    toast.present();
  }

}
