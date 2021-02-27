import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { NotificationInterface } from 'src/app/shared/notification.interface';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {

  path = 'Notifications/';
  idCurrentUser: string;
  notifications: NotificationInterface[] = [];
  constructor(
    private authSvc: AuthService,
    public firestoreService: FirestoreService,
    private router: Router
  ) { 
    this.authSvc.stateAuth().subscribe(res => {
      console.log(res);
      if (res != null){
        this.idCurrentUser = res.uid;
        console.log('id ini', this.idCurrentUser);
      }
    });
  }

  ngOnInit() {
    this.getNotifications();
  }

  getNotifications(){
    this.firestoreService.getCollection<NotificationInterface>(this.path).subscribe( res => {  // res - respuesta del observador
      if (res){
        this.notifications = res.filter(e => this.idCurrentUser == e.idTo);
      }
      console.log('notiif', res);
     });
  }
  goPublication(idPublication){
    this.router.navigate(['/publication', idPublication]);
  }
  goProfile(idUser){
    this.router.navigate(['/user-profile', idUser]);
  }
}
