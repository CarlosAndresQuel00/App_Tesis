import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { PublicationInterface } from 'src/app/shared/publication.interface';
import { UserInterface } from 'src/app/shared/user.interface';
@Component({
  selector: 'app-report',
  templateUrl: './report.page.html',
  styleUrls: ['./report.page.scss'],
})
export class ReportPage implements OnInit {

  @Input() idPubli: any;
  idCurrentUser: string;
  comment: string;
  reason: string;

  publicationReported: PublicationInterface = {
    id: '',
    title: '',
    description: '',
    image: [],
    file: '',
    date: new Date(),
    userId: '',
    idReport: '',
    idUserReported: '',
    commentReport: '',
    reasonReport: '',
    state: '',
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
  constructor(
    public modalCtrl: ModalController,
    public firestoreService: FirestoreService,
    private authSvc: AuthService,
    public toastController: ToastController,
  ) {
    this.authSvc.stateAuth().subscribe(res => {
      console.log(res);
      if (res != null){
        this.idCurrentUser = res.uid;
        this.getUserInfo(this.idCurrentUser);
        console.log('id ini', this.idCurrentUser);
      }else{
        this.initUser();
      }
    });
  }
  initUser(){
    this.idCurrentUser = '';
    this.user = {
      uid: '',
      name: '',
      description: '',
      email: '',
      photo: '',
      password: '',
      emailVerified: false,
    };
  }
  ngOnInit() {
  }
  dismiss() {
    this.modalCtrl.dismiss();
  }
  savePublicationReported(){
    console.log(this.reason);
    const path = 'Reports/';
    const asd = this.firestoreService.getDoc<PublicationInterface>(path, this.idPubli).subscribe(res => {
      this.publicationReported = res;
      this.publicationReported.idUserReported = this.idCurrentUser;
      this.publicationReported.idReport = this.firestoreService.getId();
      this.publicationReported.commentReport = this.comment;
      this.publicationReported.reasonReport = this.reason;
      this.publicationReported.state = 'Sin solucionar';
      this.firestoreService.createDoc(this.publicationReported, path, this.publicationReported.idReport).then(res => {
        this.presentToast('Reporte enviado, gracias por ayudarnos :)');
      }).catch (err => {
          console.log(err);
      });
      asd.unsubscribe();
    });
  }
  getUserInfo(uid: string){ // trae info de la bd
    const path = 'Users';
    this.firestoreService.getDoc<UserInterface>(path, uid).subscribe( res => {
      this.user = res;
    });
  }
  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000,
      color: 'success'
    });
    toast.present();
    this.dismiss();
  }
}
