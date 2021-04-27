import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController,AlertController,ToastController, ActionSheetController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { PublicationInterface } from 'src/app/shared/publication.interface';
import { ReportPage } from '../modals/report/report.page';
import { UserInterface } from 'src/app/shared/user.interface';
import { CommentsPage } from '../modals/comments/comments.page';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
@Component({
  selector: 'app-publication',
  templateUrl: './publication.page.html',
  styleUrls: ['./publication.page.scss'],
})
export class PublicationPage implements OnInit {
  idsarray = [];
  safeUrl: any;
  saved = false;
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
  idCurrentUser: string;
  idPublication: string;
  errorMessage = '';
  idUser = '';
  isOwner = false;
  private path = 'Ideas/';
  noExists = false;
  // Para verificar guardados
  savedPublications: PublicationInterface[] = [];
  publi: PublicationInterface[] = [];
  publication: PublicationInterface = {
    id: '',
    title: '',
    description: '',
    image: [],
    file: '',
    date: new Date(),
    userId: '',
    category: '',
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
    public firestoreService: FirestoreService,
    public authSvc: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    public modalController: ModalController,
    public alertController: AlertController,
    public toastController: ToastController,
    private socialSharing:SocialSharing,
    public actionSheetController: ActionSheetController,
    private sanitizer: DomSanitizer
  ) {
   
   }

  ngOnInit() {
    this.getDetallesPubli();
    this.getPublicationsSaved();
    this.idsarray = [];
  }
  getDetallesPubli(){
    this.idPublication = this.route.snapshot.paramMap.get('id');
    if(this.idPublication){
      const path = 'Ideas/'
      this.firestoreService.getDoc<PublicationInterface>(path,this.idPublication).subscribe(res => {
        this.publication = res;
        console.log('publication->', res);
      });
    }else{
      this.noExists = true;
    }
    
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
  gotoUserProfile(id: string ){
    this.router.navigate(['/user-profile', id]);
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
            console.log('eliminado');
          }
        }
      ]
    });
    await alert.present();
  }
  gotoEditPublication(id: string){
    this.router.navigate(['/edit-publication', id]);
   }

   getUserInfo(uid: string){ // trae info de la bd
    const path = 'Users';
    this.firestoreService.getDoc<UserInterface>(path, uid).subscribe( res => {
      this.user = res;
    });
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
  goBack(){
    this.authSvc.stateAuth().subscribe(res => {
      console.log(res);
      if (res != null){
        this.router.navigate(["/notifications"]);
      }else{
        this.router.navigate(["/register"]);
      }
    });
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

}
