import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithPopup,
  GoogleAuthProvider,
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from '@angular/fire/auth';
import {
  BehaviorSubject,
  catchError,
  from,
  Observable,
  of,
  switchMap,
  tap,
  throwError,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private auth: Auth) {
    this.auth.onAuthStateChanged((user) => {
      this.userSubject.next(user);
    });
  }

  signInWithGoogle(): Observable<User> {
    const provider = new GoogleAuthProvider();
    return from(signInWithPopup(this.auth, provider)).pipe(
      switchMap((result) => of(result.user)),
      catchError((error) => {
        console.error('Authentication failed:', error);
        return throwError(() => new Error('Authentication failed'));
      })
    );
  }

  signInWithEmailAndPassword(
    email: string,
    password: string
  ): Observable<User> {
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap((result) => of(result.user)),
      catchError((error) => {
        console.error('Email/Password authentication failed:', error);
        return throwError(
          () => new Error('Email/Password authentication failed')
        );
      })
    );
  }

  signUp(email: string, password: string): Observable<User> {
    return from(
      createUserWithEmailAndPassword(this.auth, email, password)
    ).pipe(
      switchMap((result) => of(result.user)),
      catchError((error) => {
        console.error('Sign up failed:', error);
        return throwError(() => new Error('Sign up failed'));
      })
    );
  }

  signOut(): Observable<void> {
    return from(this.auth.signOut()).pipe(
      tap(() => {
        this.userSubject.next(null);
      }),
      catchError((error) => {
        console.error('Sign out failed:', error);
        return throwError(() => new Error('Sign out failed'));
      })
    );
  }
}
