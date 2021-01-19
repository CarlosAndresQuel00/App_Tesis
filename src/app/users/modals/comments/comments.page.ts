import { NavController } from '@ionic/angular';
import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CommentInterface } from 'src/app/shared/comments.interface';
import { FirestoreService } from 'src/app/services/firestore.service';
import { AuthService } from 'src/app/services/auth.service';
import { FirestorageService } from 'src/app/services/firestorage.service';
import { UserInterface } from 'src/app/shared/user.interface';
import { PublicationInterface } from 'src/app/shared/publication.interface';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.page.html',
  styleUrls: ['./comments.page.scss'],
})
export class CommentsPage implements OnInit {

  @Input() idPubli: any;
  uid = '';
  uName = '';
  uPhoto = '';
  private path = 'Comments/';
  comments: CommentInterface[] = [];
  comment: CommentInterface = {
    id: '',
    idPublication: '',
    idUser: '',
    text: '',
    uName: '',
    uPhoto: '',
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
  newPublication: PublicationInterface = {
    id: this.firestoreService.getId(),
    title: '',
    description: '',
    image: '',
    file: '',
    date: new Date(),
    userId: '',
    userName: '',
    userPhoto: '',
    idSaved: '',
    idUserSave: ''
  };
  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public firestoreService: FirestoreService,
    public authSvc: AuthService,
    public fireStorageService: FirestorageService,
  ) {
    this.authSvc.stateAuth().subscribe(res => {
      console.log(res);
      if (res != null){
        this.uid = res.uid;
        this.getUserInfo(this.uid);
        console.log(this.uid);
      }else{
        console.log('user not found');
      }
    });
  }

  initComment(){
    this.comment = {
      id: '',
      idPublication: '',
      idUser: '',
      text: '',
      uName: '',
      uPhoto: '',
    };
  }
  ngOnInit() {
    this.getComments();
  }
  dismiss() {
    this.modalCtrl.dismiss();
  }
  async saveComment() { // registrar idea en firestorage y base de datos con id de auth
    const path = 'Comments/';
    this.comment.id = this.firestoreService.getId();
    this.comment.idUser = this.uid;
    this.comment.uName = this.uName;
    this.comment.uPhoto = this.uPhoto;
    this.comment.idPublication = this.idPubli;
    this.firestoreService.createDoc(this.comment, path, this.comment.id).then(res => {
      console.log('Comentado!');
      this.comment.text = '';
    }).catch (err => {
      console.log(err);
    });
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
    this.comments = res;
    console.log('publi', res);
   });
 }

}
