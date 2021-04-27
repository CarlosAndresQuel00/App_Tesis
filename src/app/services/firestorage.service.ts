import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize} from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class FirestorageService {

  percent: Observable<number>;
  downloadUrl= '';



  constructor(public storage: AngularFireStorage) { }


  uploadImage(file: any, path: string, name: string): Promise<string>{
    return new Promise( resolve => {
      const filePath = path + '/' + name;
      const ref =  this.storage.ref(filePath);
      const task =  ref.put(file);
      task.snapshotChanges().pipe(
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
      const task =  ref.put(file);
      this.percent = task.percentageChanges();
      task.snapshotChanges().pipe(
        finalize( () => {
          ref.getDownloadURL().subscribe(res => {
            this.downloadUrl = res;
            resolve(this.downloadUrl);
            return;
          });
        })
      ).subscribe();
    });
  }

  async uploadImages(imageData: any, path: string) {
    const filePath = path;
    try {
      const imageName = this.imageName();
      return new Promise((resolve, reject) => {
        const pictureRef = this.storage.ref(filePath + imageName);
        pictureRef
          .put(imageData)
          .then(function () {
            pictureRef.getDownloadURL().subscribe((url: any) => {
              resolve(url);
            });
          })
          .catch((error) => {
            reject(error);
          });
      });
    } catch (e) {}
  }
  imageName() {
    const newTime = Math.floor(Date.now() / 1000);
    return Math.floor(Math.random() * 20) + newTime;
  }
  public tareaCloudStorage(path: string, datos: any) {
    return this.storage.upload(path, datos);
    
  }

  //Referencia del archivo
  public referenciaCloudStorage(nombreArchivo: string) {
    return this.storage.ref(nombreArchivo);
  }
}
