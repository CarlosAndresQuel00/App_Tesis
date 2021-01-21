import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { FirestorageService } from 'src/app/services/firestorage.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { PublicationInterface } from 'src/app/shared/publication.interface';
import { UserInterface } from 'src/app/shared/user.interface';
import { ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'app-edit-publication',
  templateUrl: './edit-publication.page.html',
  styleUrls: ['./edit-publication.page.scss'],
})
export class EditPublicationPage implements OnInit {

  idPublication: string;
  idUser = '';
  isOwner = false;

  newFile: '';
  newImage: '';
  categories = [];
  newPublication: PublicationInterface = {
    id: '',
    title: '',
    description: '',
    image: '',
    file: '',
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
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.getDetallesPubli();
    this.getCategories();
  }

  async savePublication() { // registrar idea en firestorage y base de datos con id de auth
    this.presentLoading();
    const path = 'Ideas/';
    const name = this.newPublication.title;
    if (this.newFile !== undefined){
      const res = await this.fireStorageService.uploadImage(this.newFile, path, name);
      this.newPublication.image = res;
    }
    this.firestoreService.updateDoc(this.newPublication, path, this.newPublication.id).then(res => {
      this.presentToast('Cambios guardados');
      this.redirectUser(true);
    }).catch (err => {
      console.log(err);
      this.presentToast(err.message);
    });
  }
  getCategories(){
    const path = 'Categories/';
    this.firestoreService.getCollection<any>(path).subscribe( res => {  // res - respuesta del observador
      this.categories = res;
      console.log('categories', res);
     });
  }
  async newPublicationImage(event: any){
    if (event.target.files && event.target.files[0]){
      this.newFile = event.target.files[0];
      const reader = new FileReader();
      reader.onload = ((image) => {
        this.newPublication.image = image.target.result as string;
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

  getDetallesPubli(){
    this.idPublication = this.route.snapshot.paramMap.get('id');
    this.firestoreService.getOnePublication(this.idPublication).subscribe(res => {
      this.newPublication = res;
      console.log('publication->', res);
    });
  }

}
