import { finalize } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../../../services/firestore.service';
import { PublicationInterface } from 'src/app/shared/publication.interface';
import { Router } from '@angular/router';
import { FirestorageService} from 'src/app/services/firestorage.service';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { UserInterface } from 'src/app/shared/user.interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-new-publication',
  templateUrl: './new-publication.page.html',
  styleUrls: ['./new-publication.page.scss'],
})
export class NewPublicationPage implements OnInit {



  uid = '';
  uName = '';
  uPhoto = '';
  loading;
  ocultar1=false;
  path = 'Ideas/';
  
  // p para subir img
  newImage: '';
  barStatus = false;
  errorMessage = '';
  imageUploads = [];
  pathImages = '';

/*archivos*/
  archivo = false;
  mensajeArchivo = '';
  datosFormulario = new FormData();
  URLPublica = '';
  porcentaje = 0;
  finalizado = false;
  pathFiles = '';
  disabledBtn = false;
  show = true;

  categories = [];
  
  user: UserInterface = {
    uid: '',
    name: '',
    description: '',
    email: '',
    photo: '',
    password: ''
  };
  newPublication: PublicationInterface = {
    id: this.firestoreService.getId(),
    title: '',
    materials: '',
    description: '',
    image: [],
    file: '',
    date: new Date(),
    userId: '',
    userName: '',
    userPhoto: '',
    category: '',
    videoURL:'',
  };

  constructor(
    public firestoreService: FirestoreService,
    public authSvc: AuthService,
    public fireStorageService: FirestorageService,
    public toastController: ToastController,
    public loadingController: LoadingController,
    public modalCtrl: ModalController,
    public alertController: AlertController,
  ) {
    this.authSvc.stateAuth().subscribe(res => {
      console.log(res);
      if (res != null){
        this.uid = res.uid;
        this.getUserInfo(this.uid);
        console.log(this.uid);
      }else{
        console.log('user not found');
      }
    });
   }

  ngOnInit() {
  this.getCategories();
  }

  async savePublication() { // registrar idea en firestorage y base de datos con id de auth
    if(this.newPublication.title != '' && this.newPublication.description != ''){
      this.presentLoading();
      this.newPublication.userId = this.uid;
      this.newPublication.userName = this.uName;
      this.newPublication.userPhoto = this.uPhoto;
      if(this.newPublication.videoURL != ''){
        this.newPublication.videoURL="https://www.youtube.com/embed/"+this.getIdVideo(this.newPublication.videoURL)+"?enablejsapi=1&origin=https://r-utiliza.web.app/";
      }else{
        this.newPublication.videoURL=''; 
      } 
      this.firestoreService.createDoc(this.newPublication, this.path, this.newPublication.id).then(res => {
        this.presentToast('Idea publicada!');
        console.log(this.newPublication.id);
        this.dismiss();
      }).catch (err => {
        console.log(err);
        this.presentToast(err.message);
      });
    }else{
      this.presentWarningToast('Los campos con * son obligatorios');
    }

  }
  
  // subir imágenes
  newPublicationImage(event) {
    this.barStatus = true;
    this.newImage = event.target.files[0];
    this.pathImages =  'IdeasImages/' + this.uName + '/' + this.newPublication.id + '/';
    this.fireStorageService.uploadImages(this.newImage, this.pathImages).then(
      (res: any) => {
        if (res) {
          this.newPublication.image.unshift(res);
          console.log('theimgs', res);
          this.barStatus = false;
        } 
      },
      (error: any) => {
        this.errorMessage = 'File size exceeded. Maximum file size 1 MB'
        this.barStatus = false;
      }
    );
  }
  removeImage(img){
    let index = this.newPublication.image.indexOf(img);
    this.newPublication.image.splice(index, 1);
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000,
      color: 'success'
    });
    toast.present();
  }
  async presentWarningToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000,
      color: 'danger'
    });
    toast.present();
  }
  async presentLoading() {
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Publicando...',
      duration: 2000
    });
    await this.loading.present();

     const { role, data} = await this.loading.onDidDismiss();
     console.log('Loading dismissed!');
  }

  getUserInfo(uid: string){ // trae info de la bd
    const path = 'Users';
    this.firestoreService.getDoc<UserInterface>(path, uid).subscribe( res => {
      this.user = res;
      this.uName = this.user.name;
      this.uPhoto = this.user.photo;
    });
  }
  getCategories(){
    const path = 'Categories/';
    this.firestoreService.getCollection<any>(path).subscribe( res => {  // res - respuesta del observador
      this.categories = res;
      console.log('categories', res);
     });
  }
  dismiss() {
    this.modalCtrl.dismiss();
  }
  /* VIDEOS*/
//Obtiene el ID de las URL de los videos de Youtube
  getIdVideo(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
  console.log('este id', (match && match[2].length === 11)
  ? match[2]
  : null)
      return (match && match[2].length === 11)
        ? match[2]
        : null;
    }

   //Ocultar/mostrar item de Url
  accion1(){
    this.ocultar1 = !this.ocultar1;
    if(this.ocultar1==false){
      this.newPublication.videoURL = "";
    }
  } 
  
  
  /*archivo*/
  public cambioArchivo(event) {
    this.archivo = true;
    this.disabledBtn = true;
    if (event.target.files.length > 0) {
      for (let i = 0; i < event.target.files.length; i++) {
        this.mensajeArchivo = `Archivo preparado: ${event.target.files[i].name}`;
        this.pathFiles = 'IdeasFiles/' + this.uName + '/' + this.newPublication.id + '/' + event.target.files[i].name;
        this.newPublication.fileName = event.target.files[i].name;
        this.datosFormulario.delete('archivo');
        this.datosFormulario.append('archivo', event.target.files[i], event.target.files[i].name)
      }
    } else {
      this.mensajeArchivo = 'No hay un archivo seleccionado';
    }
  }

  //Sube el archivo a Cloud Storage
  public subirArchivo() {
    this.barStatus = true;
    let archivo = this.datosFormulario.get('archivo');
    let tarea = this.fireStorageService.tareaCloudStorage(this.pathFiles, archivo);
    
    //Cambia el porcentaje
    tarea.percentageChanges().subscribe((porcentaje) => {  
      this.porcentaje = Math.round(porcentaje);
      if (this.porcentaje == 100) {
        this.finalizado = true;
        this.barStatus = false;
        this.show = false;
        this.buscar(this.pathFiles);
      }
    });
  }
  buscar(name: string){
    let referencia = this.fireStorageService.referenciaCloudStorage(name);
    if(referencia){
      referencia.getDownloadURL().subscribe((URL) => {
            this.URLPublica = URL;
            this.newPublication.file = this.URLPublica;
            console.log('url',this.URLPublica);
      });
    }
  }
  removeFile(){
    this.disabledBtn = false;
    this.newPublication.file = '';
    this.newPublication.fileName = '';
    this.archivo = false;
  }
  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Eliminar idea',
      message: '¿Estás seguro de eliminar este archivo?',
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
            this.removeFile();
            this.presentToast('Archivo borrado');
            this.finalizado = false;
            this.show = true;
            console.log('eliminado');
          }
        }
      ]
    });
    await alert.present();
  }
}
