import { RouterModule } from '@angular/router';
// login.page.ts
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  validationsForm: FormGroup;
  errorMessage: '';
  constructor(
    private authSvc: AuthService,
    private router: Router,
    private formBuild: FormBuilder
  ) { }

  validationMessages = {
    email: [
      { type: 'required', message: 'Campo requerido.' },
      { type: 'pattern', message: 'Ingresa un correo válido.' }
    ],
    password: [
      { type: 'required', message: 'Campo requerido.' },
      { type: 'minlength', message: 'La contraseña debe contener min. 5 caracteres.' }
    ]
  };

  ngOnInit() {
    this.validationsForm = this.formBuild.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required
      ])),
    });
  }

  async onLogin(email, password){
    try{
      const user = await this.authSvc.login(email.value, password.value);
      if (user){
        const isVerified = this.authSvc.isEmailVerified(user);
        this.redirectUser(isVerified);
        this.errorMessage = '';
      }

    } catch (error){
      this.errorMessage = error;
    }
  }

  async onLoginGoogle(){
    try{
      const user = await this.authSvc.loginGoogle();
      if (user){
        const isVerified = this.authSvc.isEmailVerified(user);
        this.redirectUser(isVerified);
      }
    } catch (error){
      this.errorMessage = error;
    }
  }
  redirectUser(isVerified: boolean){
    if (isVerified){
      this.router.navigate(['profile']);
    }else{
      this.router.navigate(['verify-email']);
    }
  }

}

/* // login.page.ts
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  validations_form: FormGroup;
  errorMessage: string = '';

  constructor(

    private navCtrl: NavController,
    private authService: AuthService,
    private formBuilder: FormBuilder

  ) { }

  ngOnInit() {
    this.validations_form = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required
      ])),
    });
  }


  validation_messages = {
    'email': [
      { type: 'required', message: 'Campo requerido.' },
      { type: 'pattern', message: 'Ingresa un correo válido.' }
    ],
    'password': [
      { type: 'required', message: 'Campo requerido.' },
      { type: 'minlength', message: 'La contraseña debe contener min. 5 caracteres.' }
    ]
  };


  loginUser(value) {
    this.authService.loginUser(value)
      .then(res => {
        console.log(res);
        this.errorMessage = "";
        this.navCtrl.navigateForward('/home');
      }, err => {
        this.errorMessage = err.message;
      })
  }
  loginGoogle(){
    alert("holi");
  }
  goToRegisterPage() {
    this.navCtrl.navigateForward('/register');
  }

}
*/
