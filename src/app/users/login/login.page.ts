import { RouterModule } from '@angular/router';
// login.page.ts
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NavController, ToastController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { UserInterface } from 'src/app/shared/user.interface';
import firebase from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  segment1: boolean;
  segment2: boolean;
  errorMessage = '';
  error = false;
  user: UserInterface = {
    uid: '',
    name: '',
    description: '',
    email: '',
    photo: '',
    password: '',
    emailVerified: false,
  };

  constructor(
    private authSvc: AuthService,
    private router: Router,
    public fireAuth: AngularFireAuth,
    public toastController: ToastController,
    public firestoreService: FirestoreService,
  ) {
    this.authSvc.stateAuth().subscribe(res => {
      console.log(res);
      if (res == null){
        this.initUser();
      }else{
        this.router.navigate(['home']);
      }
    });
  }

  async ngOnInit() {
    this.segment1 = true;
    console.log(this.user);
    const id = await this.authSvc.getUid();
    console.log(id);
  }
  initUser(){
    this.user = {
      uid: '',
      name: '',
      description: '',
      email: '',
      photo: '',
      password: '',
      emailVerified: false,
    };
  }

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

  async onLoginGoogle(){
    const path = 'Users';
    try{
      const res = await this.fireAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
      const user = res.user;
      if (user){
       // const isVerified = this.authSvc.isEmailVerified(user);
        this.user.name = user.displayName;
        this.user.photo = user.photoURL;
        this.user.email = user.email;
        this.user.uid = user.uid;
        this.firestoreService.createDoc(this.user, path, user.uid).then(res => {
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
      this.router.navigate(['verify-email']);
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


}

