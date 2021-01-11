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
      }
    });
   }

  ngOnInit() {
    this.getUsers();
  }
  getUsers(){
    this.firestoreService.getCollection<UserInterface>(this.path).subscribe( res => {  // res - respuesta del observador
    this.users = res;
    console.log('guardados', res);
   });
  }
  async presentAlertConfirm(user: UserInterface) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Eliminar idea',
      message: 'Quitar idea de tu lista de guardados?',
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
            console.log('eliminado');
          }
        }
      ]
    });
    await alert.present();
  }
}
