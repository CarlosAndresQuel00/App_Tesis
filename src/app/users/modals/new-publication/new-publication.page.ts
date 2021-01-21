import { finalize } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../../../services/firestore.service';
import { PublicationInterface } from 'src/app/shared/publication.interface';
import { Router } from '@angular/router';
import { FirestorageService } from 'src/app/services/firestorage.service';
import { ModalController, ToastController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { UserInterface } from 'src/app/shared/user.interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-new-publication',
  templateUrl: './new-publication.page.html',
  styleUrls: ['./new-publication.page.scss'],
})
export class NewPublicationPage implements OnInit {

  newFile: '';
  newImage: '';
  uid = '';
  uName = '';
  uPhoto = '';
  public ocultar1=false;
  // p para subir archivo
  mensajeArchivo = '';
  nombreArchivo = '';
  uploadPercent: Observable<number>;
  downloadURL: Observable<string>;
  categories = [];
  public path = '';
  user: UserInterface = {
    uid: '',
    name: '',
    description: '',
    email: '',
    photo: '',
    password: '',
    emailVerified: false,

  };
  newPublication: PublicationInterface = {
    id: this.firestoreService.getId(),
    title: '',
    description: '',
    image: '',
    file: '',
    date: new Date(),
    userId: '',
    userName: '',
    userPhoto: '',
    category: '',
    idSaved: '',
    idUserSave: '',
    videoURL:'',
  };

  constructor(
    public firestoreService: FirestoreService,
    public authSvc: AuthService,
    private router: Router,
    public fireStorageService: FirestorageService,
    public toastController: ToastController,
    public loadingController: LoadingController,
    public modalCtrl: ModalController,
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
    this.presentLoading();
    const pathP = 'Ideas/';
    const name = this.newPublication.title;
    this.newPublication.userId = this.uid;
    this.newPublication.userName = this.uName;
    this.newPublication.userPhoto = this.uPhoto;
    if (this.newImage !== undefined){
      this.path = 'IdeasImg';
      const res = await this.fireStorageService.uploadImage(this.newImage, this.path, name);
      this.newPublication.image = res;
      console.log('av', res);

    }
    this.newPublication.videoURL= this.getIdVideo(this.newPublication.videoURL);
    if (this.newFile !== undefined){
      this.path = 'IdeasFile';
      const res = await this.fireStorageService.uploadFi( this.path, this.newFile, name);
      this.newPublication.file = res;
      console.log('av', res);

    }

    this.firestoreService.createDoc(this.newPublication, pathP, this.newPublication.id).then(res => {
      this.presentToast('Idea publicada!');
    }).catch (err => {
      console.log(err);
      this.presentToast(err.message);
    });
  }

  async newPublicationImage(event: any){
    if (event.target.files && event.target.files[0]){
      this.newImage = event.target.files[0];
      const reader = new FileReader();
      reader.onload = ((image) => {
        this.newPublication.image = image.target.result as string;
      });
      reader.readAsDataURL(event.target.files[0]);
    }
  }
  // subir archivo
  onUploadFile(event: any){
    this.newFile = event.target.files[0];
    console.log(this.newFile);
    const name = this.newPublication.title;
    const filePath = 'IdeasFile' + '/' + name;
    const fileRef = this.fireStorageService.refFile(filePath);
    const task = this.fireStorageService.uploadFile( filePath, this.newFile);
    this.uploadPercent = task.percentageChanges();

    task.snapshotChanges().pipe(
      finalize(() => this.downloadURL = fileRef.getDownloadURL() )
    ).subscribe();
    const reader = new FileReader();
    reader.onload = ((file) => {
      this.newPublication.file = file.target.result as string;
    });
    reader.readAsDataURL(event.target.files[0]);
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
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Publicando...',
      duration: 2000
    });
    await loading.present();

    const { role, data} = await loading.onDidDismiss();
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
}
