import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { FirestorageService } from 'src/app/services/firestorage.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { PublicationInterface } from 'src/app/shared/publication.interface';
import { UserInterface } from 'src/app/shared/user.interface';
import { ActivatedRoute, Params} from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-edit-publication',
  templateUrl: './edit-publication.page.html',
  styleUrls: ['./edit-publication.page.scss'],
})
export class EditPublicationPage implements OnInit {

  idPublication: string;
  idUser = '';
  isOwner = false;

  barStatus = false;
  errorMessage = '';
  imageUploads = [];

  newFile: '';
  newImage: '';
  archivo = false;
  public ocultar1=false;
  uploadPercent: Observable<number>;
  downloadURL: Observable<string>;
  categories = [];
  mensajeArchivo = '';
  nombreArchivo = '';
  
  newPublication: PublicationInterface = {
    id: '',
    title: '',
    materials: '',
    description: '',
    image: [],
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
  //subir imagenes
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
  //subir archivos
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
    const path = 'Ideas/'
    this.idPublication = this.route.snapshot.paramMap.get('id');
    this.firestoreService.getDoc<PublicationInterface>(path,this.idPublication).subscribe(res => {
      this.newPublication = res;
      console.log('publication->', res);
    });
  }
  accion1(){
    this.ocultar1 = !this.ocultar1;
    if(this.ocultar1==false){
      this.newPublication.videoURL = "";
    }
  } 
}
