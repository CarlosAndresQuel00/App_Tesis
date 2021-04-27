import { AuthService } from 'src/app/services/auth.service';
import { UserInterface } from './../../shared/user.interface';
import { FirestoreService } from '../../services/firestore.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AlertController, NavController, ToastController, ActionSheetController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { PublicationInterface } from '../../shared/publication.interface';
import { ReportPage } from '../modals/report/report.page';
import { MenuController } from '@ionic/angular';
import { CommentsPage } from '../modals/comments/comments.page';
import { NewPublicationPage } from './../modals/new-publication/new-publication.page';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { NotificationInterface } from 'src/app/shared/notification.interface';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit{
  safeUrl: any;
  link:string;
  yt_iframe_html: any;
  videoURL: string;
  play=true;
  userEmail: string;
  idCurrentUser: string;
  private path = 'Ideas/';

  saved = false;
  //para buscar
  textoBuscar = '';
  public dato:String;
  //youtubeUrl : any;

  userName: string;
  countNotif = 0;
  notif = false;


  presentLoad = true;
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
    password: ''
  };
  userPublication: UserInterface = {
    uid: '',
    name: '',
    description: '',
    email: '',
    photo: '',
    password: ''
  };
  idcomp;
  idsarray = [];

  publications: PublicationInterface[] = [];
  savedPublications: PublicationInterface[] = [];
  publi: PublicationInterface[] = [];
  notifications: NotificationInterface[] = [];
  reports: PublicationInterface[] = [];
  toDelete = []

  constructor(
    private authSvc: AuthService,
    private router: Router,
    public modalController: ModalController,
    public firestoreService: FirestoreService,
    public navCtrl: NavController,
    public alertController: AlertController,
    private menu: MenuController,
    public toastController: ToastController,
    private socialSharing:SocialSharing,
    public actionSheetController: ActionSheetController,
    public fireAuth: AngularFireAuth,
    private sanitizer: DomSanitizer
  ) {
    this.authSvc.stateAuth().subscribe(res => {
      console.log(res);
      if (res != null){
        this.idCurrentUser = res.uid;
        this.getUserInfo(this.idCurrentUser);
        console.log('id ini', this.idCurrentUser);
      }
    });
    this.idsarray = [];
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
    this.idsarray = [];
    this.getPublications();   
    this.getPublicationsSaved();
    this.getNotifications();
    this.getReports();
    const tag = document.createElement('script');
    tag.src = '//www.youtube.com/iframe_api';
    document.body.appendChild(tag);
    console.log('ids',this.idsarray);
  }
  openFirst() {
    this.menu.toggle();
  }
  async modalComments(id: string, idUser: string) {
    const modal = await this.modalController.create({
      component: CommentsPage,
      componentProps: {
        idPubli: id,
        idToP: idUser
      }
    });
    console.log('de to desde home', idUser);
    return await modal.present();

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

  async logout() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Cerrar Sesión',
      message: '¿Estás seguro de cerrar sesión?',
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
            this.fireAuth.signOut();
            this.navCtrl.navigateForward('/login');
            console.log('saliendo');
            
          }
        }
      ]
    });
    await alert.present();
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
    }).unsubscribe;
  }

  gotoEditPublication(id: string){
    this.router.navigate(['/edit-publication', id]);
  }
  gotoUserProfile(id: string ){
    this.router.navigate(['/user-profile', id]);
  }

  savePublication(id: string){
    const path = 'Saved/';
    this.publi = this.savedPublications.filter(i => i.id === id);
    if(this.publi.length != 0){
      this.presentWarningToast("Ya existe en tu lista de guardados!");
    }else{
      const publi = this.firestoreService.getDoc<PublicationInterface>('Ideas/', id).subscribe(res => {
        this.newPublication = res;
        this.newPublication.idUserSave = this.idCurrentUser;
        this.newPublication.idSaved = this.firestoreService.getId();
        console.log('publication->', this.newPublication.idSaved);
        this.firestoreService.createDoc(this.newPublication, path, this.newPublication.idSaved).then(res => {
          this.presentSuccessToast('Publicación guardada!');
          }).catch (err => {
        console.log(err);
        });
          publi.unsubscribe();
      });
    }
  }
  // comprobar si una publicación ya está guardada
  getPublicationsSaved(){
    const path = 'Saved/';
    this.firestoreService.getCollection<PublicationInterface>(path).subscribe( res => {  // res - respuesta del observador
      if (res){
        this.savedPublications = res.filter(word => word.idUserSave === this.idCurrentUser);
      }
      console.log('guardados', res);
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

    const path2 = 'Reports';
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Eliminar idea',
      message: '¿Estás seguro de eliminar tu idea?',
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
            this.deletofReport(idea.id);
            this.presentSuccessToast('Publicación eliminada');
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

  shareFacebook(ide, titlePublication){
    const message = '¡Hola! Te comparto esta idea de Reutilización de materiales: "' + titlePublication + '". Puedes ver los detalles en el siguiente link ';
    this.socialSharing.shareViaFacebook(message, null, "https://r-utiliza.web.app/publication/"+ide);
  }

  shareTwitter(ide, titlePublication){
    const message = '¡Hola! Te comparto esta idea de Reutilización de materiales: "' + titlePublication + '". Puedes ver los detalles en el siguiente link ';
    this.socialSharing.shareViaTwitter(message, null, "https://r-utiliza.web.app/publication/"+ide);
  }

  shareWhatsapp(ide, titlePublication){
    const message = '¡Hola! Te comparto esta idea de Reutilización de materiales: "' + titlePublication + '". Puedes ver los detalles en el siguiente link ';
    this.socialSharing.shareViaWhatsApp(message, null, "https://r-utiliza.web.app/publication/"+ide);
    console.log("https://r-utiliza.web.app/publication/"+ide);
  }
  
  
  async presentActionSheet(ide, titlePublication) {

    const actionSheet = await this.actionSheetController.create ({
      header: 'Compartír vía:',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Facebook',
        role: 'destructive',
        icon: 'logo-facebook',
        handler: () => {
          this.shareFacebook(ide, titlePublication);
        }
      }, {
        text: 'Twitter',
        icon: 'logo-twitter',
        handler: () => {
          this.shareTwitter(ide, titlePublication);
        }
      }, {
        text: 'Whatsapp',
        icon: 'logo-whatsapp',
        handler: () => {
          this.shareWhatsapp(ide, titlePublication);
          console.log(ide, titlePublication);
        }
      }, {
        text: 'Cancelar',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  goNotifications(){
   this.router.navigate(["/notifications"]);
 }

 //count notificacion
 getNotifications(){
  this.firestoreService.getCollection<NotificationInterface>('Notifications/').subscribe( res => {  // res - respuesta del observador
    if (res){
      this.notifications = res.filter(e => this.idCurrentUser == e.idTo && e.status == 'sin_abrir');
      this.countNotif = this.notifications.length;
    }
    if(this.countNotif > 0){
      this.notif = true;
    }
   });
  }
  go(page){
    this.router.navigate([page]);
  }
  testClick(){
    this.router.navigate(["guide"]);
  }
  linkvideo(){
    this.link="http://www.youtube.com/embed/-jY723k20MU?enablejsapi=1&origin=https://r-utiliza.web.app/";
    //this.safeSrc =  this.sanitizer.bypassSecurityTrustResourceUrl("http://www.youtube.com/embed/-jY723k20MU?enablejsapi=1&origin=https://r-utiliza.web.app/");
    return this.link;
    
  }

  iframeContacto(url, id){
    var mail = "'http://www.youtube.com/embed/"+url+"?enablejsapi=1&origin=https://r-utiliza.web.app/'";
    console.log("este es el link rul",mail);
    var form = document.createElement('iframe');
    
    form.width="75%";
    form.height="350px";
    
    form.id=id;
    form.setAttribute("src", mail);
    document.getElementById("form_mail").appendChild(form);
}

//urs domsanitazier

  getSafeUrl(url, id){
    //this.idcomp = id;
    this.idsarray.push(id);

    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url); 
    var form = document.createElement('iframe');
      form.width="100%";
      form.height="370px";
      //form.id=id;
      form.setAttribute("src", url);
      form.setAttribute("id",id);
      document.getElementById(id).appendChild(form);
  }
  getReports(){
    this.firestoreService.getCollection<PublicationInterface>('Reports/').subscribe( res => {  // res - respuesta del observador
      this.reports = res;
      console.log('reportados', this.reports);
     });
    }
    deletofReport(id: string){
      let ids = []
      console.log('a', this.reports);
      console.log('el id', id);
      this.toDelete = this.reports.filter(e => e.id == id);
      this.toDelete.forEach(e => {
        ids.push(e.idReport);
      });
      console.log('ides de repor', ids);
      ids.forEach(e => {
        console.log('ids a borr', e);
        this.firestoreService.deleteDoc('Reports', e);
      });
    }
  
}
