import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(public firestore: AngularFirestore) { }

  getDocs(collection: string) {
    return this.firestore.collection(collection).snapshotChanges();
  }

  getDocsPromise(collection: string) {
    return this.firestore.collection(collection).get();
  }

  getDoc(collection: string, documentId: string) {
    return this.firestore.collection(collection).doc(documentId).snapshotChanges();
  }

  getDocPromise(collection: string, documentId: string) {
    return this.firestore.collection(collection).doc(documentId).get();
  }

  getDocQuery(collection: string, key: string, equal: boolean, value: any) {
    return this.firestore.collection(collection, ref => ref.where(key, (equal ? '==' : '<='), value)).snapshotChanges();
  }

  addDoc2(collection: string, documentId: string, doc: any) {
    return this.firestore.collection(collection).doc(documentId).set(doc);
  }

  addDoc(collection: string, doc: any) {
    return this.firestore.collection(collection).add(doc);
  }

  updateDoc(collection: string, documentId: string, obj: any) {
    return this.firestore.collection(collection).doc(documentId).update(obj);
  }

  deleteDoc(collection: string, documentId: string) {
    return this.firestore.collection(collection).doc(documentId).delete();
  }
  
}
