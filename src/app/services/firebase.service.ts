import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  DocumentReference,
} from '@angular/fire/firestore';
import {
  Storage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  uploadBytesResumable,
} from '@angular/fire/storage';
import {
  Observable,
  from,
  forkJoin,
  of,
  map,
  switchMap,
  catchError,
  tap,
  throwError,
  takeUntil,
  Subject,
  take,
} from 'rxjs';

import {
  BlogPost,
  BlogPostFileUrls,
  Case,
  CaseFileUrls,
} from '../models/models';
import { isPlatformBrowser } from '@angular/common';

interface DeleteFileResult {
  success: boolean;
  path: string;
  error?: any;
}

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  firestore: Firestore = inject(Firestore);
  private storage: Storage = inject(Storage);
  private platformId = inject(PLATFORM_ID);

  private destroy$ = new Subject<void>();

  constructor() {}

  private checkPlatform(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      console.warn('Firebase operations are not available during SSR');
      return false;
    }
    return true;
  }

  // CRUD operation for Case
  fetchCases(): Observable<Case[]> {
    if (!this.checkPlatform()) {
      return of([]);
    }

    const casesRef = collection(this.firestore, 'cases');
    return collectionData(casesRef, { idField: 'id' }) as Observable<Case[]>;
  }

  createCase(data: Partial<Case>): Observable<DocumentReference> {
    const casesRef = collection(this.firestore, 'cases');
    return from(addDoc(casesRef, data)).pipe(take(1));
  }

  updateCase(id: string, data: Partial<Case>): Observable<void> {
    return new Observable<void>((observer) => {
      const caseRef = doc(this.firestore, 'cases', id);
      const cleanData = Object.entries(data).reduce((acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, any>);

      updateDoc(caseRef, cleanData)
        .then(() => {
          observer.next();
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });

      return () => {};
    }).pipe(
      take(1),
      tap({
        next: () => {},
        complete: () => {},
        error: (error) => console.log('Firebase pipe error:', error),
      })
    );
  }

  deleteCase(caseItem: Case): Observable<void> {
    if (!caseItem.id) {
      return throwError(() => new Error('Case ID is required'));
    }

    const fileUrls = [
      caseItem.homePage?.imageUrl,
      caseItem.imageCardUrl,
      caseItem.imageCardSvg,
      caseItem.videoUrl,
      caseItem.page?.mainImgUrl,
      caseItem.page?.sideImgUrl,
    ].filter((url) => url && url.includes('firebase')) as string[];

    const deleteFileObservables = fileUrls.map((url) =>
      this.deleteFileByUrl(url)
    );

    if (deleteFileObservables.length === 0) {
      return from(deleteDoc(doc(this.firestore, 'cases', caseItem.id)));
    }

    return forkJoin([
      ...deleteFileObservables,
      from(deleteDoc(doc(this.firestore, 'cases', caseItem.id))),
    ]).pipe(
      map((results) => {
        const fileResults = results.slice(0, -1) as DeleteFileResult[];
        const realErrors = fileResults.filter(
          (r) => !r.success && r.error?.code !== 'storage/object-not-found'
        );

        if (realErrors.length > 0) {
          console.warn('Some files failed to delete:', realErrors);
        }
        return void 0;
      }),
      catchError((error) => {
        if (error.code === 'storage/object-not-found') {
          return of(void 0);
        }
        console.error('Error deleting case:', error);
        return throwError(() => error);
      })
    );
  }

  private deleteFileByUrl(url: string): Observable<DeleteFileResult> {
    const path = this.getPathFromUrl(url);
    if (!path) return of({ success: true, path: url });

    const storageRef = ref(this.storage, path);

    return this.checkFileExists(path).pipe(
      switchMap((exists) => {
        if (!exists) {
          return of({ success: true, path, info: 'File does not exist' });
        }
        return from(deleteObject(storageRef)).pipe(
          map(() => ({ success: true, path })),
          catchError((error) => {
            if (error.code === 'storage/object-not-found') {
              return of({ success: true, path, info: 'File already deleted' });
            }
            console.warn('Error deleting file:', error);
            return of({ success: false, path, error });
          })
        );
      }),
      catchError((error) => {
        console.warn('File check failed:', error);
        return of({ success: false, path, error });
      })
    );
  }

  private getPathFromUrl(url: string): string | null {
    try {
      if (!url.includes('firebase')) {
        return null;
      }

      const decodedUrl = decodeURIComponent(url);
      const startIndex = decodedUrl.indexOf('/o/') + 3;
      const endIndex = decodedUrl.indexOf('?');

      if (startIndex === -1 || endIndex === -1) {
        return null;
      }

      const path = decodedUrl.substring(startIndex, endIndex);
      return path || null;
    } catch (error) {
      console.error('Error parsing URL:', error);
      return null;
    }
  }

  private checkFileExists(path: string): Observable<boolean> {
    const storageRef = ref(this.storage, path);
    return from(getDownloadURL(storageRef)).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  uploadCaseFiles(files: {
    mainImg?: File;
    sideImg?: File;
    imageCard?: File;
    video?: File;
    svg?: File;
  }): Observable<CaseFileUrls> {
    if (!this.checkPlatform()) {
      return throwError(
        () => new Error('File upload not available during SSR')
      );
    }

    const uploadTasks: Observable<Partial<CaseFileUrls>>[] = [];
    const totalFiles = Object.values(files).filter(Boolean).length;
    let completedFiles = 0;

    if (files.mainImg) {
      uploadTasks.push(
        this.uploadFile(files.mainImg, 'mainImages').pipe(
          tap(() => {
            completedFiles++;
          }),
          map((url): Partial<CaseFileUrls> => ({ mainImgUrl: url }))
        )
      );
    }

    if (files.sideImg) {
      uploadTasks.push(
        this.uploadFile(files.sideImg, 'sideImages').pipe(
          tap(() => {
            completedFiles++;
          }),
          map((url): Partial<CaseFileUrls> => ({ sideImgUrl: url }))
        )
      );
    }

    if (files.imageCard) {
      uploadTasks.push(
        this.uploadFile(files.imageCard, 'cardImages').pipe(
          tap(() => {
            completedFiles++;
          }),
          map((url): Partial<CaseFileUrls> => ({ imageCardUrl: url }))
        )
      );
    }

    if (files.video) {
      uploadTasks.push(
        this.uploadFile(files.video, 'videos').pipe(
          tap(() => {
            completedFiles++;
          }),
          map((url): Partial<CaseFileUrls> => ({ videoUrl: url }))
        )
      );
    }

    if (files.svg) {
      uploadTasks.push(
        this.uploadFile(files.svg, 'svgs').pipe(
          tap(() => {
            completedFiles++;
          }),
          map((url): Partial<CaseFileUrls> => ({ imageCardSvg: url }))
        )
      );
    }

    return uploadTasks.length
      ? forkJoin(uploadTasks).pipe(
          map((results) =>
            results.reduce(
              (acc, curr) => ({ ...acc, ...curr }),
              {} as CaseFileUrls
            )
          )
        )
      : of({} as CaseFileUrls);
  }

  private uploadFile(file: File, path: string): Observable<string> {
    const storageRef = ref(this.storage, `cases/${path}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Observable<string>((observer) => {
      uploadTask
        .then((snapshot) => {
          getDownloadURL(snapshot.ref).then((url) => {
            observer.next(url);
            observer.complete();
          });
        })
        .catch((error) => {
          console.error(`Error uploading file to ${path}:`, error);
          observer.next('');
          observer.complete();
        });

      return () => {
        uploadTask.cancel();
      };
    });
  }

  // Blog post operations

  fetchPosts(): Observable<BlogPost[]> {
    if (!this.checkPlatform()) {
      return of([]);
    }

    const articlesRef = collection(this.firestore, 'blog');
    return collectionData(articlesRef, { idField: 'id' }) as Observable<
      BlogPost[]
    >;
  }

  createPost(data: any) {
    const articlesRef = collection(this.firestore, 'blog');
    return addDoc(articlesRef, data);
  }

  updatePost(id: string, data: any) {
    const articleRef = doc(this.firestore, 'blog', id);
    return updateDoc(articleRef, data);
  }

  deletePost(post: BlogPost): Observable<void> {
    if (!post.id) {
      return throwError(() => new Error('BlogPost ID is required'));
    }

    const fileUrls = [post.content?.mainImgUrl, post.cardImgUrl].filter(
      (url) => url && url.includes('firebase')
    ) as string[];

    const deleteFileObservables = fileUrls.map((url) =>
      this.deleteFileByUrl(url)
    );

    if (deleteFileObservables.length === 0) {
      return from(deleteDoc(doc(this.firestore, 'blog', post.id)));
    }

    return forkJoin([
      ...deleteFileObservables,
      from(deleteDoc(doc(this.firestore, 'blog', post.id))),
    ]).pipe(
      map((results) => {
        const fileResults = results.slice(0, -1) as DeleteFileResult[];
        const realErrors = fileResults.filter(
          (r) => !r.success && r.error?.code !== 'storage/object-not-found'
        );

        if (realErrors.length > 0) {
          console.warn('Some files failed to delete:', realErrors);
        }
        return void 0;
      }),
      catchError((error) => {
        if (error.code === 'storage/object-not-found') {
          return of(void 0);
        }
        console.error('Error deleting blog post:', error);
        return throwError(() => error);
      })
    );
  }

  uploadBlogPostFiles(files: {
    mainImg?: File;
    imageCard?: File;
  }): Observable<BlogPostFileUrls> {
    if (!this.checkPlatform()) {
      return throwError(
        () => new Error('File upload not available during SSR')
      );
    }

    const uploadTasks: Observable<Partial<BlogPostFileUrls>>[] = [];
    const totalFiles = Object.values(files).filter(Boolean).length;
    let completedFiles = 0;

    if (files.mainImg) {
      uploadTasks.push(
        this.uploadFile(files.mainImg, 'mainImages').pipe(
          tap(() => {
            completedFiles++;
          }),
          map((url): Partial<BlogPostFileUrls> => ({ mainImgUrl: url }))
        )
      );
    }

    if (files.imageCard) {
      uploadTasks.push(
        this.uploadFile(files.imageCard, 'cardImages').pipe(
          tap(() => {
            completedFiles++;
          }),
          map((url): Partial<BlogPostFileUrls> => ({ cardImgUrl: url }))
        )
      );
    }

    return uploadTasks.length
      ? forkJoin(uploadTasks).pipe(
          map((results) =>
            results.reduce(
              (acc, curr) => ({ ...acc, ...curr }),
              {} as BlogPostFileUrls
            )
          )
        )
      : of({} as BlogPostFileUrls);
  }
}
