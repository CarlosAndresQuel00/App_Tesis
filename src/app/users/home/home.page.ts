import { AuthService } from 'src/app/services/auth.service';
import { UserInterface } from './../../shared/user.interface';
import { FirestoreService } from './../../services/firestore.service';
import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { PublicationInterface } from 'src/app/shared/publication.interface';
import { PublicationModalPage } from '../modals/publication-modal/publication-modal.page';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  userEmail: string;
  idCurrentUser: string;
  private path = 'Ideas/';
  userName: string;
  newPublication: PublicationInterface = {
    id: '',
    title: '',
    description: '',
    photo: '',
    file: '',
    date: new Date(),
    userId: '',
    idSaved: '',
    idUserSave: '',
  };
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
    private router: Router,
    public modalController: ModalController,
    public firestoreService: FirestoreService,
    public navCtrl: NavController,
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
  async presentModal(id: string) {
    const modal = await this.modalController.create({
      component: PublicationModalPage,
      componentProps: {
        idPubli: id
      }
    });
    return await modal.present();
  }

  logout() {
    this.authSvc.logout();
    console.log('saliendo');
    this.router.navigate(['login']);
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
  gotoUserProfile(id: string ){
    this.router.navigate(['/user-profile', id]);
  }
  savePublication(id: string){
    const path = 'Saved/';
    const asd = this.firestoreService.getOnePublication(id).subscribe(res => {
      this.newPublication = res;
      this.newPublication.idUserSave = this.idCurrentUser;
      this.newPublication.idSaved = this.firestoreService.getId();
      console.log('publication->', this.newPublication.idSaved);
      this.firestoreService.createDoc(this.newPublication, path, this.newPublication.idSaved).then(res => {
        console.log('guardado!');
      }).catch (err => {
          console.log(err);
      });
      asd.unsubscribe();
    });
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
