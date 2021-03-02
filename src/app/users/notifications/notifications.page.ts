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
  num = 0;
  notif = false;
  notifications: NotificationInterface[] = [];
  open = true;
  notification: NotificationInterface = {
    status: ''
  }
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
        this.notifications.forEach(e => {
          if(e.status == 'sin_abrir'){
            this.open = false;
          }
        });
      }
      if(this.notifications.length != 0){
        this.notif = true;
      }
      console.log('notiif', this.notifications);
     });
  }
  goPublication(idPublication, id){
    this.getOneNotification(id);
    console.log(id);
    this.router.navigate(['/publication', idPublication]);
    
  }
  goProfile(idUser, id){
    this.getOneNotification(id);
    console.log(id);
    this.router.navigate(['/user-profile', idUser]);
  }
  getOneNotification(id){
    this.firestoreService.getDoc<NotificationInterface>('Notifications/', id).subscribe(res => {
      this.notification = res;
    });
    this.notification.status = 'abierto';
    this.firestoreService.updateDoc(this.notification, 'Notifications/', id).then(res => {
      console.log('notificacon abierta!');
      }).catch (err => {
    console.log(err);
    });
  }
}
