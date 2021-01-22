import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-slides',
  templateUrl: './slides.page.html',
  styleUrls: ['./slides.page.scss'],
})
export class SlidesPage implements OnInit {

  slides = [
    {
      img: 'assets/img/6606.jpg',
      titulo: '¿Tienes una idea de <br>reutilización?'
    },
    {
      img: 'assets/img/img22.jpg',
      titulo: 'Comparte tu idea<br>e inspira'
    },
    {
      img: 'assets/img/64609.jpg',
      titulo: 'Salvemos al mundo<br>con ideas',
    },
  ];
  constructor(private router: Router) { }

  ngOnInit() {
  }
  goLogin(){
    this.router.navigate(['/login']);
  }
}
