import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { DocumentData, DocumentReference } from '@angular/fire/firestore';
import {
  BehaviorSubject,
  catchError,
  finalize,
  from,
  map,
  Observable,
  Subject,
  switchMap,
  take,
  takeUntil,
  tap,
  throwError,
} from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

import { FirebaseService } from './firebase.service';
import { BlogPost, BlogPostFileUrls } from '../models/models';
import { ErrorHandlingService } from './error-handling.service';
import { SlugService } from './slug.service';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private firebaseService = inject(FirebaseService);
  private errorService = inject(ErrorHandlingService);
  private slugService = inject(SlugService);
  private destroy$ = new Subject<void>();
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private platformId = inject(PLATFORM_ID);

  private postsSubject = new BehaviorSubject<BlogPost[]>([]);
  posts$ = this.postsSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadPosts();
    }
  }

  private refreshPosts(): void {
    this.loadPosts();
  }

  private loadPosts() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.loadingSubject.next(true);

    this.firebaseService
      .fetchPosts()
      .pipe(
        take(1),
        takeUntil(this.destroy$),
        tap((posts: BlogPost[]) => {
          this.slugService.updateBlogPosts(posts);
          this.postsSubject.next(posts as BlogPost[]);
          this.loadingSubject.next(false);
        }),
        catchError((error) => {
          this.errorService.handleError('Failed to load blog posts');
          this.loadingSubject.next(false);
          return throwError(() => error);
        })
      )
      .subscribe({
        error: (error: any) => console.error('Subscription error:', error),
        complete: () => {},
      });
  }

  deletePost(post: BlogPost): Observable<void> {
    if (!post.id) {
      return throwError(() => new Error('Post ID is required'));
    }

    this.loadingSubject.next(true);

    return this.firebaseService.deletePost(post).pipe(
      take(1),
      tap(() => this.refreshPosts()),
      catchError((error) => {
        this.errorService.handleError('Failed to delete blog post');
        return throwError(() => error);
      }),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  updatePost(id: string, data: Partial<BlogPost>): Observable<void> {
    this.loadingSubject.next(true);

    if (data.title) {
      return this.slugService.updateBlogSlug(id, data.title).pipe(
        take(1),
        switchMap((slug) => {
          const updateData = { ...data, slug };

          return from(this.firebaseService.updatePost(id, updateData)).pipe(
            take(1),
            tap(() => {
              this.refreshPosts();
            }),
            catchError((error) => {
              this.errorService.handleError('Failed to update blog post');
              return throwError(() => error);
            }),
            finalize(() => {
              this.loadingSubject.next(false);
            })
          );
        })
      );
    }

    return from(this.firebaseService.updatePost(id, data)).pipe(
      take(1),
      tap(() => {
        this.refreshPosts();
      }),
      catchError((error) => {
        this.errorService.handleError('Failed to update blog post');
        return throwError(() => error);
      }),
      finalize(() => {
        this.loadingSubject.next(false);
      })
    );
  }

  createPost(
    postData: Partial<BlogPost>
  ): Observable<DocumentReference<DocumentData>> {
    this.loadingSubject.next(true);

    return this.slugService.createBlogSlug(postData.title || '').pipe(
      take(1),
      switchMap((slug) => {
        const data = { ...postData, slug };

        return from(this.firebaseService.createPost(data)).pipe(take(1));
      }),
      tap(() => {
        this.refreshPosts();
      }),
      catchError((error) => {
        this.errorService.handleError('Failed to create blog post');
        return throwError(() => error);
      }),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  getPostBySlug(slug: string): Observable<BlogPost | undefined> {
    return this.posts$.pipe(
      map((posts) => posts.find((post) => post.slug === slug))
    );
  }

  archivePost(post: BlogPost): Observable<void> {
    if (!post.id) {
      return throwError(() => new Error('Post ID is required'));
    }

    return this.updatePost(post.id, { ...post, archive: true }).pipe(take(1));
  }

  unArchivePost(post: BlogPost): Observable<void> {
    if (!post.id) {
      return throwError(() => new Error('Post ID is required'));
    }

    return this.updatePost(post.id, { ...post, archive: false }).pipe(take(1));
  }

  uploadFiles(files: {
    mainImg?: File;
    imageCard?: File;
  }): Observable<BlogPostFileUrls> {
    this.loadingSubject.next(true);

    return this.firebaseService.uploadBlogPostFiles(files).pipe(
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
