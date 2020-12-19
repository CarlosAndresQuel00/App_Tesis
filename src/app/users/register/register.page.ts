// register.page.ts
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  constructor(private authSvc: AuthService, private router: Router){}

  ngOnInit(){}

  async onRegister(email, password){
    try{
      const user = await this.authSvc.register(email.value, password.value);
      if (user){
        const isVerified = this.authSvc.isEmailVerified(user);
        this.redirectUser(isVerified);
        console.log('verified->', isVerified);
      }
    }catch (error){
      console.log(error);
    }
  }
  redirectUser(isVerified: boolean){
    if (isVerified){
      this.router.navigate(['profile']);
    }else{
      this.router.navigate(['verify-email']);
    }
  }
  goLoginPage() {
    this.router.navigate(['login']);
  }
  /*validations_form: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  validation_messages = {
    'email': [
      { type: 'required', message: 'Campo requerido.' },
      { type: 'pattern', message: 'Ingresa un correo válido.' }
    ],
    'password': [
      { type: 'required', message: 'Campo requerido.' },
      { type: 'minlength', message: 'La contraseña debe tener min. 5 caracteres.' }
    ]
  };

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

  tryRegister(value) {
    this.authService.registerUser(value)
      .then(res => {
        console.log(res);
        this.errorMessage = "";
        this.successMessage = "¡Registro exitoso! Intenta iniciar sesión.";
      }, err => {
        console.log(err);
        this.errorMessage = err.message;
        this.successMessage = "";
      })
  }

  goLoginPage() {
    this.navCtrl.navigateBack('');
  }
*/

}
