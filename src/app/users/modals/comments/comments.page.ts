import { NavController, AlertController, ToastController } from '@ionic/angular';
import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CommentInterface } from 'src/app/shared/comments.interface';
import { FirestoreService } from 'src/app/services/firestore.service';
import { AuthService } from 'src/app/services/auth.service';
import { FirestorageService } from 'src/app/services/firestorage.service';
import { UserInterface } from 'src/app/shared/user.interface';
import { PublicationInterface } from 'src/app/shared/publication.interface';
import { NotificationInterface } from 'src/app/shared/notification.interface';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.page.html',
  styleUrls: ['./comments.page.scss'],
})
export class CommentsPage implements OnInit {

  @Input() idPubli: any ; 
  @Input() idToP: any;
  idCurrentUser = '';
  uName = '';
  uPhoto = '';
  private path = 'Comments/';
  comments: CommentInterface[] = [];
  comment: CommentInterface = {
    idComment: '',
    idPublication: '',
    idUser: '',
    text: '',
    time: new Date(),
    uName: '',
    uPhoto: '',
  };
  user: UserInterface = {
    uid: '',
    name: '',
    description: '',
    email: '',
    photo: '',
    password: ''
  };
  notification: NotificationInterface = {
    idNotif: '',
    idPublication: '',
    idUser: '',
    comment: '',
    idTo: '',
    uPhoto: '',
    status: ''
  }
  
  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public firestoreService: FirestoreService,
    public authSvc: AuthService,
    public fireStorageService: FirestorageService,
    public alertController: AlertController,
    public toastController: ToastController
  ) {
    this.authSvc.stateAuth().subscribe(res => {
      console.log(res);
      if (res != null){
        this.idCurrentUser = res.uid;
        this.getUserInfo(this.idCurrentUser);
        console.log(this.idCurrentUser);
      }else{
        console.log('user not found');
      }
    });
  }

  initComment(){
    this.comment = {
      idComment: '',
      idPublication: '',
      idUser: '',
      time: new Date(),
      text: '',
      uName: '',
      uPhoto: '',
    };
  }
  ngOnInit() {
    this.getComments();
    console.log('ide de persona to', this.idToP);
    console.log('ide de publication to', this.idPubli);
  }
  dismiss() {
    this.modalCtrl.dismiss();
  }
  async saveComment() { // registrar idea en firestorage y base de datos con id de auth
    const path = 'Comments/';
    this.comment.idComment = this.firestoreService.getId();
    this.comment.idUser = this.idCurrentUser;
    this.comment.uName = this.uName;
    this.comment.uPhoto = this.uPhoto;
    this.comment.idPublication = this.idPubli;
    this.firestoreService.createDoc(this.comment, path, this.comment.idComment).then(res => {
      console.log('Comentado!');
      this.saveNotification();
      this.comment.text = '';
    }).catch (err => {
      console.log(err);
    });
    console.log('id comment', this.comment.idComment);
  }
  saveNotification(){
    const path = 'Notifications/';
    if(this.idCurrentUser != this.idToP){
      this.notification.idNotif = this.firestoreService.getId();
      this.notification.comment = this.uName + ' coment?? tu publicaci??n';
      this.notification.idPublication = this.idPubli;
      this.notification.uPhoto = this.uPhoto;
      this.notification.idUser = this.idCurrentUser;
      this.notification.idTo = this.idToP;
      this.notification.status = 'sin_abrir';
      this.firestoreService.createDoc(this.notification, path, this.notification.idNotif).then(res => {
        console.log('notificacion guardarda!');
      }).catch (err => {
        console.log(err);
      });
    }
  }
  getUserInfo(uid: string){ // trae info de la bd
    const path = 'Users';
    this.firestoreService.getDoc<UserInterface>(path, uid).subscribe( res => {
      this.user = res;
      this.uName = this.user.name;
      this.uPhoto = this.user.photo;
    });
  }
  getComments(){
    this.firestoreService.getCollection<CommentInterface>(this.path).subscribe( res => {  // res - respuesta del observador
    this.comments = res.filter(comment => comment.idPublication === this.idPubli);
    console.log('publi', this.comments);
   });
  }

  async presentAlertConfirm(id: string) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      message: '??Eiminar comentario?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'S??',
          handler: () => {
            this.firestoreService.deleteDoc('Comments', id);
            this.presentSuccessToast('Eliminado correctamente');
          }
        }
      ]
    });
    await alert.present();
  }
  async presentSuccessToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 1000,
      color: 'success'
    });
    toast.present();
  }

}
