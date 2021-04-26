import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { PublicationInterface } from 'src/app/shared/publication.interface';
import { UserInterface } from 'src/app/shared/user.interface';

@Component({
  selector: 'app-follows',
  templateUrl: './follows.page.html',
  styleUrls: ['./follows.page.scss'],
})
export class FollowsPage implements OnInit {

  uid: string;
  idCurrentUser: string;
  private path = 'Followed/';
  users: UserInterface[] = [];
  noFollows = true;
  count = 0;
  constructor(
    private authSvc: AuthService,
    public firestoreService: FirestoreService,
    private router: Router,
    public alertController: AlertController
  ) {
    this.authSvc.stateAuth().subscribe(res => {
      console.log('infor current', res);
      if (res != null){
        this.idCurrentUser = res.uid;
      }
    });
   }

  ngOnInit() {
    this.getUsers();
  }
  getUsers(){
    this.firestoreService.getCollection<UserInterface>(this.path).subscribe( res => {  // res - respuesta del observador
      if (res){
        this.users = res.filter(word => word.idUserFollower === this.idCurrentUser);
        this.count = this.users.length;
      }
      if(this.users.length !== 0){
        this.noFollows = false;
      }
    });
  }
  gotoUserProfile(id: string ){
    this.router.navigate(['/user-profile', id]);
  }
  async presentAlertConfirm(user: UserInterface) {
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
            this.firestoreService.deleteDoc(this.path, user.idFollow);
            this.firestoreService.deleteDoc('Followers/', user.idFollow);
            this.noFollows = true;
          }
        }
      ]
    });
    await alert.present();
  }
}
