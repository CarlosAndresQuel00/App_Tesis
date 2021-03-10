import { Component } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import { Platform } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  /*selector: 'form-field-error-example',
  templateUrl: 'form-field-error-example.html',
  styleUrls: ['form-field-error-example.css'],*/
  
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    public router: Router,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.router.navigateByUrl('splash');
    });
  }
}
