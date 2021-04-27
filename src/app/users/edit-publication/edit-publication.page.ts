import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ModalController, ToastController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { FirestorageService } from 'src/app/services/firestorage.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { PublicationInterface } from 'src/app/shared/publication.interface';
import { ActivatedRoute} from '@angular/router';


@Component({
  selector: 'app-edit-publication',
  templateUrl: './edit-publication.page.html',
  styleUrls: ['./edit-publication.page.scss'],
})
export class EditPublicationPage implements OnInit {

  idPublication: string;
  idUser = '';
  isOwner = false;
  path = 'Ideas/';

  barStatus = false;
  errorMessage = '';
  imageUploads = [];
  pathImages = '';
  newImage: '';
  ocultar1 =false;
  block = false;
  
  /*archivos*/
  archivo = false;
  mensajeArchivo = '';
  datosFormulario = new FormData();
  URLPublica = '';
  porcentaje = 0;
  finalizado = false;
  pathFiles = '';
  disabledBtn = true;
  show = true;

  categories = [];
 
  
  newPublication: PublicationInterface = {
    id: '',
    title: '',
    materials: '',
    description: '',
    image: [],
    file: '',
    fileName: '',
    date: new Date(),
    userId: '',
    category: '',
  };
  constructor(
    public firestoreService: FirestoreService,
    public authSvc: AuthService,
    private router: Router,
    public fireStorageService: FirestorageService,
    public toastController: ToastController,
    public loadingController: LoadingController,
    private route: ActivatedRoute,
    public alertController: AlertController,
    private navCtl: NavController
  ) { }

  ngOnInit() {
    this.getDetallesPubli();
    this.getCategories();
  }

  async savePublication() { // registrar idea en firestorage y base de datos con id de auth
    if(this.newPublication.title != '' && this.newPublication.description != ''){
      this.presentLoading();
      if(this.newPublication.videoURL != ''){
        this.newPublication.videoURL="https://www.youtube.com/embed/"+this.getIdVideo(this.newPublication.videoURL)+"?enablejsapi=1&origin=https://r-utiliza.web.app/";
      }else{
        this.newPublication.videoURL=''; 
      } 
      this.firestoreService.updateDoc(this.newPublication, this.path, this.newPublication.id).then(res => {
        this.presentToast('Cambios guardados');
        this.redirectUser(true);
      }).catch (err => {
        console.log(err);
        this.presentToast(err.message);
      });
    }else{
      this.presentWarningToast('Los campos con * son obligatorios');
    }
    //window.location.href="/";
    
  }
  getCategories(){
    const path = 'Categories/';
    this.firestoreService.getCollection<any>(path).subscribe( res => {  // res - respuesta del observador
      this.categories = res;
      console.log('categories', res);
     });
  }
  //subir imagenes
  newPublicationImage(event) {
    this.barStatus = true;
    this.newImage = event.target.files[0];
    this.pathImages = 'IdeasImages/' + this.newPublication.userName + '/' + this.newPublication.id + '/';
    this.fireStorageService.uploadImages(this.newImage, this.pathImages).then(
      (res: any) => {
        if (res) {
          this.newPublication.image.unshift(res);
          if(this.newPublication.image.length == 5){
            this.block = true;
          }
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
    this.newPublication.image.length-1;
    this.block = false;
    this.firestoreService.updateDoc(this.newPublication, this.path, this.newPublication.id).then(res => {
    }).catch (err => {
      console.log(err);
      this.presentToast(err.message);
    });
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
  //subir archivos

  public cambioArchivo(event) {
    this.archivo = true;
    this.show = true;
    this.disabledBtn = true;
    if (event.target.files.length > 0) {
      for (let i = 0; i < event.target.files.length; i++) {
        this.pathFiles = 'IdeasFiles/' + this.newPublication.userName + '/' + this.newPublication.id + '/' + event.target.files[i].name;
        this.mensajeArchivo = `${event.target.files[i].name}`;
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
  removeFile(){
    this.disabledBtn = false;
    this.newPublication.file = '';
    this.newPublication.fileName = '';
    this.firestoreService.updateDoc(this.newPublication, this.path, this.newPublication.id).then(res => {
      this.archivo = false;
    }).catch (err => {
      console.log(err);
      this.presentToast(err.message);
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
  async redirectUser(ok: boolean){
    if (ok){
      /*this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
this.router.navigate(['/profile'])
);*/
      await this.router.navigate(['/home']);
      window.location.reload();
      
    }else{
      console.log('no');
    }
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
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Publicando...',
      duration: 1000
    });
    await loading.present();

    const { role, data} = await loading.onDidDismiss();
    console.log('Loading dismissed!');
  }

  getDetallesPubli(){
    this.idPublication = this.route.snapshot.paramMap.get('id');
    this.firestoreService.getDoc<PublicationInterface>(this.path,this.idPublication).subscribe(res => {
      this.newPublication = res;
      if(this.newPublication.file){
        this.finalizado = false;
        this.disabledBtn = true;
        this.show = false;
      }else{
        this.disabledBtn = false;
      }
      console.log('publication->', res);
    });
  }
  accion1(){
    this.ocultar1 = !this.ocultar1;
   
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
            console.log('eliminado');
          }
        }
      ]
    });
    await alert.present();
  }
  back(){
    this.navCtl.back();
  }
}