import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { UserInterface } from 'src/app/shared/user.interface';

import { FirestoreService } from './../../services/firestore.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { FirestorageService } from 'src/app/services/firestorage.service';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.page.html',
  styleUrls: ['./profile-settings.page.scss'],
})
export class ProfileSettingsPage implements OnInit {

  newFile: '';
  newImage: '';
  statusBar = false;

  uid: string;
  user: UserInterface = {
    uid: '',
    name: '',
    description: '',
    email: '',
    photo: '',
    password: ''
  };

  constructor(
    public firestoreService: FirestoreService,
    public authSvc: AuthService,
    private router: Router,
    public fireStorageService: FirestorageService,
    public navCtrl: NavController,
    public alertController: AlertController,
    public toastController: ToastController,
  ){
    this.authSvc.stateAuth().subscribe(res => {
      if (res != null){
        this.uid = res.uid;
        this.getUserInfo(this.uid);
      }
      console.log(res.uid);
    });
  }

  async ngOnInit(){

 // retorna identificador de user
    const id = await this.authSvc.getUid();
    console.log(id);
  }

  async saveUser() { // registrar usuario en la base de datos con id de auth
    this.statusBar = true;
    const path = 'Users';
    const name = this.user.name;
    if (this.newFile !== undefined){
      const res = await this.fireStorageService.uploadImage(this.newFile, path, name);
      this.user.photo = res;
    }
    this.firestoreService.updateDoc(this.user, path, this.user.uid).then(res => {
      this.statusBar = false;
      this.redirectUser(true);
    }).catch (err => {
      console.log(err);
    });
  }
  onLogout(){
    this.authSvc.logout();
    console.log('saliendo');
  }

  async newPhotoProfile(event: any){
    if (event.target.files && event.target.files[0]){
      this.newFile = event.target.files[0];
      const reader = new FileReader();
      reader.onload = ((image) => {
        this.user.photo = image.target.result as string;
      });
      reader.readAsDataURL(event.target.files[0]);
    }
  }
  async redirectUser(isVerified: boolean){
    if (isVerified){
      this.presentToast('Cambios guardados');
      await this.router.navigate(['profile']);
    }else{
      // await this.router.navigate(['verify-email']);
      console.log('no');
    }
  }
  getUserInfo(uid: string){ // trae info de la bd
    const path = 'Users';
    this.firestoreService.getDoc<UserInterface>(path, uid).subscribe( res => {
      this.user = res;
    });
  }
  goProfile(){
    this.router.navigate(['profile']);
  }
  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Editar perfil',
      message: 'Está seguro de deshacer cambios?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Sí',
          handler: () => {
            this.router.navigate(['profile']);
            console.log('eliminado');
          }
        }
      ]
    });
    await alert.present();
  }
  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 900,
      color: 'success'
    });
    toast.present();
  }
}
