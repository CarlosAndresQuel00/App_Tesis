import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { PublicationInterface } from 'src/app/shared/publication.interface';
import { UserInterface } from 'src/app/shared/user.interface';

@Component({
  selector: 'app-followers',
  templateUrl: './followers.page.html',
  styleUrls: ['./followers.page.scss'],
})
export class FollowersPage implements OnInit {

  idCurrentUser: string;
  private path = 'Followers/';
  existe = false;
  idFollowed = '';
  noFollowers = true;
  count = 0;

  user: UserInterface = {
    uid: '',
    name: '',
    description: '',
    email: '',
    photo: '',
    password: '',
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
  users: UserInterface[] = [];
  constructor(
    private authSvc: AuthService,
    public firestoreService: FirestoreService,
    public toastController: ToastController,
    public alertController: AlertController,
    private router: Router,
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
    this.getFollowers();
  }
  getFollowers(){
    const followers = this.firestoreService.getCollection<UserInterface>(this.path).subscribe( res => {  // res - respuesta del observador
      this.users = res.filter(word => this.idCurrentUser == word.idUserFollow);
      this.count = this.users.length;
      if(this.users.length !== 0){
        this.noFollowers = false;
      }else{
        this.noFollowers = true;
      }
    });
    followers.unsubscribe;
  }
  getFollowed(id:string){
    this.firestoreService.getCollection<UserInterface>('Followed/').subscribe( res => {  // res - respuesta del observador
      res.forEach(e => {
        if(e.idUserFollower === this.idCurrentUser && e.uid == id){
          this.existe = true;
          this.idFollowed = e.idFollow;
        }
      });
    });
  }
  gotoUserProfile(id: string ){
    this.router.navigate(['/user-profile', id]);
  }
  saveFollowed(user: UserInterface){
    this.getFollowed(user.uid);
    const path = 'Followed/';
    user.idFollow = this.firestoreService.getId();
    user.idUserFollower = this.idCurrentUser;
    user.password = '';
    if (this.existe){
      this.presentToast('Ya sigues a ' + user.name);
    }else{
      this.firestoreService.createDoc(user, path, user.idFollow).then(res => {
        this.saveFollower(user);
        this.presentToast('Comenzaste a seguir a ' + this.user.name);
        this.existe = true;
      }).catch (err => {
          console.log(err);
      });
    }
    
  }
  saveFollower(user: UserInterface){
    const path = 'Followers/';
    this.userFollower.idUserFollow = user.uid;
    this.firestoreService.createDoc(this.userFollower, path, user.idFollow).then(res => {
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
  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      color: 'success'
    });
    toast.present();
  }
  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Dejar de seguir',
      message: '??Quitar idea de tu lista de seguidos?',
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
            this.firestoreService.deleteDoc('Followed/', this.idFollowed);
            this.firestoreService.deleteDoc(this.path, this.idFollowed);
            this.presentToast('Dejaste de seguir a '+this.user.name);
            this.noFollowers = false;
            // this.existe = false;
          }
        }
      ]
    });
    await alert.present();
  }
}
