import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { DocumentData, DocumentReference } from '@angular/fire/firestore';
import {
  BehaviorSubject,
  catchError,
  finalize,
  map,
  Observable,
  Subject,
  switchMap,
  take,
  takeUntil,
  tap,
  throwError,
} from 'rxjs';

import { FirebaseService } from './firebase.service';
import { Case, CaseFileUrls } from '../models/models';
import { ErrorHandlingService } from './error-handling.service';
import { isPlatformBrowser } from '@angular/common';
import { SlugService } from './slug.service';

@Injectable({
  providedIn: 'root',
})
export class CasesService {
  private firebaseService = inject(FirebaseService);
  private errorService = inject(ErrorHandlingService);
  private slugService = inject(SlugService);
  private destroy$ = new Subject<void>();
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private platformId = inject(PLATFORM_ID);

  private casesSubject = new BehaviorSubject<Case[]>([]);
  cases$: Observable<Case[]> = this.casesSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadCases();
    }
  }

  private refreshCases(): void {
    this.loadCases();
  }

  private loadCases() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.loadingSubject.next(true);

    this.firebaseService
      .fetchCases()
      .pipe(
        take(1),
        takeUntil(this.destroy$),
        tap((cases) => {
          this.slugService.updateCases(cases);
          this.casesSubject.next(cases);
          this.loadingSubject.next(false);
        }),
        catchError((error) => {
          this.errorService.handleError('Failed to load cases');
          this.loadingSubject.next(false);
          return throwError(() => error);
        })
      )
      .subscribe({
        error: (error) => console.error('Subscription error:', error),
        complete: () => {},
      });
  }

  deleteCase(caseItem: Case): Observable<void> {
    if (!caseItem.id) {
      return throwError(() => new Error('Case ID is required'));
    }

    this.loadingSubject.next(true);

    return this.firebaseService.deleteCase(caseItem).pipe(
      take(1),
      tap(() => this.refreshCases()),
      catchError((error) => {
        this.errorService.handleError('Failed to delete case');
        return throwError(() => error);
      }),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  updateCase(id: string, data: Partial<Case>): Observable<void> {
    this.loadingSubject.next(true);

    if (data.title) {
      return this.slugService.updateSlug(id, data.title).pipe(
        take(1),
        switchMap((slug) => {
          const updateData = { ...data, slug };

          return this.firebaseService.updateCase(id, updateData).pipe(
            take(1),
            tap(() => {
              this.refreshCases();
            }),
            catchError((error) => {
              this.errorService.handleError('Failed to update case');
              return throwError(() => error);
            }),
            finalize(() => {
              this.loadingSubject.next(false);
            })
          );
        })
      );
    }

    return this.firebaseService.updateCase(id, data).pipe(
      take(1),
      tap(() => {
        this.refreshCases();
      }),
      catchError((error) => {
        this.errorService.handleError('Failed to update case');
        return throwError(() => error);
      }),
      finalize(() => {
        this.loadingSubject.next(false);
      })
    );
  }

  getCaseBySlug(slug: string): Observable<Case | undefined> {
    return this.cases$.pipe(map((cases) => cases.find((c) => c.slug === slug)));
  }

  createCase(
    caseData: Partial<Case>
  ): Observable<DocumentReference<DocumentData>> {
    this.loadingSubject.next(true);

    return this.slugService.createSlug(caseData.title || '').pipe(
      take(1),
      switchMap((slug) => {
        const data = { ...caseData, slug };

        return this.firebaseService.createCase(data).pipe(take(1));
      }),
      tap(() => {
        this.refreshCases();
      }),
      catchError((error) => {
        this.errorService.handleError('Failed to create case');
        return throwError(() => error);
      }),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  archiveCase(caseItem: Case): Observable<void> {
    if (!caseItem.id) {
      return throwError(() => new Error('Case ID is required'));
    }

    return this.updateCase(caseItem.id, { ...caseItem, archive: true }).pipe(
      take(1)
    );
  }

  unArchiveCase(caseItem: Case): Observable<void> {
    if (!caseItem.id) {
      return throwError(() => new Error('Case ID is required'));
    }

    return this.updateCase(caseItem.id, { ...caseItem, archive: false }).pipe(
      take(1)
    );
  }

  uploadFiles(files: {
    mainImg?: File;
    sideImg?: File;
    imageCard?: File;
    video?: File;
    svg?: File;
  }): Observable<CaseFileUrls> {
    this.loadingSubject.next(true);

    return this.firebaseService.uploadCaseFiles(files).pipe(
      catchError((error) => {
        this.errorService.handleError('Failed to upload files');
        return throwError(() => error);
      }),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
