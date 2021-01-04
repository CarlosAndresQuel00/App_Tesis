import { UserInterface } from './../shared/user.interface';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';

import { PublicationInterface } from '../shared/publication.interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  publication: Observable<PublicationInterface>;
  publicationDoc: AngularFirestoreDocument<PublicationInterface>;
  private userCollection: AngularFirestoreCollection<UserInterface>;
  constructor(public database: AngularFirestore) {
    this.userCollection = database.collection<UserInterface>('User');
   }

  createDoc(data: any, path: string, id: string){ // path: ruta de base de datos id: id de documento
    const collection = this.database.collection(path);
    return collection.doc(id).set(data);
  }

  getDoc<tipo>(path: string, id: string){ // tipo es una variable cualquier auqe entra como argumento
    const collection = this.database.collection<tipo>(path);
    return collection.doc(id).valueChanges();
  }

  deleteDoc(path: string, id: string){
    const collection = this.database.collection(path);
    return collection.doc(id).delete();
  }

  updateDoc(data: any, path: string, id: string){
    const collection = this.database.collection(path);
    return collection.doc(id).update(data);
  }
  getId(){
    return this.database.createId();
  }
  getCollection<tipo>(path: string){
    const collection = this.database.collection<tipo>(path); // observador de la bd del tipo -> tipo
    console.log('collecc', collection);
    return collection.valueChanges();

  }
  getOnePublication(idp: string){
    this.publicationDoc = this.database.doc<PublicationInterface>(`Ideas/${idp}`);
    this.publication = this.publicationDoc.snapshotChanges().pipe(map(action => {
      if (action.payload.exists === false){
        return null;
      }else{
        const data = action.payload.data() as PublicationInterface;
        data.id = action.payload.id;
        return data;
      }
    }));
    return this.publication;
  }
  createDocSaved(data: any, path: string){ // path: ruta de base de datos id: id de documento
    const collection = this.database.collection(path);
    return collection.add(data);
  }
  getOnePublicationSaved(){
    this.publicationDoc = this.database.doc<PublicationInterface>('Saved/');
    return this.publicationDoc.valueChanges();
  }
}
