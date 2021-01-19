import { AuthService } from 'src/app/services/auth.service';
import { UserInterface } from './../../shared/user.interface';
import { FirestoreService } from './../../services/firestore.service';
import { Component, OnInit } from '@angular/core';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { PublicationInterface } from 'src/app/shared/publication.interface';
<<<<<<< HEAD
import { ReportPage } from '../modals/report/report.page';
import { MenuController } from '@ionic/angular';
import { CommentsPage } from '../modals/comments/comments.page';
import { NewPublicationPage } from '../modals/new-publication/new-publication.page';
=======

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'
import { EmbedVideoService } from 'ngx-embed-video';
import { PublicationModalPageModule } from '../modals/publication-modal/publication-modal.module';
import { PublicationPage } from '../publication/publication.page';
import { stringify } from '@angular/compiler/src/util';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player/ngx';

import { PublicationModalPage } from '../modals/publication-modal/publication-modal.page';


>>>>>>> 41b5c42528fa8c64ac9d394abaec05e8cae11156
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  yt_iframe_html: any;

  videoURL: string;
  userEmail: string;
  idCurrentUser: string;
  private path = 'Ideas/';

public dato:String;
  //youtubeUrl : any;


  userName: string;

  newPublication: PublicationInterface = {
    id: '',
    title: '',
    description: '',
    image: '',
    file: '',
    date: new Date(),
    userId: '',
    idSaved: '',
    idUserSave: '',
    videoURL:'',
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
  publications: PublicationInterface[] = [];

  constructor(
    private authSvc: AuthService,
    private router: Router,
    public modalController: ModalController,
    public firestoreService: FirestoreService,
    public navCtrl: NavController,
    public alertController: AlertController,
<<<<<<< HEAD
    private menu: MenuController,
    public toastController: ToastController,
=======

    private sanitizer: DomSanitizer,

    private youtube:YoutubeVideoPlayer,
    private embedService: EmbedVideoService,
    
>>>>>>> 41b5c42528fa8c64ac9d394abaec05e8cae11156
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
    this.getPublications();
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);
  }
  openFirst() {
    this.menu.toggle();
  }
  async modalComments(id: string) {
    const modal = await this.modalController.create({
      component: CommentsPage,
      componentProps: {
        idPubli: id
      }
    });
    return await modal.present();

  }

  url (url1:string){
    console.log('urls',url1);
    return this.videoURL = this.embedService.embed(url1);
  }
  url1 (youtubeUrl){
    const you=youtubeUrl;
    console.log('la url',you);
    console.log('la url embed', this.yt_iframe_html = this.embedService.embed(youtubeUrl));
    this.yt_iframe_html = this.embedService.embed(youtubeUrl);


  }


youtube_parser(url){
  var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  var match = url.match(regExp);
  console.log('la url embebida',(match&&match[7].length==11)? match[7]:false);
  var videoId=(match&&match[7].length==11)? match[7] : false;
  var enbed="//www.youtube.com/embed/"+ videoId;
  //this.yt_iframe_html = this.embedService.embed(enbed);
  this.yt_iframe_html = this.sanitizer.bypassSecurityTrustResourceUrl(enbed);  
  console.log('yaaa',this.yt_iframe_html);
  return enbed;
}

  getId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
console.log('este id', (match && match[2].length === 11)
? match[2]
: null)
    return (match && match[2].length === 11)
      ? match[2]
      : null;
  }

  openMyVideo(url){
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = url.match(regExp);
    var videoId=(match&&match[7].length==11)? match[7] : false;
    console.log('iddddd',videoId);
    this.youtube.openVideo(videoId);
  }

  getVideoIframe(url) {
    var video, results;
 
    if (url === null) {
        return '';
    }
    results = url.match('[\\?&]v=([^&#]*)');
    video   = (results === null) ? url : results[1];
 
    return this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + video);   
}


  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
    //  'dismissed': true
    });

  }
  async modalReport(id: string) {
    const modal = await this.modalController.create({
      component: ReportPage,
      componentProps: {
        idPubli: id
      }
    });
    return await modal.present();
  }
  async modalNewPublication() {
    const modal = await this.modalController.create({
      component: NewPublicationPage,
    });
    return await modal.present();
  }

  logout() {
    this.authSvc.logout();
    console.log('saliendo');
    this.router.navigate(['login']);
  }

  getUserInfo(uid: string){ // trae info de la bd
    const path = 'Users';
    this.firestoreService.getDoc<UserInterface>(path, uid).subscribe( res => {
      this.user = res;
    });
  }

  getPublications(){
     this.firestoreService.getCollection<PublicationInterface>(this.path).subscribe( res => {  // res - respuesta del observador
     this.publications = res;
     console.log('publi', res);
    });
  }

  

  gotoEditPublication(id: string){
    this.router.navigate(['/edit-publication', id]);
  }
  async deletePublication(idea: PublicationInterface){
    // await this.firestoreService.deleteDoc(this.path, idea.id);
    console.log('eliminado');
  }
  gotoUserProfile(id: string ){
    this.router.navigate(['/user-profile', id]);
  }
  savePublication(id: string){
    const path = 'Saved/';
    const asd = this.firestoreService.getOnePublication(id).subscribe(res => {
      this.newPublication = res;
      this.newPublication.idUserSave = this.idCurrentUser;
      this.newPublication.idSaved = this.firestoreService.getId();
      console.log('publication->', this.newPublication.idSaved);
      this.firestoreService.createDoc(this.newPublication, path, this.newPublication.idSaved).then(res => {
        this.presentToast('Publicación guardada');
      }).catch (err => {
          console.log(err);
      });
      asd.unsubscribe();
    });
  }

  async presentAlertConfirm(idea: PublicationInterface) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Eliminar idea',
      message: 'Estás seguro de eliminar tu idea?',
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
            this.firestoreService.deleteDoc(this.path, idea.id);
            console.log('eliminado');
          }
        }
      ]
    });
    await alert.present();
  }
  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 4500,
      color: 'dark'
    });
    toast.present();
  }
}
