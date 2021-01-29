import { finalize } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../../../services/firestore.service';
import { PublicationInterface } from 'src/app/shared/publication.interface';
import { Router } from '@angular/router';
import { FirestorageService} from 'src/app/services/firestorage.service';
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
  loading;
  public ocultar1=false;
  // p para subir img
  barStatus = false;
  errorMessage = '';
  imageUploads = [];


  mensajeArchivo = '';
  nombreArchivo = '';

  //para archivo
  archivo = false;
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
    this.newPublication.videoURL= this.getIdVideo(this.newPublication.videoURL);
    this.firestoreService.createDoc(this.newPublication, pathP, this.newPublication.id).then(res => {
      this.presentToast('Idea publicada!');
      console.log(this.newPublication.id);
    }).catch (err => {
      console.log(err);
      this.presentToast(err.message);
    });
  }

  /*async newPublicationImage(event: any){
    if (event.target.files && event.target.files[0]){
      this.newImage = event.target.files[0];
      const reader = new FileReader();
      this.uploadPercent = this.fireStorageService.time;
      reader.onload = ((image) => {
        this.newPublication.image = image.target.result as string;
      });
      reader.readAsDataURL(event.target.files[0]);
    }
  }*/

  // subir imágenes
  newPublicationImage(event) {
    this.barStatus = true;
    this.newImage = event.target.files[0];
    const path = this.newPublication.id + '/';
    this.fireStorageService.uploadImages(this.newImage, path).then(
      (res: any) => {
        if (res) {
          // this.imageUploads.unshift(res);
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
  /*async newPublicationFile(event: any){
    if (event.target.files && event.target.files[0]){
      // this.uploadPercent = this.fireStorageService.percent;
      this.newFile = event.target.files[0];
      const reader = new FileReader();
      reader.onload = ((file) => {
        this.newPublication.file = file.target.result as string;
      });
      reader.readAsDataURL(event.target.files[0]);
    }
  }*/
  
  //subir archivo
  newPublicationFile(event: any){
    this.archivo = true;
    this.newFile = event.target.files[0].name;
    console.log(this.newFile);
    const filePath = 'IdeasFiles' + '/' + `${event.target.files[0].name} `;
    const fileRef = this.fireStorageService.refFile(filePath);
    const task = this.fireStorageService.uploadFile( filePath, event.target.files[0].file);
    this.uploadPercent = task.percentageChanges();

    /*task.snapshotChanges().pipe(
      finalize(()=>{
        fileRef.getDownloadURL().subscribe(this.downloadURL=>{
          newFile= this.downloadURL;
          this.save
        });
      })
    ).subscribe();
*/



    task.snapshotChanges().pipe(
      finalize(() => 
      this.downloadURL = fileRef.getDownloadURL() )
    ).subscribe();
    const reader = new FileReader();
    reader.onload = ((file) => {
      this.newPublication.file = file.target.result as string;
    });
    reader.readAsDataURL(event.target.files[0].name);
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
