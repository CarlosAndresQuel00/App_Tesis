import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController, ActionSheetController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { PublicationInterface } from 'src/app/shared/publication.interface';
import { UserInterface } from 'src/app/shared/user.interface';
import { CommentsPage } from '../modals/comments/comments.page';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
@Component({
  selector: 'app-saved',
  templateUrl: './saved.page.html',
  styleUrls: ['./saved.page.scss'],
})
export class SavedPage implements OnInit {
  idsarray = [];
  safeUrl: any;
  uid: string;
  idCurrentUser: string;
  private path = 'Saved/';
  noIdeas = true;
  user: UserInterface = {
    uid: '',
    name: '',
    description: '',
    email: '',
    photo: '',
    password: ''

  };
  publications: PublicationInterface[] = [];
  constructor(
    private authSvc: AuthService,
    public firestoreService: FirestoreService,
    private router: Router,
    public alertController: AlertController,
    public modalController: ModalController,
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

  ngOnInit() {
    this.getPublicationsSaved();
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
  getPublicationsSaved(){
    this.firestoreService.getCollection<PublicationInterface>(this.path).subscribe( res => {  // res - respuesta del observador
    this.publications = res;
    if (res){
      this.publications = res.filter(word => word.idUserSave === this.idCurrentUser);
    }
    if(this.publications.length !== 0){
      this.noIdeas = false;
    }else{
      this.noIdeas = true;
    }
   });
  }
  getUserInfo(uid: string){ // trae info de la bd
    const path = 'Users';
    this.firestoreService.getDoc<UserInterface>(path, uid).subscribe( res => {
      this.user = res;
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
  gotoUserProfile(id: string ){
    this.router.navigate(['/user-profile', id]);
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

  async presentAlertConfirm(idea: PublicationInterface) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Eliminar idea',
      message: '¿Quitar idea de tu lista de guardados?',
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
            this.firestoreService.deleteDoc(this.path, idea.idSaved);
            console.log('eliminado');
          }
        }
      ]
    });
    await alert.present();
  }
  //social sharing
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
  
}
