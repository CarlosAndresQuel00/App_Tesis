import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';
import { PublicationInterface } from 'src/app/shared/publication.interface';
import { Router } from '@angular/router';
import { FirestorageService } from 'src/app/services/firestorage.service';
import { ToastController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { UserInterface } from 'src/app/shared/user.interface';

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
    photo: '',
    file: '',
    date: new Date(),
    userId: '',
    userName: '',
    userPhoto: '',
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
    public loadingController: LoadingController
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
  }

  async savePublication() { // registrar idea en firestorage y base de datos con id de auth
    this.presentLoading();
    const path = 'Ideas/';
    const name = this.newPublication.title;
    this.newPublication.userId = this.uid;
    this.newPublication.userName = this.uName;
    this.newPublication.userPhoto = this.uPhoto;
    this.newPublication.videoURL= this.getIdVideo(this.newPublication.videoURL);
    if (this.newFile !== undefined){
      const res = await this.fireStorageService.uploadImage(this.newFile, path, name);
      this.newPublication.photo = res;
    }
    this.firestoreService.createDoc(this.newPublication, path, this.newPublication.id).then(res => {
      this.presentToast('Idea publicada!');
      this.redirectUser(true);
    }).catch (err => {
      console.log(err);
      this.presentToast(err.message);
    });
  }

  async newPublicationImage(event: any){
    if (event.target.files && event.target.files[0]){
      this.newFile = event.target.files[0];
      const reader = new FileReader();
      reader.onload = ((image) => {
        this.newPublication.photo = image.target.result as string;
      });
      reader.readAsDataURL(event.target.files[0]);

    }
  }
  async redirectUser(isVerified: boolean){
    if (isVerified){
      await this.router.navigate(['home']);
    }else{
      // await this.router.navigate(['verify-email']);
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
  getUserInfo(uid: string){ // trae info de la bd
    const path = 'Users';
    this.firestoreService.getDoc<UserInterface>(path, uid).subscribe( res => {
      this.user = res;
      this.uName = this.user.name;
      this.uPhoto = this.user.photo;
    });
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
}
