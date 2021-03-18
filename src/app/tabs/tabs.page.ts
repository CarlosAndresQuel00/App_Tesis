import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(private authSvc: AuthService,
    private router: Router,) {
    this.authSvc.stateAuth().subscribe(res => {
      console.log(res);
      if (!res){
        this.router.navigate(['login']);
      }
    });
  }

}
