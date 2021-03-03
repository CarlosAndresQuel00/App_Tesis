import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
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
  loading;

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
    password: ''
  };
  constructor(
    public modalCtrl: ModalController,
    public firestoreService: FirestoreService,
    private authSvc: AuthService,
    public toastController: ToastController,
    public loadingController: LoadingController,

  ) {
    this.authSvc.stateAuth().subscribe(res => {
      console.log(res);
      if (res != null){
        this.idCurrentUser = res.uid;
        this.getUserInfo(this.idCurrentUser);
        console.log('id de user', this.idCurrentUser);
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
      password: ''
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
    const asd = this.firestoreService.getDoc<PublicationInterface>('Ideas/', this.idPubli).subscribe(res => {
      this.publicationReported = res;
      console.log(this.idCurrentUser);
      this.publicationReported.idReport = this.firestoreService.getId();
      this.publicationReported.commentReport = this.comment;
      this.publicationReported.reasonReport = this.reason;
      this.publicationReported.idUserReported = this.idCurrentUser;
      this.publicationReported.state = 'Sin solucionar';
      this.firestoreService.createDoc(this.publicationReported, path, this.publicationReported.idReport).then(res => {
        this.presentLoading();
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
  async presentLoading() {
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Publicando...',
      duration: 1000
    });
    await this.loading.present();

     const { role, data} = await this.loading.onDidDismiss();
     console.log('Loading dismissed!');
  }
}
