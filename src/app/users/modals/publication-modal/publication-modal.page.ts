import { NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-publication-modal',
  templateUrl: './publication-modal.page.html',
  styleUrls: ['./publication-modal.page.scss'],
})
export class PublicationModalPage implements OnInit {

  constructor(
    public navCtrl: NavController
  ) { }

  ngOnInit() {
  }
  goBackHome(){
    this.navCtrl.navigateBack('/home');
  }

}
