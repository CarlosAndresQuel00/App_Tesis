import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { FirestorageService } from 'src/app/services/firestorage.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { PublicationInterface } from 'src/app/shared/publication.interface';
import { UserInterface } from 'src/app/shared/user.interface';
import { ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {

  idUser: string;
  idCurrentUser: string;
  private path = 'Ideas/';
  private path1 = 'Users/';
  private path2 = 'Followed/';
  idExist: false;
  counter = 0;
  user: UserInterface = {
    uid: '',
    name: '',
    description: '',
    email: '',
    photo: '',
    password: '',
    emailVerified: false,
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
    emailVerified: false,
    idFollow: '',
    idUserFollower: ''

  };

  publications: PublicationInterface[] = [];
  constructor(
    public firestoreService: FirestoreService,
    public authSvc: AuthService,
    private router: Router,
    public fireStorageService: FirestorageService,
    public toastController: ToastController,
    public loadingController: LoadingController,
    private route: ActivatedRoute
  ) {
    this.authSvc.stateAuth().subscribe(res => {
      if (res != null){
        this.idCurrentUser = res.uid;
        this.getCurrentUserInfo(this.idCurrentUser);
        console.log('id ini', this.idCurrentUser);
      }
    });
  }

  ngOnInit() {
    this.getUserInfo();
    this.getPublications();
  }
  getUserInfo(){ // trae info de la bd
    this.idUser = this.route.snapshot.paramMap.get('id');
    const path = 'Users';
    this.firestoreService.getDoc<UserInterface>(path, this.idUser).subscribe( res => {
      this.user = res;
    });
  }
  getPublications(){
    this.firestoreService.getCollection<PublicationInterface>(this.path).subscribe( res => {  // res - respuesta del observador
    this.publications = res;
    console.log('publi', res);
   });
 }

  saveFollowed(){
    const path = 'Followed/';
    this.user.idFollow = this.firestoreService.getId();
    this.user.idUserFollower = this.idCurrentUser;
    this.user.password = '';
    this.firestoreService.createDoc(this.user, path, this.user.idFollow).then(res => {
      this.saveFollower();
      console.log('seguido!');
    }).catch (err => {
        console.log(err);
    });
  }
  saveFollower(){
    const path = 'Followers/';
    this.userFollower.idFollow = this.firestoreService.getId();
    this.userFollower.idUserFollow = this.user.uid;
    this.firestoreService.createDoc(this.userFollower, path, this.userFollower.idFollow).then(res => {
      console.log('seguidor!');
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
}
