import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ModalController, ToastController, ActionSheetController} from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { FirestorageService } from 'src/app/services/firestorage.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { PublicationInterface } from 'src/app/shared/publication.interface';
import { UserInterface } from 'src/app/shared/user.interface';
import { ActivatedRoute, Params} from '@angular/router';
import { CommentsPage } from '../modals/comments/comments.page';
import { ReportPage } from '../modals/report/report.page';
import { NotificationInterface } from 'src/app/shared/notification.interface';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {

  idUser: string;
  idCurrentUser: string;
  private path = 'Ideas/';
  private path1 = 'Followed/';
  existe = false;
  idFollowed = '';
  user: UserInterface = {
    uid: '',
    name: '',
    description: '',
    email: '',
    photo: '',
    password: '',
    idFollow: '',
    idUserFollower: '',
    countFollowers: 0

  };
  userFollower: UserInterface = {
    uid: '',
    name: '',
    description: '',
    email: '',
    photo: '',
    password: '',
    idFollow: '',
    idUserFollower: ''

  };
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
  };
  notification: NotificationInterface = {
    id: '',
    idPublication: '',
    idUser: '',
    follow: '',
    idTo: '',
    uPhoto: '',
    status: ''
  }

  publications: PublicationInterface[] = [];
  savedPublications: PublicationInterface[] = [];
  publi: PublicationInterface[] = [];

  constructor(
    public firestoreService: FirestoreService,
    public authSvc: AuthService,
    private router: Router,
    public modalController: ModalController,
    public fireStorageService: FirestorageService,
    public toastController: ToastController,
    public loadingController: LoadingController,
    private route: ActivatedRoute,
    public alertController: AlertController,
    private socialSharing:SocialSharing,
    public actionSheetController: ActionSheetController,
  ) {
    this.authSvc.stateAuth().subscribe(res => {
      if (res != null){
        this.idCurrentUser = res.uid;
        this.getCurrentUserInfo(this.idCurrentUser);
        console.log('id ini', this.idCurrentUser);
      }
    });
  }

  async ngOnInit() {
    this.getUserInfo();
    await this.getPublications();
    this.getFollowed();
   
  }
  getUserInfo(){ // trae info de la bd
    this.idUser = this.route.snapshot.paramMap.get('id');
    const path = 'Users';
    this.firestoreService.getDoc<UserInterface>(path, this.idUser).subscribe( res => {
      this.user = res;
    });
  }
  getPublications(){
    const saved = this.firestoreService.getCollection<PublicationInterface>(this.path).subscribe( res => {  // res - respuesta del observador
      this.publications = res.filter(word => word.userId === this.idUser);
    });
    saved.unsubscribe;
  }
  getFollowed(){
    this.firestoreService.getCollection<UserInterface>(this.path1).subscribe( res => {  // res - respuesta del observador
    res.forEach(e => {
      if(e.idUserFollower === this.idCurrentUser && e.uid == this.idUser){
        this.existe = true;
        this.idFollowed = e.idFollow;
      }
      });
    
    });
  }

  saveFollowed(){
    const path = 'Followed/';
    this.user.idFollow = this.firestoreService.getId();
    this.user.idUserFollower = this.idCurrentUser;
    this.user.password = '';
    if (this.existe){
      this.presentToast('Ya sigues a ' + this.user.name);
    }else{
      this.firestoreService.createDoc(this.user, path, this.user.idFollow).then(res => {
        this.saveFollower();
        this.presentToast('Comenzaste a seguir a ' + this.user.name);
        this.saveNotification();
      }).catch (err => {
          console.log(err);
      });
    }
    
  }
  saveFollower(){
    const path = 'Followers/';
    this.userFollower.idFollow = this.firestoreService.getId();
    this.userFollower.idUserFollow = this.user.uid;
    this.firestoreService.createDoc(this.userFollower, path, this.user.idFollow).then(res => {
      console.log('seguidor!');
    }).catch (err => {
      console.log(err);
    });
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
          this.presentToast('Publicación guardada!');
          }).catch (err => {
        console.log(err);
        });
          publi.unsubscribe();
      });
    }
  }
  // comprobar si una publicación ya está guardada
  getPublicationsSaved(){
    const path = 'Saved/';
    this.firestoreService.getCollection<PublicationInterface>(path).subscribe( res => {  // res - respuesta del observador
      if (res){
        this.savedPublications = res.filter(word => word.idUserSave === this.idCurrentUser);
      }
      console.log('guardados', res);
   });
  }

  saveNotification(){
    const path = 'Notifications/';
    this.notification.id = this.firestoreService.getId();
    this.notification.follow = this.userFollower.name + ' comenzó a seguirte';
    this.notification.uPhoto = this.userFollower.photo;
    this.notification.idUser = this.idCurrentUser;
    this.notification.idTo = this.userFollower.idUserFollow;
    this.notification.status = 'sin_abrir';
    this.firestoreService.createDoc(this.notification, path, this.notification.id).then(res => {
      console.log('notificacion guardarda!');
    }).catch (err => {
      console.log(err);
    });
  }
  getCurrentUserInfo(uid: string){ // trae info de la bd
    const path = 'Users';
    this.firestoreService.getDoc<UserInterface>(path, uid).subscribe( res => {
      this.userFollower = res;
    });
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
  async modalComments(id: string) {
    const modal = await this.modalController.create({
      component: CommentsPage,
      componentProps: {
        idPubli: id
      }
    });
    return await modal.present();
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
  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 1000,
      color: 'success'
    });
    toast.present();
  }
  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Dejar de seguir',
      message: '¿Quitar idea de tu lista de seguidos?',
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
            this.firestoreService.deleteDoc(this.path1, this.idFollowed);
            this.firestoreService.deleteDoc('Followers/', this.idFollowed);
            this.presentToast('Dejaste de seguir a '+this.user.name);
            this.existe = false;
          }
        }
      ]
    });
    await alert.present();
  }
  gotoEditPublication(id: string){
    this.router.navigate(['/edit-publication', id]);
  }
  async presentWarningToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 1000,
      color: 'warning'
    });
    toast.present();
  }
  //social sharing

  shareFacebook(ide, titlePublication){
    this.socialSharing.shareViaFacebook(titlePublication, null, "https://r-utiliza.web.app/publication/"+ide);
  }

  shareTwitter(ide, titlePublication){
    this.socialSharing.shareViaTwitter(titlePublication, null, "https://r-utiliza.web.app/publication/"+ide);
  }

  shareWhatsapp(ide, titlePublication){
    this.socialSharing.shareViaWhatsApp(titlePublication, null, "https://r-utiliza.web.app/publication/"+ide);
    console.log("https://r-utiliza.web.app/publication/"+ide);
  }
  
  async presentActionSheet(ide, titlePublication) {
    const actionSheet = await this.actionSheetController.create ({
      header: 'Compartír vía:',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Facebook',
        role: 'destructive',
        icon: 'logo-facebook',
        handler: () => {
          this.shareFacebook(ide, titlePublication);
        }
      }, {
        text: 'Twitter',
        icon: 'logo-twitter',
        handler: () => {
          this.shareTwitter(ide, titlePublication);
        }
      }, {
        text: 'Whatsapp',
        icon: 'logo-whatsapp',
        handler: () => {
          this.shareWhatsapp(ide, titlePublication);
          console.log(ide, titlePublication);
        }
      }, {
        text: 'Cancelar',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }
}
