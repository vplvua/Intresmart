import { Component } from '@angular/core';
import { ButtonComponent } from '../../shared/button/button.component';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, of, Subject, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ButtonComponent, FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  error: string = '';
  user$;
  destroy$ = new Subject<void>();

  constructor(private authService: AuthService, private router: Router) {
    this.user$ = this.authService.user$;
  }

  onLogIn() {
    this.authService
      .signInWithEmailAndPassword(this.email, this.password)
      .pipe(
        tap(() => {
          // this.router.navigate(['/blog']);
        }),
        catchError((error) => {
          this.error = 'Failed to log in. Please check your credentials.';
          return of(null);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  onGoogleSignIn() {
    this.authService
      .signInWithGoogle()
      .pipe(
        tap(() => {
          // this.router.navigate(['/blog']);
        }),
        catchError((error) => {
          this.error = 'Failed to log in with Google.';
          return of(null);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  onLogout() {
    this.authService
      .signOut()
      .pipe(
        tap(() => {
          // this.router.navigate(['/home']);
        }),
        catchError((error) => {
          this.error = 'Failed to log out.';
          return of(null);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
