import { UserInterface } from 'src/app/shared/user.interface';
import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';

import { FirestoreService } from './../../services/firestore.service';
import { AuthService } from 'src/app/services/auth.service';
import { PublicationInterface } from 'src/app/shared/publication.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  uid: string;
  idCurrentUser: string;
  path = 'Ideas/';
  user: UserInterface = {
    uid: '',
    name: '',
    description: '',
    email: '',
    photo: '',
    password: '',
    emailVerified: false,

  };
  publications: PublicationInterface[] = [];
  constructor(
    private authSvc: AuthService,
    public firestoreService: FirestoreService,
    private router: Router,
    public alertController: AlertController

  ) {
    this.authSvc.stateAuth().subscribe(res => {
      console.log(res);
      if (res != null){
        this.idCurrentUser = res.uid;
        this.getUserInfo(this.idCurrentUser);
        console.log('id ini', this.idCurrentUser);
      }else{
        this.initUser();
      }
    });
  }
  initUser(){
    this.idCurrentUser = '';
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
  ngOnInit() {
    this.getPublications();
  }
  getUserInfo(uid: string){ // trae info de la bd
    const path = 'Users';
    this.firestoreService.getDoc<UserInterface>(path, uid).subscribe( res => {
      this.user = res;
    });
  }
  getPublications(){
    this.firestoreService.getCollection<PublicationInterface>(this.path).subscribe( res => {  // res - respuesta del observador
    this.publications = res;
    console.log('publi', res);
   });
 }

  gotoEditPublication(id: string){
   this.router.navigate(['/edit-publication', id]);
  }
  async deletePublication(idea: PublicationInterface){
   // await this.firestoreService.deleteDoc(this.path, idea.id);
   console.log('eliminado');
  }

  async presentAlertConfirm(idea: PublicationInterface) {
   const alert = await this.alertController.create({
     cssClass: 'my-custom-class',
     header: 'Eliminar idea',
     message: 'Estás seguro de eliminar tu idea?',
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
           this.firestoreService.deleteDoc(this.path, idea.id);
           console.log('eliminado');
         }
       }
     ]
   });
   await alert.present();
 }
}
