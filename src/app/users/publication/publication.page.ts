import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { PublicationInterface } from 'src/app/shared/publication.interface';

@Component({
  selector: 'app-publication',
  templateUrl: './publication.page.html',
  styleUrls: ['./publication.page.scss'],
})
export class PublicationPage implements OnInit {

  idPublication: string;
  idUser = '';
  isOwner = false;
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
  constructor(
    public firestoreService: FirestoreService,
    public authSvc: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    
  }
  getDetallesPubli(){
    const path = 'Ideas/'
    this.idPublication = this.route.snapshot.paramMap.get('id');
    this.firestoreService.getDoc<PublicationInterface>(path,this.idPublication).subscribe(res => {
      this.publication = res;
      console.log('publication->', res);
    });
  }

  gotoRegister(){
    this.router.navigate(["/register"]);
  }
}
