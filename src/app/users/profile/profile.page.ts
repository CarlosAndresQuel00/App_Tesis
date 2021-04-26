import { UserInterface } from 'src/app/shared/user.interface';
import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, ToastController, ActionSheetController } from '@ionic/angular';

import { FirestoreService } from '../../services/firestore.service';
import { AuthService } from 'src/app/services/auth.service';
import { PublicationInterface } from '../../shared/publication.interface';
import { Router } from '@angular/router';
import { CommentInterface } from 'src/app/shared/comments.interface';
import { CommentsPage } from '../modals/comments/comments.page';
import { NewPublicationPage } from '../modals/new-publication/new-publication.page';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  idsarray = [];
  safeUrl: any;
  uid: string;
  idCurrentUser: string;
  path = 'Ideas/';
  noIdeas = true;
  count = 0;
  user: UserInterface = {
    uid: '',
    name: '',
    description: '',
    email: '',
    photo: '',
    password: ''

  };
  comment: CommentInterface = {
    id: '',
    idPublication: '',
    idUser: '',
    time: null,
    text: '',
    uName: '',
    uPhoto: '',
  };
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

  publications: PublicationInterface[] = [];
  savedPublications: PublicationInterface[] = [];
  publi: PublicationInterface[] = [];
  users: UserInterface[] = [];
  constructor(
    private authSvc: AuthService,
    public firestoreService: FirestoreService,
    private router: Router,
    public alertController: AlertController,
    public modalController: ModalController,
    public toastController: ToastController,
    private socialSharing:SocialSharing,
    public actionSheetController: ActionSheetController,
    private sanitizer: DomSanitizer
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
      password: ''
    };
  }
  
  ngOnInit() {
    this.getPublications();
    this.getPublicationsSaved();
    this.getFollowers();
    this.idsarray = [];
  }

  getUserInfo(uid: string){ // trae info de la bd
    const path = 'Users';
    this.firestoreService.getDoc<UserInterface>(path, uid).subscribe( res => {
      this.user = res;
    });
  }
  getPublications(){
    this.firestoreService.getCollection<PublicationInterface>(this.path).subscribe( res => {  // res - respuesta del observador
      if (res){
        this.publications = res.filter(e => this.idCurrentUser == e.userId);
      }
      if(this.publications.length !== 0){
        this.noIdeas = false;
      }else{
        this.noIdeas = true;
      }
    console.log('publi', res);
   });
 }

  gotoEditPublication(id: string){
   this.router.navigate(['/edit-publication', id]);
  }
  async modalNewPublication() {
    const modal = await this.modalController.create({
      component: NewPublicationPage,
    });
    return await modal.present();
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
  async deletePublication(idea: PublicationInterface){
   // await this.firestoreService.deleteDoc(this.path, idea.id);
   console.log('eliminado');
  }
  async modalComments(id: string, idTo: string) {
    const modal = await this.modalController.create({
      component: CommentsPage,
      componentProps: {
        idPubli: id,
        idToP: idTo
      }
    });
    return await modal.present();
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
  getPublicationsSaved(){
    const path = 'Saved/';
    this.firestoreService.getCollection<PublicationInterface>(path).subscribe( res => {  // res - respuesta del observador
      if (res){
        this.savedPublications = res.filter(word => word.idUserSave === this.idCurrentUser);
      }
      console.log('guardados', res);
   });
  }
  async presentAlertConfirm(idea: PublicationInterface) {
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
           this.noIdeas = false;
           this.presentSuccessToast('Publicación eliminada');
           console.log('eliminado');
         }
       }
     ]
   });
   await alert.present();
  }
  async presentWarningToast(msg) {
  const toast = await this.toastController.create({
    message: msg,
    duration: 1000,
    color: 'warning'
  });
  toast.present();

  }
  async presentSuccessToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 1000,
      color: 'success'
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
    getSafeUrl(url, id){
      this.idsarray.push(id);
      if(this.idsarray.includes(id)){
      }
      this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url); 
      var form = document.createElement('iframe');
        form.width="100%";
        form.height="370px";
        //form.id=id;
        form.setAttribute("src", url);
        form.setAttribute("id",id);
        document.getElementById(id).appendChild(form);
    }
    getFollowers(){
      const pathF = 'Followers';
      const followers = this.firestoreService.getCollection<UserInterface>(pathF).subscribe( res => {  // res - respuesta del observador
        this.users = res.filter(word => this.idCurrentUser == word.idUserFollow);
        this.count = this.users.length;
      });
      followers.unsubscribe;
    }
    goFollowers(){
      this.router.navigate(['Followers']);
    }
}
