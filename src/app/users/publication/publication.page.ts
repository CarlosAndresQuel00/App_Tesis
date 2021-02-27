import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController,AlertController,ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { PublicationInterface } from 'src/app/shared/publication.interface';
import { ReportPage } from '../modals/report/report.page';
import { UserInterface } from 'src/app/shared/user.interface';
import { CommentsPage } from '../modals/comments/comments.page';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-publication',
  templateUrl: './publication.page.html',
  styleUrls: ['./publication.page.scss'],
})
export class PublicationPage implements OnInit {
  saved = false;
  newPublication: PublicationInterface = {
    id: '',
    title: '',
    description: '',
    image: [],
    file: '',
    date: new Date(),
    userId: '',
    idSaved: '',
    idUserSave: '',
    videoURL:'',
  };
  idCurrentUser: string;
  idPublication: string;
  idUser = '';
  isOwner = false;
  private path = 'Ideas/';
  // Para verificar guardados
  savedPublications: PublicationInterface[] = [];
  publi: PublicationInterface[] = [];
  publication: PublicationInterface = {
    id: '',
    title: '',
    description: '',
    image: [],
    file: '',
    date: new Date(),
    userId: '',
    category: '',
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
  constructor(
    public firestoreService: FirestoreService,
    public authSvc: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    public modalController: ModalController,
    public alertController: AlertController,
    public toastController: ToastController,
    private iab: InAppBrowser
  ) {
   
   }

  ngOnInit() {
    this.getDetallesPubli();
    this.getPublicationsSaved();
  }
  getDetallesPubli(){
    this.idPublication = this.route.snapshot.paramMap.get('id');
    const path = 'Ideas/'
    this.firestoreService.getDoc<PublicationInterface>(path,this.idPublication).subscribe(res => {
      this.publication = res;
      console.log('publication->', res);
    });
  }

  async modalReport(id: string) {
    const modal = await this.modalController.create({
      component: ReportPage,
      componentProps: {
        idPubli: id
      }
    });
    return await modal.present();
  }
  gotoUserProfile(id: string ){
    this.router.navigate(['/user-profile', id]);
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
  gotoEditPublication(id: string){
    this.router.navigate(['/edit-publication', id]);
   }

   getUserInfo(uid: string){ // trae info de la bd
    const path = 'Users';
    this.firestoreService.getDoc<UserInterface>(path, uid).subscribe( res => {
      this.user = res;
    });
  }
  openDocument(fileName) {
    let url = encodeURIComponent(fileName);
    this.iab.create('https://docs.google.com/viewer?url=' + url);
  }

  savePublication(id: string){
    const path = 'Saved/';
    this.publi = this.savedPublications.filter(i => i.id === id);
    if(this.publi.length != 0){
      this.presentWarningToast("Ya existe en tu lista de guardados!");
    }else{
      const publi = this.firestoreService.getDoc<PublicationInterface>('Ideas/', id).subscribe(res => {
        this.newPublication = res;
        this.newPublication.idUserSave = this.idCurrentUser;
        this.newPublication.idSaved = this.firestoreService.getId();
        console.log('publication->', this.newPublication.idSaved);
        this.firestoreService.createDoc(this.newPublication, path, this.newPublication.idSaved).then(res => {
          this.presentSuccessToast('Publicación guardada!');
          }).catch (err => {
        console.log(err);
        });
          publi.unsubscribe();
      });
    }
  }
  getPublicationsSaved(){
    const path = 'Saved/';
    this.firestoreService.getCollection<PublicationInterface>(path).subscribe( res => {  // res - respuesta del observador
      if (res){
        this.savedPublications = res.filter(word => word.idUserSave === this.idCurrentUser);
      }
      console.log('guardados', res);
   });
  }
  async presentWarningToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 1000,
      color: 'warning'
    });
    toast.present();
  }
  async presentSuccessToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 1000,
      color: 'success'
    });
    toast.present();
  }
  async modalComments(id: string) {
    const modal = await this.modalController.create({
      component: CommentsPage,
      componentProps: {
        idPubli: id
      }
    });
    return await modal.present();

  }

  gotoCategory(category : string){
    if (category == 'Papel y cartón'){
      this.router.navigate(['/papel-carton']);
    }else if(category == 'Cristal y vidrio'){
      this.router.navigate(['/cristal-vidrio']);
    }else if(category == 'Metales'){
      this.router.navigate(['/metales']);
    }else if(category == 'Plástico'){
      this.router.navigate(['/plastico']);
    }else if(category == 'Telas'){
      this.router.navigate(['/telas']);
    }else{
      this.router.navigate(['/otros']);
    }

  
}
  goBack(){
    this.authSvc.stateAuth().subscribe(res => {
      console.log(res);
      if (res != null){
        this.router.navigate(["/notifications"]);
      }else{
        this.router.navigate(["/register"]);
      }
    });
  }

}
