import { inject, Injectable } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  firestore: Firestore = inject(Firestore);
  articles$: Observable<any[]>;
  cases$: Observable<any[]>;

  constructor() {
    const articlesRef = collection(this.firestore, 'blog');
    this.articles$ = collectionData(articlesRef, { idField: 'id' });

    const casesRef = collection(this.firestore, 'cases');
    this.cases$ = collectionData(casesRef, { idField: 'id' });
  }
}
