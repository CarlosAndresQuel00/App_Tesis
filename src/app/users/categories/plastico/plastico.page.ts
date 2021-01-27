import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { PublicationInterface } from 'src/app/shared/publication.interface';
import { UserInterface } from 'src/app/shared/user.interface';
import { CommentsPage } from '../../modals/comments/comments.page';
import { ReportPage } from '../../modals/report/report.page';

@Component({
  selector: 'app-plastico',
  templateUrl: './plastico.page.html',
  styleUrls: ['./plastico.page.scss'],
})
export class PlasticoPage implements OnInit {

  private path = 'Ideas/';
  idCurrentUser: string;
  user: UserInterface = {
    uid: '',
    name: '',
    description: '',
    email: '',
    photo: '',
    password: '',
    emailVerified: false,
  };
  publications: PublicationInterface[] = [];
  constructor(
    public firestoreService: FirestoreService,
    private authSvc: AuthService,
    public modalController: ModalController,
    private router: Router,
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
}
