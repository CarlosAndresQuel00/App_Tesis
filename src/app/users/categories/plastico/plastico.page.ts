import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController,AlertController,ToastController, ActionSheetController} from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { PublicationInterface } from 'src/app/shared/publication.interface';
import { UserInterface } from 'src/app/shared/user.interface';
import { CommentsPage } from '../../modals/comments/comments.page';
import { ReportPage } from '../../modals/report/report.page';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
@Component({
  selector: 'app-plastico',
  templateUrl: './plastico.page.html',
  styleUrls: ['./plastico.page.scss'],
})
export class PlasticoPage implements OnInit {
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
  private path = 'Ideas/';
  idCurrentUser: string;
  user: UserInterface = {
    uid: '',
    name: '',
    description: '',
    email: '',
    photo: '',
    password: '',
  };
  publications: PublicationInterface[] = [];
  constructor(
    public firestoreService: FirestoreService,
    private authSvc: AuthService,
    public modalController: ModalController,
    private router: Router,
    public alertController: AlertController,
    public toastController: ToastController,
    private socialSharing:SocialSharing,
    public actionSheetController: ActionSheetController,
  ) {
    this.authSvc.stateAuth().subscribe(res => {
      console.log(res);
      if (res != null){
        this.idCurrentUser = res.uid;
        this.getUserInfo(this.idCurrentUser);
        console.log('id ini', this.idCurrentUser);
      }
    });
   }

  ngOnInit() {
    this.getPublications();
  }
  getPublications(){
    this.firestoreService.getCollection<PublicationInterface>(this.path).subscribe( res => {  // res - respuesta del observador
      this.publications = res.filter(publi => publi.category == 'Plástico');
      console.log('publi', this.publications);
   });
 }
 getUserInfo(uid: string){ // trae info de la bd
  const path = 'Users';
  this.firestoreService.getDoc<UserInterface>(path, uid).subscribe( res => {
    this.user = res;
  });
  }
  gotoEditPublication(id: string){
    this.router.navigate(['/edit-publication', id]);
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
  async modalReport(id: string) {
    const modal = await this.modalController.create({
      component: ReportPage,
      componentProps: {
        idPubli: id
      }
    });
    return await modal.present();
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
  gotoUserProfile(id: string ){
    this.router.navigate(['/user-profile', id]);
  }
  //social sharing

  shareFacebook(ide, titlePublication){
    this.socialSharing.shareViaFacebook(titlePublication, null, "https://r-utiliza.web.app/publication/"+ide);
  }

  shareTwitter(ide, titlePublication){
    this.socialSharing.shareViaTwitter(titlePublication, null, "https://r-utiliza.web.app/publication/"+ide);
  }

  shareWhatsapp(ide, titlePublication){
    this.socialSharing.shareViaWhatsApp(titlePublication, null, "https://r-utiliza.web.app/publication/"+ide);
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
}
