import { UserInterface } from 'src/app/shared/user.interface';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FirestorageService } from '../../services/firestorage.service';
import { FirestoreService } from '../../services/firestore.service';
import { ToastController, AlertController, LoadingController } from '@ionic/angular';
import firebase from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  newFile: '';
  newImage: '';
  loading;
  segment1: boolean;
  errorMessage = '';
  //segment2: boolean;
  correctEmail = false;
  passwordCheckbox = false;

  invalid = false;
  invalidPass = false;
  invalidEmail = false;

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
    private googlePlus: GooglePlus,
    private platform: Platform,
    public loadingController: LoadingController,
  ){}

  async ngOnInit(){
    //this.segment1 = true;
    this.initUser();
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
  /*onreg(){
    if (this.platform.is('android')) {
      this.googleRegisterAndroid();
    } else {
      this.onRegisterGoogleWeb();
    }
  }*/
  async onRegister(){
    if(this.user.email == '' || this.user.name == '' || this.user.password == ''){
      this.presentWarningToast('Aseg??rate de completar todos los campos');
    }else if(this.invalid == true || this.invalidEmail == true || this.invalidPass == true){
      this.presentWarningToast('Aseg??rate de completar correctamente los campos');
    }else{
      const user = await this.authSvc.register(this.user.email, this.user.password);
      this.errorMessage = this.authSvc.message;
      if(user){
        this.redirectUser(true);
      }else{
        this.presentWarningToast(this.errorMessage);
      }
      const id = await this.authSvc.getUid();
      this.user.uid = id;
      this.saveUser();
      this.initUser();
      console.log(id);
    }
    
  }
  validarName(event){
    let numeros = '0123456789/*!"#$%&/()=?????'
    const texto = event.target.value;
    for(let i=0; i < texto.length; i++){
      if (numeros.indexOf(texto.charAt(i),0)!=-1){
        this.invalid = true;
      }else{
        this.invalid = false;
      }
    }
    console.log(texto, this.invalid);
  }
  validarPass(event){
    const texto = event.target.value;
    if(texto.length < 6){
      this.invalidPass = true;
    }else{
      this.invalidPass = false;
    }
  }
  validarEmail(event){
    let caracteres = '@.com.es'
    const texto = event.target.value;
    for(let i=0; i < texto.length; i++){
      if (caracteres.indexOf(texto.charAt(i),0)!=-1){
        this.invalidEmail = false;
      }else{
        this.invalidEmail = true;
      }
    }
    console.log(this.invalidEmail);
    
  }
  
  /*googleRegisterAndroid(): Promise<any> {
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
  
  async onRegisterGoogleWeb(){
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
  }*/

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
  async presentWarningToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 4500,
      color: 'danger'
    });
    toast.present();
  }
  /*segmentChanged(event){
    const seg = event.target.value;
    if (seg === 'segment1'){
      this.segment1 = true;
      this.segment2 = false;
    }
    if (seg === 'segment2'){
      this.segment1 = false;
      this.segment2 = true;
    }
  }*/
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
  showPassword(input: any): any {
    this.passwordCheckbox = !this.passwordCheckbox;
    input.type = input.type === 'password' ?  'text' : 'password';
   }
  
}
