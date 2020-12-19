import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  userEmail: string;

  constructor(
    private authSvc: AngularFireAuth,
  ) { }

  ngOnInit() {

   /* this.authService.userDetails().subscribe(res => {
      console.log('res', res);
      if (res !== null) {
        this.userEmail = res.email;
      } else {
        this.navCtrl.navigateBack('');
      }
    }, err => {
      console.log('err', err);
    })*/

  }

  /*logout() {
    this.authService.logoutUser()
      .then(res => {
        console.log(res);
        this.navCtrl.navigateBack('');
      })
      .catch(error => {
        console.log(error);
      })
  }*/
  async logout(): Promise<void>{
    try{
      await this.authSvc.signOut();
    }catch (error){
      console.log('Error->', error);
    }
  }
}
