import { Component, HostListener, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { AuthService } from '../../services/auth.service';

import { IconComponent } from '../../shared/icon/icon.component';
import { ButtonComponent } from '../../shared/button/button.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent, ButtonComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  isMobileMenuOpen: boolean = false;
  isServicesSubmenuOpen: boolean = false;
  isMobileServicesSubmenuOpen: boolean = false;
  destroy$ = new Subject<void>();
  error: string = '';
  user$;

  constructor(private authService: AuthService, private router: Router) {
    this.user$ = this.authService.user$;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  toggleServicesSubmenu() {
    this.isServicesSubmenuOpen = !this.isServicesSubmenuOpen;
  }

  toggleMobileServicesSubmenu() {
    this.isMobileServicesSubmenuOpen = !this.isMobileServicesSubmenuOpen;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    if (window.innerWidth >= 768) {
      this.isMobileMenuOpen = false;
    }
  }

  onLogout() {
    this.authService
      .signOut()
      .pipe(
        tap(() => {
          this.router.navigate(['/home']);
        }),
        catchError((error) => {
          this.error = 'Failed to log out.';
          return of(null);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  ngOnDelete() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
