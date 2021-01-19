import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class FirestorageService {

  constructor(public storage: AngularFireStorage) { }

  uploadImage(file: any, path: string, name: string): Promise<string>{
    return new Promise( resolve => {
      const filePath = path + '/' + name;
      const ref =  this.storage.ref(filePath);
      const Task =  ref.put(file);
      Task.snapshotChanges().pipe(
        finalize( () => {
          ref.getDownloadURL().subscribe(res => {
            const downloadUrl = res;
            resolve(downloadUrl);
            return;
          });
        })
      ).subscribe();
    });
  }
  // Tarea para subir archivo
  public uploadFile( filePath: string, file: any) {
    return this.storage.upload(filePath, file);
  }

  // Referencia del archivo
  public refFile(nombreArchivo: string) {
    return this.storage.ref(nombreArchivo);
  }
  uploadFi(file: any, path: string, name: string): Promise<string>{
    return new Promise( resolve => {
      const filePath = path + '/' + name;
      const ref =  this.storage.ref(filePath);
      const Task =  ref.put(file);
      Task.snapshotChanges().pipe(
        finalize( () => {
          ref.getDownloadURL().subscribe(res => {
            const downloadUrl = res;
            resolve(downloadUrl);
            return;
          });
        })
      ).subscribe();
    });
  }
}
