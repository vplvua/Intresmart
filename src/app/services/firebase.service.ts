import { inject, Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import { Case } from '../models/models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  firestore: Firestore = inject(Firestore);

  constructor() {}

  fetchArticles() {
    const articlesRef = collection(this.firestore, 'blog');
    return collectionData(articlesRef, { idField: 'id' });
  }

  fetchCases(): Observable<Case[]> {
    const casesRef = collection(this.firestore, 'cases');
    return collectionData(casesRef, { idField: 'id' });
  }

  createArticle(data: any) {
    const articlesRef = collection(this.firestore, 'blog');
    return addDoc(articlesRef, data);
  }

  updateArticle(id: string, data: any) {
    const articleRef = doc(this.firestore, 'blog', id);
    return updateDoc(articleRef, data);
  }

  deleteArticle(id: string) {
    const articleRef = doc(this.firestore, 'blog', id);
    return deleteDoc(articleRef);
  }

  createCase(data: any) {
    const casesRef = collection(this.firestore, 'cases');
    return addDoc(casesRef, data);
  }

  updateCase(id: string, data: any) {
    const caseRef = doc(this.firestore, 'cases', id);
    return updateDoc(caseRef, data);
  }

  deleteCase(id: string) {
    const caseRef = doc(this.firestore, 'cases', id);
    return deleteDoc(caseRef);
  }
}
