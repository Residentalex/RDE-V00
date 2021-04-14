import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class FirestorageService {

  constructor(
    private fileStorgae: AngularFireStorage
  ) { }

  uploadImage(file: any, path: string, fileName: string): Promise<string> {
    return new Promise(resolve => {
      const filePath = path + fileName;
      const fileRef = this.fileStorgae.ref(filePath);
      const task = fileRef.put(file);
     
      task.snapshotChanges().pipe(
        finalize( ()=>{
         fileRef.getDownloadURL().subscribe(res => {
          const imageUrl = res;
          resolve(imageUrl);
          return;
         });
        })
      ).subscribe();
    });
  }
}
