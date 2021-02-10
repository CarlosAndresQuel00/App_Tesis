import { AuthService } from 'src/app/services/auth.service';
import { UserInterface } from './../../shared/user.interface';
import { FirestoreService } from '../../services/firestore.service';
import { Component, OnInit } from '@angular/core';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { PublicationInterface } from '../../shared/publication.interface';
import { ReportPage } from '../modals/report/report.page';
import { MenuController } from '@ionic/angular';
import { CommentsPage } from '../modals/comments/comments.page';
import { NewPublicationPage } from './../modals/new-publication/new-publication.page';

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'
import { EmbedVideoService } from 'ngx-embed-video';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { File } from '@ionic-native/file/ngx';

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

  saved = false;

  //para buscar
  textoBuscar = '';
public dato:String;
  //youtubeUrl : any;


  userName: string;

  newPublication: PublicationInterface = {
    id: '',
    title: '',
    description: '',
    image: [],
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
    private menu: MenuController,
    public toastController: ToastController,

    private sanitizer: DomSanitizer,
    private youtube:YoutubeVideoPlayer,
    private embedService: EmbedVideoService,
    private socialSharing:SocialSharing,
    private file: File,
    
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
    tag.src = 'http://www.youtube.com/iframe_api';
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
    this.getPublicationsSaved(id);
    const path = 'Saved/';
    const publi = this.firestoreService.getDoc<PublicationInterface>('Ideas/', id).subscribe(res => {
    this.newPublication = res;
    this.newPublication.idUserSave = this.idCurrentUser;
    this.newPublication.idSaved = this.firestoreService.getId();
    console.log('publication->', this.newPublication.idSaved);
    if(this.saved == true){
      this.presentWarningToast('Ya existe');
      this.saved = false;
    }else{
       this.firestoreService.createDoc(this.newPublication, path, this.newPublication.idSaved).then(res => {
      this.presentSuccessToast('Publicación guardada');
      }).catch (err => {
    console.log(err);
    });
      publi.unsubscribe();
    }
    });
  }
  // comprobar si una publicación ya está guardada
  getPublicationsSaved(id: string){
    const path = 'Saved/';
    this.firestoreService.getCollection<PublicationInterface>(path).subscribe( res => {  // res - respuesta del observador
    res.forEach(save => {
        if(save.idUserSave == this.idCurrentUser && id == save.id){
          this.saved = true;
        }
    });
   });
 

  }

  gotoCategory(category : string){
    if (category == 'Papel y cartón'){
      this.router.navigate(['/papel-carton']);
    }else if(category == 'Cristal y vidrio'){
      this.router.navigate(['/cristal-vidrio']);
    }else if(category == 'Metales'){
      this.router.navigate(['/metales']);
    }else if(category == 'Plástico'){
      this.router.navigate(['/plastico']);
    }else if(category == 'Telas'){
      this.router.navigate(['/telas']);
    }else{
      this.router.navigate(['/otros']);
    }
    
  }
  async search(event){
    const texto = event.target.value;
    this.textoBuscar = texto;
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
  async presentSuccessToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 1000,
      color: 'success'
    });
    toast.present();
  }
  async presentWarningToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 1000,
      color: 'warning'
    });
    toast.present();
  }

  //social sharing

  shareFacebook(title){
    this.socialSharing.shareViaFacebook(title);
  }
}
