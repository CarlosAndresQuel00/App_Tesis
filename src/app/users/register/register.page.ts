import { UserInterface } from 'src/app/shared/user.interface';
import { Observable } from 'rxjs';
// register.page.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FirestorageService } from '../../services/firestorage.service';
import { FirestoreService } from '../../services/firestore.service';
import { ToastController, AlertController } from '@ionic/angular';
import firebase from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  newFile: '';
  newImage: '';
  segment1: boolean;
  segment2: boolean;
  user: UserInterface = {
    uid: '',
    name: '',
    description: '',
    email: '',
    photo: '',
    password: '',
    displayName: ''
  };

  constructor(
    public firestoreService: FirestoreService,
    public authSvc: AuthService,
    private router: Router,
    public fireStorageService: FirestorageService,
    public toastController: ToastController,
    public fireAuth: AngularFireAuth,
  ){}

  async ngOnInit(){
 // retorna identificador de user
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
      password: ''
    };
  }
  async onRegister(){
    const user = await this.authSvc.register(this.user.email, this.user.password);
    if(user){
      this.redirectUser(true);
    }
    const id = await this.authSvc.getUid();
    this.user.uid = id;
    this.saveUser();
    console.log(id);
  }

  async saveUser() { // registrar usuario en la base de datos con id de auth
    const path = 'Users';
    const name = this.user.name;
    this.firestoreService.createDoc(this.user, path, this.user.uid).then(res => {
      this.presentToast('Registro existoso');
    }).catch (err => {
      console.log(err);
      this.presentToast(err.message);
    });
  }
  async redirectUser(isVerified: boolean){
    if (isVerified){
      await this.router.navigate(['home']);
    }else{
      console.log('no');
    }
  }


  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 4500,
      color: 'success'
    });
    toast.present();
  }
  async onRegisterGoogle(){
    const path = 'Users';
    try{
      const res = await this.fireAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
      const user = res.user;
      if (user){
        this.user.name = user.displayName;
        this.user.photo = user.photoURL;
        this.user.email = user.email;
        this.user.uid = user.uid;
        this.firestoreService.createDoc(this.user, path, user.uid).then( res => {
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
