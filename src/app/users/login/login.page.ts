import { RouterModule } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { UserInterface } from 'src/app/shared/user.interface';
import firebase from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import { FirestoreService } from 'src/app/services/firestore.service';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Platform } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  segment1: boolean;
  segment2: boolean;
  loading;
  errorMessage = '';
  error = false;

  user: UserInterface = {
    uid: '',
    name: '',
    description: '',
    email: '',
    photo: '',
    password: '',
    number: ''
  };

  constructor(
    private authSvc: AuthService,
    private router: Router,
    public fireAuth: AngularFireAuth,
    public toastController: ToastController,
    public firestoreService: FirestoreService,
    private googlePlus: GooglePlus,
    private platform: Platform,
    public loadingController: LoadingController,
    public alertController: AlertController
  ) {
    this.authSvc.stateAuth().subscribe(res => {
      console.log(res);
      if (!res){
        this.initUser();
      }
    });
  }

  async ngOnInit() {
    this.segment1 = true;
    this.initUser();
  }
  initUser(){
    this.user = {
      uid: '',
      name: '',
      description: '',
      email: '',
      photo: '',
      password: ''
    };
  }

  /*onlog(){
    if (this.platform.is('android')) {
      this.googleLogin();
    } else {
      this.loginGoogleWeb();
    }
  }

  googleLogin(): Promise<any> {
    const path = 'Users';
    return new Promise((resolve, reject) => { 
        this.googlePlus.login({
          'webClientId': '938752442008-t9o7uftvd7rgdrcle6hqurekbusisn38.apps.googleusercontent.com',
          'offline': true
        }).then( res => {
          const googleCredential = firebase.auth.GoogleAuthProvider.credential(res.idToken);
          firebase.auth().signInWithCredential(googleCredential).then( response => {
            const user = response.user;
            if (user){
              this.presentLoading();
              this.user.name = user.displayName;
              this.user.photo = user.photoURL;
              this.user.email = user.email;
              this.user.uid = user.uid;
              this.firestoreService.updateDoc(this.user, path, user.uid).then(res => {
              this.redirectUser(true);
              resolve(response)
              }).catch (err => {
                console.log(err);
                  this.presentToast(err.message);
              });
            }
          });
        }, err => {
            this.presentToast("Error: "+ err);
            reject(err);
        });
      });
    }
  async loginGoogleWeb() {
    const path = 'Users';
    try{
      const res = await this.fireAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
      const user = res.user;
      if (user){
        this.user.name = user.displayName;
        this.user.photo = user.photoURL;
        this.user.email = user.email;
        this.user.uid = user.uid;
        this.firestoreService.updateDoc(this.user, path, user.uid).then(res => {
        this.redirectUser(true);
      }).catch (err => {
        console.log(err);
        this.presentToast(err.message);
      });
      }
    } catch (error){
      console.log(error);
    }
  }
*/

  async onLogin(){
    try{
      const user = await this.authSvc.loginUser(this.user.email, this.user.password);
      this.errorMessage = this.authSvc.message;
      if (user){
        this.redirectUser(true);
      }else{
        this.presentToast(this.errorMessage);
      }
    } catch (error){
      console.log(error.errorMessage);
    }
  }
  
  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 4500,
      color: 'danger'
    });
    toast.present();
  }
  redirectUser(isVerified: boolean){
    if (isVerified){
      this.router.navigate(['home']);
    }else{
     console.log('No redirect');
    }
  }

  segmentChanged(event){
    const seg = event.target.value;
    if (seg === 'segment1'){
      this.segment1 = true;
      this.segment2 = false;
    }
    if (seg === 'segment2'){
      this.segment1 = false;
      this.segment2 = true;
    }
  }
  async presentLoading() {
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: '',
      duration: 2000
    });
    await this.loading.present();
     const { role, data} = await this.loading.onDidDismiss();
     console.log('Loading dismissed!');
  }
}

