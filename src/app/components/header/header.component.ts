import {
  Component,
  HostListener,
  Renderer2,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { catchError, filter, takeUntil, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { AuthService } from '../../services/auth.service';

import { IconComponent } from '../../shared/icon/icon.component';
import { ButtonComponent } from '../../shared/button/button.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent, ButtonComponent],
  templateUrl: './header.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
})
export class HeaderComponent {
  isMobileMenuOpen: boolean = false;
  destroy$ = new Subject<void>();
  error: string = '';
  user$;
  isBrowser: boolean;

  constructor(
    private authService: AuthService,
    private router: Router,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.user$ = this.authService.user$;
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    // Close mobile menu on route change
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.closeMobileMenu();
      });
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    if (this.isBrowser) {
      if (this.isMobileMenuOpen) {
        this.renderer.addClass(document.documentElement, 'mobile-menu-open');
      } else {
        this.renderer.removeClass(document.documentElement, 'mobile-menu-open');
      }
    }
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
    if (this.isBrowser) {
      this.renderer.removeClass(document.documentElement, 'mobile-menu-open');
    }
  }

  onLogoutAndCloseMobileMenu() {
    this.closeMobileMenu();
    this.onLogout();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    if (this.isBrowser && window.innerWidth >= 768) {
      this.closeMobileMenu();
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

  ngOnDestroy() {
    if (this.isBrowser) {
      this.renderer.removeClass(document.documentElement, 'mobile-menu-open');
    }
    this.destroy$.next();
    this.destroy$.complete();
  }
}
