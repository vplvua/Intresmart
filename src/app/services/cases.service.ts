import { inject, Injectable } from '@angular/core';
import { collection, collectionData } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';

import { FirebaseService } from './firebase.service';
import { Case } from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class CasesService {
  firebaseService = inject(FirebaseService);
  destroy$ = new Subject<void>();

  private casesSubject = new BehaviorSubject<Case[]>([]);
  cases$: Observable<Case[]> = this.casesSubject.asObservable();

  constructor() {
    this.loadCases();
  }

  private loadCases() {
    this.firebaseService
      .fetchCases()
      .pipe(takeUntil(this.destroy$))
      .subscribe((cases: Case[]) => {
        this.casesSubject.next(cases);
      });
  }

  deleteCase(id: string) {
    // Delete the case from the database
  }

  updateCase(id: string, data: any) {
    // Update the case in the database
  }

  createCase(data: any) {
    // Create the case in the database
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
