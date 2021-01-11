import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
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
  user: UserInterface = {
    uid: '',
    name: '',
    description: '',
    email: '',
    photo: '',
    password: '',
    emailVerified: false,

  };
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

}
