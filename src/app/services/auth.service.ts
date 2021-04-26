import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserInterface } from '../shared/user.interface';

import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import firebase from 'firebase';
import { GooglePlus } from '@ionic-native/google-plus/ngx';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  message = '';
  public user: Observable<UserInterface>;
  public userData$: Observable<firebase.User>;

  constructor(public fireAuth: AngularFireAuth,  private router: Router){
    this.userData$ = fireAuth.authState;
  }

  async register(email: string, password: string): Promise<UserInterface>{
    try{
      const {user} = await this.fireAuth.createUserWithEmailAndPassword(email, password);
      return user;
    }catch (error){
      if(error.code == 'auth/invalid-email'){
        this.message = 'Formato incorrecto del correo';
      }else if(error.code == 'auth/weak-password'){
        this.message = 'La contraseña debe tener al menos 6 dígitos';
      }else if(error.code == 'auth/email-already-in-use'){
        this.message = 'El correo electrónico ingresado ya está en uso'
      }
      console.log('at', error);
    }
  }

  async loginUser(email: string, password: string){
    try{
      const {user} = await this.fireAuth.signInWithEmailAndPassword(email, password);
      return user;
    }catch (error){
      if(error.code == 'auth/invalid-email'){
        this.message = 'Correo electrónico o contraseña incorrectos';
      }else if(error.code == 'auth/user-not-found'){
        this.message = 'Usuario no encontrado o eliminado';
      }else if(error.code == 'auth/invalid-email'){
        this.message = 'Formato incorrecto del correo';
      }
      console.log(error);
    }
  }

  async resetPassword(email: string): Promise<void>{
    try{
      return this.fireAuth.sendPasswordResetEmail(email);
    }catch (error){
      console.log(error);
    }
  }
  async getUid(){ // retorna identificador de user
    const uidUser = await this.fireAuth.currentUser;
    if (uidUser === null){
      return null;
    }else{
      return uidUser.uid;
    }
  }

  userDetails() {
    return this.fireAuth.user;
  }
  logout(){
    this.fireAuth.signOut();
    this.router.navigate(['login']);
  }
  stateAuth(){ // estado de autenticacion
    return this.fireAuth.authState;
  }
  getAuth(){
    return this.fireAuth.authState.pipe(map(auth => auth));
  }
}

