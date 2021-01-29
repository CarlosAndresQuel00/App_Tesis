import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserInterface } from '../shared/user.interface';

import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  message = '';
  public user: Observable<UserInterface>;

  constructor(public fireAuth: AngularFireAuth, private fireStore: AngularFirestore){
    this.getUid();
  }

  async register(email: string, password: string){
    try{
      await this.fireAuth.createUserWithEmailAndPassword(email, password);
      await this.sendVerificationEmail();
    }catch (error){
      console.log(error);
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

  isEmailVerified(user: UserInterface){
    return user.emailVerified === true ? true : false;
  }

  async sendVerificationEmail(): Promise<void>{
    try{
      return (await this.fireAuth.currentUser).sendEmailVerification();
    }catch (error){
      console.log('Error', error);
    }
  }
  userDetails() {
    return this.fireAuth.user;
  }
  logout(){
    this.fireAuth.signOut();
  }
 stateAuth(){ // estado de autenticacion
  return this.fireAuth.authState;
  }
 getAuth(){
  return this.fireAuth.authState.pipe(map(auth => auth));
  }

/*
  async logout(): Promise<void>{
    try{
      await this.fireAuth.signOut();
    }catch (error){
      console.log('Error->', error);
    }
  }

  private updateUserData(user: UserInterface){
    const userRef: AngularFirestoreDocument<UserInterface> = this.fireStore.doc(`users/${user.uid}`);
    // buscar dentro del conjunto
    // users toma el id del suaurio actual
    const data: UserInterface = {
      uid: user.uid,
      email: user.email,
      emailVerified: user.emailVerified,
      displayName: user.displayName
    };

    return userRef.set(data, {merge: true});
  }*/

  /*constructor(private fireAuth: AngularFireAuth) { }

  registerUser(value) {
    return new Promise<any>((resolve, reject) => {

      this.fireAuth.createUserWithEmailAndPassword(value.email, value.password)
        .then(
          res => resolve(res),
          err => reject(err))
    })

  }

  loginUser(value) {
    return new Promise<any>((resolve, reject) => {
      this.fireAuth.signInWithEmailAndPassword(value.email, value.password)
        .then(
          res => resolve(res),
          err => reject(err))
    })
  }

  logoutUser() {
    return new Promise((resolve, reject) => {
      if (this.fireAuth.currentUser) {
        this.fireAuth.signOut()
          .then(() => {
            console.log("LOG Out");
            //resolve();
          }).catch((error) => {
            reject();
          });
      }
    })
  }

  userDetails() {
    return this.fireAuth.user
  }*/

}

