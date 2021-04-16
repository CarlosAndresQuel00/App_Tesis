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
  email =  '';
  constructor(
    private authSvc: AuthService,
    private router: Router,
    public toastController: ToastController
    ) { }

  ngOnInit() {
    this.email = '';
  }

  async onResetPassword(){
    try{
      await this.authSvc.resetPassword(this.email);
      this.msg = 'Si la dirección de correo existe. Llegará un mensaje para reestablecer tu contraseña. Revisa tu bandeja de entrada o tu correo spam';
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
      duration: 5000,
      color: 'dark'
    });
    toast.present();
  }

}
