import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { FirebaseService } from './firebase.service';
import {
  BehaviorSubject,
  catchError,
  finalize,
  map,
  Observable,
  of,
  OperatorFunction,
  Subject,
  switchMap,
  take,
  takeUntil,
  tap,
  throwError,
} from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { DocumentReference } from '@angular/fire/firestore';

import { Vacancy } from '../models/models';
import { ErrorHandlingService } from './error-handling.service';
import { SlugService } from './slug.service';

@Injectable({
  providedIn: 'root',
})
export class VacanciesService {
  private firebaseService = inject(FirebaseService);
  private errorService = inject(ErrorHandlingService);
  private slugService = inject(SlugService);
  private destroy$ = new Subject<void>();
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private platformId = inject(PLATFORM_ID);

  private vacanciesSubject = new BehaviorSubject<Vacancy[]>([]);
  vacancies$: Observable<Vacancy[]> = this.vacanciesSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadVacancies().pipe(takeUntil(this.destroy$)).subscribe();
    }
  }

  private handleError(message: string) {
    return (error: any) => {
      this.errorService.handleError(message);
      return throwError(() => error);
    };
  }

  private updateListAfterCreate(): OperatorFunction<
    DocumentReference,
    DocumentReference
  > {
    return tap((ref: DocumentReference) => {
      this.loadVacancies().pipe(take(1), takeUntil(this.destroy$)).subscribe();
      return ref;
    });
  }

  private updateListAfterModify(): OperatorFunction<void, void> {
    return tap(() => {
      this.loadVacancies().pipe(take(1), takeUntil(this.destroy$)).subscribe();
    });
  }

  loadVacancies(): Observable<Vacancy[]> {
    if (!isPlatformBrowser(this.platformId)) {
      return of([]);
    }

    this.loadingSubject.next(true);

    return this.firebaseService.fetchVacancies().pipe(
      take(1),
      tap((vacancies) => {
        this.vacanciesSubject.next(vacancies);
        this.loadingSubject.next(false);
      }),
      catchError(this.handleError('Failed to load vacancies'))
    );
  }

  createVacancy(data: Partial<Vacancy>): Observable<DocumentReference> {
    this.loadingSubject.next(true);

    return this.slugService.createSlug(data.title || '').pipe(
      take(1),
      switchMap((slug) => {
        const vacancyData = { ...data, slug };
        return this.firebaseService.createVacancy(vacancyData).pipe(
          take(1),
          this.updateListAfterCreate(),
          catchError(this.handleError('Failed to create vacancy')),
          finalize(() => this.loadingSubject.next(false))
        );
      })
    );
  }

  updateVacancy(id: string, data: Partial<Vacancy>): Observable<void> {
    this.loadingSubject.next(true);

    if (data.title) {
      return this.slugService.updateSlug(id, data.title).pipe(
        take(1),
        switchMap((slug) => {
          const updateData = { ...data, slug };
          return this.firebaseService.updateVacancy(id, updateData).pipe(
            take(1),
            this.updateListAfterModify(),
            catchError(this.handleError('Failed to update vacancy')),
            finalize(() => this.loadingSubject.next(false))
          );
        })
      );
    }

    return this.firebaseService.updateVacancy(id, data).pipe(
      take(1),
      this.updateListAfterModify(),
      catchError(this.handleError('Failed to update vacancy')),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  deleteVacancy(vacancyId: string): Observable<void> {
    if (!vacancyId) {
      return throwError(() => new Error('Vacancy ID is required'));
    }

    this.loadingSubject.next(true);

    return this.firebaseService.deleteVacancy(vacancyId).pipe(
      take(1),
      this.updateListAfterModify(),
      catchError(this.handleError('Failed to delete vacancy')),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  getVacancyBySlug(slug: string): Observable<Vacancy | undefined> {
    return this.vacancies$.pipe(
      map((vacancies) => vacancies.find((v) => v.slug === slug))
    );
  }

  archiveVacancy(vacancy: Vacancy): Observable<void> {
    if (!vacancy.id) {
      return throwError(() => new Error('Vacancy ID is required'));
    }

    return this.updateVacancy(vacancy.id, { ...vacancy, archive: true });
  }

  unArchiveVacancy(vacancy: Vacancy): Observable<void> {
    if (!vacancy.id) {
      return throwError(() => new Error('Vacancy ID is required'));
    }

    return this.updateVacancy(vacancy.id, { ...vacancy, archive: false });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
